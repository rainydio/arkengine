import {
	CoreGroup,
	CoreType,
	ISecondSignatureHandler,
	ISecondSignatureService,
	SecondSignatureAsset,
} from "@arkengine/core";
import { inject, injectable } from "inversify";

@injectable()
export class SecondSignatureHandler implements ISecondSignatureHandler {
	public readonly group = CoreGroup;
	public readonly type = CoreType.SecondSignature;

	public constructor(
		@inject(ISecondSignatureService)
		private readonly secondSignatureService: ISecondSignatureService
	) {}

	public handleTransaction1(senderAddress: Buffer, asset: SecondSignatureAsset): void {
		try {
			this.secondSignatureService.enable(senderAddress, asset.secondPublicKey);
		} catch (error) {
			throw new Error(`Failed to enable second signature. ${error.message}`);
		}
	}

	public handleTransaction2(senderAddress: Buffer, asset: SecondSignatureAsset): void {
		this.handleTransaction1(senderAddress, asset);
	}
}
