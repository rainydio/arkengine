import { ICurrentBlock } from "@arkengine/blockchain";
import { CoreGroup, CoreType, ITransferHandler, TransferAsset } from "@arkengine/core";
import { IAddressService, IBalanceService } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class TransferHandler implements ITransferHandler {
	public readonly group: CoreGroup;
	public readonly type = CoreType.Transfer;

	public constructor(
		@inject(ICurrentBlock)
		private readonly currentBlock: ICurrentBlock,

		@inject(IAddressService)
		private readonly addressService: IAddressService,

		@inject(IBalanceService)
		private readonly balanceService: IBalanceService
	) {}

	public handleTransaction1(senderAddress: Buffer, asset: TransferAsset): void {
		try {
			try {
				this.addressService.verifyAddressNetwork(asset.recipientAddress);
			} catch (error) {
				throw new Error(`Invalid recipient address. ${error.message}`);
			}

			this.balanceService.transfer(senderAddress, asset.recipientAddress, asset.amount);
			this.currentBlock.increaseTotalAmount(asset.amount);
		} catch (error) {
			throw new Error(`Transfer failed. ${error.message}`);
		}
	}

	public handleTransaction2(senderAddress: Buffer, asset: TransferAsset): void {
		this.handleTransaction1(senderAddress, asset);
	}
}
