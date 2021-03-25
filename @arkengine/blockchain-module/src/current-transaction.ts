import { ICurrentBlock, ICurrentTransaction } from "@arkengine/blockchain";
import { IExceptionsProvider } from "@arkengine/blockchain-settings";
import { inject, injectable } from "inversify";

@injectable()
export class CurrentTransaction implements ICurrentTransaction {
	private readonly trustedTransactionIds = new Set<string>();
	private transactionId?: Buffer;
	private trusted = false;

	public constructor(
		@inject(ICurrentBlock)
		private readonly currentBlock: ICurrentBlock,

		@inject(IExceptionsProvider)
		private readonly exceptionsProvider: IExceptionsProvider
	) {
		for (const transactionId of this.exceptionsProvider.getTrustedTransactionIds()) {
			this.trustedTransactionIds.add(transactionId.toString("hex"));
		}
	}

	public getId(): Buffer {
		if (!this.transactionId) {
			throw new Error("No current transaction.");
		}

		return this.transactionId;
	}

	public isTrusted(): boolean {
		if (!this.transactionId) {
			throw new Error("No current transaction.");
		}

		return this.trusted;
	}

	public startNewTransaction<T>(transactionId: Buffer, cb: () => T): T {
		if (this.transactionId) {
			throw new Error("Transaction already started.");
		}

		try {
			this.currentBlock.includeTransactionId(transactionId);

			this.transactionId = transactionId;
			this.trusted = this.trusted || this.currentBlock.getHeight() === 1;
			this.trusted = this.trusted || this.trustedTransactionIds.has(transactionId.toString("hex"));

			return cb();
		} catch (error) {
			throw new Error(`Transaction "${transactionId.toString("hex")}" failed. ${error.message}`);
		} finally {
			this.transactionId = undefined;
			this.trusted = false;
		}
	}
}
