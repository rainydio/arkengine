import { IDbEnvContext, IDbTxnContext, IDbUtils, IKeyValueDb } from "@arkengine/db";
import assert from "assert";
import { Dbi, DbiOptions } from "node-lmdb";

export class KeyValueDb implements IKeyValueDb {
	private readonly dbi: Dbi<DbiOptions & { keyIsBuffer: true }>;

	public constructor(
		name: string,
		dbEnvContext: IDbEnvContext,
		private readonly dbTxnContext: IDbTxnContext,
		private readonly dbUtils: IDbUtils
	) {
		this.dbi = dbEnvContext.getEnv().openDbi({
			name,
			create: true,
			keyIsBuffer: true,
		});
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
		this.dbTxnContext.getTxn().del(this.dbi, key);
	}

	public keys(options?: { from?: Buffer; reverse?: boolean }): Iterable<Buffer> {
		return this.dbUtils.keys(this.dbi, options);
	}
}
