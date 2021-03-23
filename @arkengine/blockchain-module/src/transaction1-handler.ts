import {
	ILegacyWorkaround,
	ITransaction1Handler,
	ITransaction1HandlerPlugin,
	Transaction1,
} from "@arkengine/blockchain";
import { ITransaction1Serde } from "@arkengine/blockchain-serde";
import {
	IAddressService,
	IBlockService,
	IEcdsaService,
	ILegacyMultiSignatureService,
	ISecondSignatureService,
} from "@arkengine/state";
import { inject, injectable, multiInject, optional } from "inversify";

@injectable()
export class Transaction1Handler implements ITransaction1Handler {
	public constructor(
		@inject(ITransaction1Serde)
		private readonly transaction1Serde: ITransaction1Serde,

		@inject(IBlockService)
		private readonly blockService: IBlockService,

		@inject(IAddressService)
		private readonly addressService: IAddressService,

		@inject(IEcdsaService)
		private readonly ecdsaService: IEcdsaService,

		@inject(ISecondSignatureService)
		private readonly secondSignatureService: ISecondSignatureService,

		@inject(ILegacyMultiSignatureService)
		private readonly legacyMultiSignatureService: ILegacyMultiSignatureService,

		@optional()
		@multiInject(ITransaction1HandlerPlugin)
		private readonly plugins?: ITransaction1HandlerPlugin<Transaction1>[],

		@optional()
		@inject(ILegacyWorkaround)
		private readonly legacyWorkaround?: ILegacyWorkaround
	) {}

	public handle(transactionId: Buffer, transaction: Transaction1): void {
		const senderAddress = this.addressService.convertPublicKeyToAddress(transaction.senderPublicKey);

		if (this.legacyWorkaround?.isTrustedTransactionId(transactionId)) {
			this.handleTransaction1ByPlugin(transaction.type, transactionId, senderAddress, transaction.asset);
			return;
		}

		if (transaction.network !== 23) {
			throw new Error("Invalid transaction network.");
		}

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

		if (this.legacyMultiSignatureService.isEnabled(senderAddress)) {
			try {
				if (!transaction.signature.multi) {
					throw new Error("Missing multi-signature.");
				}

				this.legacyMultiSignatureService.verify(
					senderAddress,
					this.transaction1Serde.getMultiHash(transaction),
					transaction.signature.multi
				);
			} catch (error) {
				throw new Error(`Failed to verify multi-signature. ${error.message}`);
			}
		}

		this.handleTransaction1ByPlugin(transaction.type, transactionId, senderAddress, transaction.asset);
	}

	public handleTransaction1ByPlugin(type: number, transactionId: Buffer, senderAddress: Buffer, asset: unknown): void {
		for (const plugin of this.plugins ?? []) {
			if (plugin.type === type) {
				plugin.handleTransaction1(transactionId, senderAddress, asset);
				return;
			}
		}

		throw new Error(`Transaction1HandlerPlugin for type "${type}" not found.`);
	}
}
