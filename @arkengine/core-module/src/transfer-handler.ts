import { CoreGroup, CoreType, ITransferHandler, TransferAsset } from "@arkengine/core";
import { IAddressService, IBalanceService } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class TransferHandler implements ITransferHandler {
	public readonly group: CoreGroup;
	public readonly type = CoreType.Transfer;

	public constructor(
		@inject(IAddressService)
		private readonly addressService: IAddressService,

		@inject(IBalanceService)
		private readonly balanceService: IBalanceService
	) {}

	public handleTransaction1(transactionId: Buffer, senderAddress: Buffer, asset: TransferAsset): void {
		try {
			this.addressService.verifyAddressNetwork(asset.recipientAddress);
		} catch (error) {
			throw new Error(`Invalid recipient address. ${error.message}`);
		}

		try {
			this.balanceService.transfer(senderAddress, asset.recipientAddress, asset.amount);
		} catch (error) {
			throw new Error(`Failed to execute transfer. ${error.message}`);
		}
	}

	public handleTransaction2(transactionId: Buffer, senderAddress: Buffer, asset: TransferAsset): void {
		this.handleTransaction1(transactionId, senderAddress, asset);
	}
}
