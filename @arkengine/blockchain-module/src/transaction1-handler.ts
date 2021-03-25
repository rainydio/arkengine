import {
	ICurrentBlock,
	ICurrentTransaction,
	ITransaction1Handler,
	ITransaction1HandlerPlugin,
	Transaction1,
} from "@arkengine/blockchain";
import { ITransaction1Serde } from "@arkengine/blockchain-serde";
import { ISecondSignatureService } from "@arkengine/core";
import { IAddressService, IBalanceService, IEcdsaService } from "@arkengine/state";
import { inject, injectable, multiInject, optional } from "inversify";

@injectable()
export class Transaction1Handler implements ITransaction1Handler {
	public constructor(
		@inject(ITransaction1Serde)
		private readonly transaction1Serde: ITransaction1Serde,

		@inject(ICurrentBlock)
		private readonly currentBlock: ICurrentBlock,

		@inject(ICurrentTransaction)
		private readonly currentTransaction: ICurrentTransaction,

		@inject(IAddressService)
		private readonly addressService: IAddressService,

		@inject(IBalanceService)
		private readonly balanceService: IBalanceService,

		@inject(IEcdsaService)
		private readonly ecdsaService: IEcdsaService,

		@inject(ISecondSignatureService)
		private readonly secondSignatureService: ISecondSignatureService,

		@optional()
		@multiInject(ITransaction1HandlerPlugin)
		private readonly plugins?: ITransaction1HandlerPlugin<Transaction1>[]
	) {}

	public handle(transactionBuffer: Buffer): void {
		const transaction = this.transaction1Serde.deserialize(transactionBuffer);
		const transactionId = this.transaction1Serde.getId(transaction);

		this.currentTransaction.startNewTransaction(transactionId, () => {
			const senderAddress = this.addressService.convertPublicKeyToAddress(transaction.senderPublicKey);

			this.balanceService.burn(senderAddress, transaction.fee);
			this.currentBlock.increaseTotalFee(transaction.fee);

			// if (transaction.network !== 23) {
			// 	throw new Error("Invalid transaction network.");
			// }

			try {
				this.ecdsaService.verify(
					transaction.senderPublicKey,
					this.transaction1Serde.getPrimaryHash(transaction),
					transaction.signature.primary
				);
			} catch (error) {
				throw new Error(`Failed to verify primary signature. ${error.message}`);
			}

			if (this.secondSignatureService.isEnabled(senderAddress)) {
				try {
					if (!transaction.signature.second) {
						throw new Error("Missing second signature.");
					}

					this.secondSignatureService.verify(
						senderAddress,
						this.transaction1Serde.getSecondHash(transaction),
						transaction.signature.second
					);
				} catch (error) {
					throw new Error(`Failed to verify second signature. ${error.message}`);
				}
			}

			// if (this.legacyMultiSignatureService.isEnabled(senderAddress)) {
			// 	try {
			// 		if (!transaction.signature.multi) {
			// 			throw new Error("Missing multi-signature.");
			// 		}

			// 		this.legacyMultiSignatureService.verify(
			// 			senderAddress,
			// 			this.transaction1Serde.getMultiHash(transaction),
			// 			transaction.signature.multi
			// 		);
			// 	} catch (error) {
			// 		throw new Error(`Failed to verify multi-signature. ${error.message}`);
			// 	}
			// }

			this.handleTransaction1ByPlugin(transaction.type, senderAddress, transaction.asset);
		});
	}

	public handleTransaction1ByPlugin(type: number, senderAddress: Buffer, asset: unknown): void {
		for (const plugin of this.plugins ?? []) {
			if (plugin.type === type) {
				plugin.handleTransaction1(senderAddress, asset);
				return;
			}
		}

		throw new Error(`Transaction1HandlerPlugin for type "${type}" not found.`);
	}
}
