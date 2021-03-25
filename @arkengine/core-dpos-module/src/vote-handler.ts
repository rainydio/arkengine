import { CoreGroup, CoreType } from "@arkengine/core";
import { IVoteHandler, VoteAsset } from "@arkengine/core-dpos";
import { injectable } from "inversify";

@injectable()
export class VoteHandler implements IVoteHandler {
	public readonly group = CoreGroup;
	public readonly type = CoreType.Vote;

	public handleTransaction1(senderAddress: Buffer, asset: VoteAsset): void {
		// throw new Error("Method not implemented.");
	}

	public handleTransaction2(senderAddress: Buffer, asset: VoteAsset): void {
		// throw new Error("Method not implemented.");
	}
}
