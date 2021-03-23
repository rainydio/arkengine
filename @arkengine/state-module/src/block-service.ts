import { IBlockService } from "@arkengine/state";
import assert from "assert";
import { injectable } from "inversify";

const db = {
	height: 0,
	id: undefined as Buffer | undefined,
	totalAmount: 0n,
	totalFee: 0n,
};

@injectable()
export class BlockService implements IBlockService {
	public getTotalAmount(): bigint {
		return db.totalAmount;
	}

	public getTotalFee(): bigint {
		return db.totalFee;
	}

	public increaseTotalAmount(amount: bigint): void {
		db.totalAmount += amount;
	}

	public increaseTotalFee(fee: bigint): void {
		db.totalFee += fee;
	}

	public getId(): Buffer {
		assert(db.id);
		return db.id;
	}

	public getHeight(): number {
		return db.height;
	}

	public startNewBlock(id: Buffer): void {
		db.totalAmount = 0n;
		db.totalFee = 0n;
		db.height++;
		db.id = id;
	}
}
