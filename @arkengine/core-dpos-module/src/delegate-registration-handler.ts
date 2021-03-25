import { CoreGroup, CoreType } from "@arkengine/core";
import { DelegateRegistrationAsset, IDelegateRegistrationHandler } from "@arkengine/core-dpos";
import { injectable } from "inversify";

@injectable()
export class DelegateRegistrationHandler implements IDelegateRegistrationHandler {
	public readonly group = CoreGroup;
	public readonly type = CoreType.DelegateRegistration;

	public handleTransaction1(senderAddress: Buffer, asset: DelegateRegistrationAsset): void {
		//
	}

	public handleTransaction2(senderAddress: Buffer, asset: DelegateRegistrationAsset): void {
		//
	}
}
