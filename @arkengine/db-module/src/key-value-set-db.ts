import { IDbEnvContext, IDbTxnContext, IKeyValueSetDb } from "@arkengine/db";
import { Cursor, Dbi, DbiOptions } from "node-lmdb";

import { Utils } from "./utils";

export class KeyValueSetDb implements IKeyValueSetDb {
	#dbi?: Dbi<DbiOptions & { keyIsBuffer: true; dupSort: true }>;

	public constructor(
		private readonly name: string,
		private readonly dbEnvContext: IDbEnvContext,
		private readonly dbTxnContext: IDbTxnContext,
		private readonly utils: Utils
	) {}

	private get dbi(): Dbi<DbiOptions & { keyIsBuffer: true; dupSort: true }> {
		if (!this.#dbi) {
			this.#dbi = this.dbEnvContext.getEnv().openDbi({
				name: this.name,
				create: true,
				keyIsBuffer: true,
				dupSort: true,
				txn: this.dbTxnContext.getTxn(),
			});
		}

		return this.#dbi;
	}

	public has(key: Buffer, value: Buffer): boolean {
		const cursor = new Cursor(this.dbTxnContext.getTxn(), this.dbi);

		try {
			return cursor.goToDup(key, value) !== null;
		} finally {
			cursor.close();
		}
	}

	public get(key: Buffer, options?: { from?: Buffer; reverse?: boolean }): Iterable<Buffer> {
		return this.utils.dups(this.dbi, key, options);
	}

	public add(key: Buffer, value: Buffer): void {
		this.dbTxnContext.getTxn().putBinary(this.dbi, key, value);
	}

	public remove(key: Buffer, value: Buffer): void {
		if (this.has(key, value)) {
			this.dbTxnContext.getTxn().del(this.dbi, key, value);
		}
	}

	public clear(key: Buffer): void {
		if (this.dbTxnContext.getTxn().getBinary(this.dbi, key) !== null) {
			this.dbTxnContext.getTxn().del(this.dbi, key);
		}
	}

	public keys(options?: { from?: Buffer; reverse?: boolean }): Iterable<Buffer> {
		return this.utils.keys(this.dbi, options);
	}
}
