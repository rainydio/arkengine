import { IDbEnvContext, IDbTxnContext, IKeyValueDb } from "@arkengine/db";
import assert from "assert";
import { Dbi, DbiOptions } from "node-lmdb";

import { Utils } from "./utils";

export class KeyValueDb implements IKeyValueDb {
	#dbi?: Dbi<DbiOptions & { keyIsBuffer: true }>;

	public constructor(
		private readonly name: string,
		private readonly dbEnvContext: IDbEnvContext,
		private readonly dbTxnContext: IDbTxnContext,
		private readonly utils: Utils
	) {}

	private get dbi(): Dbi<DbiOptions & { keyIsBuffer: true }> {
		if (!this.#dbi) {
			this.#dbi = this.dbEnvContext.getEnv().openDbi({
				name: this.name,
				create: true,
				keyIsBuffer: true,
				txn: this.dbTxnContext.getTxn(),
			});
		}

		return this.#dbi;
	}

	public has(key: Buffer): boolean {
		return this.dbTxnContext.getTxn().getBinary(this.dbi, key) !== null;
	}

	public get(key: Buffer): Buffer {
		const value = this.dbTxnContext.getTxn().getBinary(this.dbi, key);
		assert(value);
		return value;
	}

	public set(key: Buffer, value: Buffer): void {
		this.dbTxnContext.getTxn().putBinary(this.dbi, key, value);
	}

	public delete(key: Buffer): void {
		if (this.has(key)) {
			this.dbTxnContext.getTxn().del(this.dbi, key);
		}
	}

	public keys(options?: { from?: Buffer; reverse?: boolean }): Iterable<Buffer> {
		return this.utils.keys(this.dbi, options);
	}
}
