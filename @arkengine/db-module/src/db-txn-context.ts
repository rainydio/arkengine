import { IDbEnvContext, IDbTxnContext } from "@arkengine/db";
import assert from "assert";
import { inject, injectable } from "inversify";
import { Txn } from "node-lmdb";

@injectable()
export class TxnContext implements IDbTxnContext {
	private txn?: Txn;

	public constructor(
		@inject(IDbEnvContext)
		private readonly dbEnvContext: IDbEnvContext
	) {}

	public getTxn(): Txn {
		assert(this.txn);
		return this.txn;
	}

	public runReadTxnSync<T>(cb: () => T): T {
		assert(!this.txn);

		this.txn = this.dbEnvContext.getEnv().beginTxn({ readOnly: true });

		try {
			return cb();
		} finally {
			this.txn.abort();
			this.txn = undefined;
		}
	}

	public async runReadTxnAsync<T>(cb: () => Promise<T>): Promise<T> {
		assert(!this.txn);

		this.txn = this.dbEnvContext.getEnv().beginTxn({ readOnly: true });

		try {
			return await cb();
		} finally {
			this.txn.abort();
			this.txn = undefined;
		}
	}

	public runWriteTxnSync<T>(cb: () => T): T {
		assert(!this.txn);

		this.txn = this.dbEnvContext.getEnv().beginTxn({ readOnly: false });

		try {
			const result = cb();
			this.txn.commit();
			return result;
		} catch (error) {
			this.txn.abort();
			throw error;
		} finally {
			this.txn = undefined;
		}
	}
}
