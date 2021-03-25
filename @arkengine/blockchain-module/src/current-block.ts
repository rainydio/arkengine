import { ICurrentBlock, ICurrentMilestone } from "@arkengine/blockchain";
import { ILastBlockService } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class CurrentBlock implements ICurrentBlock {
	private blockId?: Buffer;
	private includedTransactionIds: Buffer[] = [];
	private totalAmount = 0n;
	private totalFee = 0n;

	public constructor(
		@inject(ILastBlockService)
		private readonly lastBlockService: ILastBlockService,

		@inject(ICurrentMilestone)
		private readonly currentMilestone: ICurrentMilestone
	) {}

	public getId(): Buffer {
		if (!this.blockId) {
			throw new Error("No current block.");
		}

		return this.blockId;
	}

	public getHeight(): number {
		return this.lastBlockService.getHeight() + 1;
	}

	public getTotalAmount(): bigint {
		return this.totalAmount;
	}

	public getTotalFee(): bigint {
		return this.totalFee;
	}

	public getIncludedTransactionIds(): readonly Buffer[] {
		return this.includedTransactionIds;
	}

	public startNewBlock<T>(blockId: Buffer, cb: () => T): T {
		try {
			if (this.blockId) {
				throw new Error("Block already started.");
			}

			this.currentMilestone.select(this.getHeight());
			this.blockId = blockId;
			const result = cb();

			this.lastBlockService.setNext(this.blockId);
			return result;
		} catch (error) {
			const lastHeight = this.lastBlockService.getHeight();
			if (lastHeight !== 0) {
				this.currentMilestone.select(lastHeight);
			}

			if (blockId.length === 8) {
				throw new Error(`Block ${blockId.readBigUInt64BE()} failed. ${error.message}`);
			} else {
				throw new Error(`Block ${blockId.toString("hex")} failed. ${error.message}`);
			}
		} finally {
			this.blockId = undefined;
			this.includedTransactionIds = [];
			this.totalAmount = 0n;
			this.totalFee = 0n;
		}
	}

	public increaseTotalAmount(amount: bigint): void {
		if (amount < 0n) {
			throw new Error(`"${amount}" is negative.`);
		}

		this.totalAmount += amount;
	}

	public increaseTotalFee(fee: bigint): void {
		if (fee < 0n) {
			throw new Error(`"${fee}" is negative.`);
		}

		this.totalFee += fee;
	}

	public includeTransactionId(transactionId: Buffer): void {
		this.includedTransactionIds.push(transactionId);
	}
}
