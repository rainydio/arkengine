import { IBlockHandler, ICurrentBlock, ICurrentMilestone, ITransaction1Handler } from "@arkengine/blockchain";
import { IBlockSerde } from "@arkengine/blockchain-serde";
import { IExceptionsProvider } from "@arkengine/blockchain-settings";
import { IAddressService, IBalanceService, IEcdsaService, ILastBlockService } from "@arkengine/state";
import assert from "assert";
import SHA256 from "bcrypto/lib/sha256";
import { inject, injectable } from "inversify";

@injectable()
export class BlockHandler implements IBlockHandler {
	private readonly reversedBlockIds = new Set<string>();

	public constructor(
		@inject(IExceptionsProvider)
		private readonly exceptionsProvider: IExceptionsProvider,

		@inject(IBlockSerde)
		private readonly blockSerde: IBlockSerde,

		@inject(ILastBlockService)
		private readonly lastBlockService: ILastBlockService,

		@inject(IEcdsaService)
		private readonly ecdsaService: IEcdsaService,

		@inject(ICurrentBlock)
		private readonly currentBlock: ICurrentBlock,

		@inject(ICurrentMilestone)
		private readonly currentMilestone: ICurrentMilestone,

		@inject(ITransaction1Handler)
		private readonly transaction1Handler: ITransaction1Handler,

		@inject(IAddressService)
		private readonly addressService: IAddressService,

		@inject(IBalanceService)
		private readonly balanceService: IBalanceService
	) {
		for (const blockId of this.exceptionsProvider.getReversedBlockIds()) {
			this.reversedBlockIds.add(blockId.toString("hex"));
		}
	}

	public handle(blockBuffer: Buffer): void {
		const previousBlockId = this.lastBlockService.getId();
		const block = this.blockSerde.deserialize(blockBuffer, { previousBlockIdLength: previousBlockId.length });

		if (block.previousBlockId.equals(previousBlockId) === false) {
			throw new Error("Invalid previous block id.");
		}

		this.ecdsaService.verify(block.generatorPublicKey, this.blockSerde.getHash(block), block.signature);

		this.currentBlock.startNewBlock(this.blockSerde.getIdLegacy(block), () => {
			const reversed = this.reversedBlockIds.has(this.currentBlock.getId().toString("hex"));
			const transactions = reversed ? block.transactions.slice().reverse() : block.transactions;

			for (const transactionBuffer of transactions) {
				if (this.currentMilestone.get().aip11) {
					throw new Error("AIP11 not implemented.");
				} else {
					this.transaction1Handler.handle(transactionBuffer);
				}
			}

			const includedTransactionIds = reversed
				? this.currentBlock.getIncludedTransactionIds().slice().reverse()
				: this.currentBlock.getIncludedTransactionIds();

			const actualTotalAmount = this.currentBlock.getTotalAmount();
			const actualTotalFee = this.currentBlock.getTotalFee();
			const actualPayloadHash = includedTransactionIds
				.reduce((sha256, id) => sha256.update(id), SHA256.ctx.init())
				.final();

			assert(actualTotalAmount === block.totalAmount);
			assert(actualTotalFee === block.totalFee);
			assert(actualPayloadHash.equals(block.payloadHash));

			const generatorAddress = this.addressService.convertPublicKeyToAddress(block.generatorPublicKey);
			this.balanceService.reward(generatorAddress, block.totalFee);
			this.balanceService.reward(generatorAddress, block.reward);
		});
	}
}
