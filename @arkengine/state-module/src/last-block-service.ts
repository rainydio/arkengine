import { ICurrentMilestone } from "@arkengine/blockchain";
import { ILastBlockDb, ILastBlockService } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class LastBlockService implements ILastBlockService {
	public constructor(
		@inject(ILastBlockDb)
		private readonly db: ILastBlockDb,

		@inject(ICurrentMilestone)
		private readonly currentMilestone: ICurrentMilestone
	) {}

	public getId(): Buffer {
		if (this.db.hasId()) {
			return this.db.getId();
		} else {
			if (this.currentMilestone.get().block?.idFullSha256) {
				return Buffer.alloc(32);
			} else {
				return Buffer.alloc(8);
			}
		}
	}

	public getHeight(): number {
		return this.db.getHeight();
	}

	public setNext(blockId: Buffer): void {
		if (this.currentMilestone.get().block?.idFullSha256) {
			if (blockId.length !== 32) {
				throw new Error(`Invalid block id.`);
			}
		} else {
			if (blockId.length !== 8) {
				throw new Error(`Invalid block id.`);
			}
		}

		this.db.setHeight(this.db.getHeight() + 1);
		this.db.setId(blockId);
	}
}
