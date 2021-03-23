import { IDbEnvContext, IDbTxnContext, IDbUtils, IKeyValueSetDb } from "@arkengine/db";
import { Cursor, Dbi, DbiOptions } from "node-lmdb";

export class KeyValueSetDb implements IKeyValueSetDb {
	private readonly dbi: Dbi<DbiOptions & { keyIsBuffer: true; dupSort: true }>;

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
			dupSort: true,
		});
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
		return this.dbUtils.dups(this.dbi, key, options);
	}

	public add(key: Buffer, value: Buffer): void {
		this.dbTxnContext.getTxn().putBinary(this.dbi, key, value);
	}

	public remove(key: Buffer, value: Buffer): void {
		this.dbTxnContext.getTxn().del(this.dbi, key, value);
	}

	public clear(key: Buffer): void {
		this.dbTxnContext.getTxn().del(this.dbi, key);
	}

	public keys(options?: { from?: Buffer; reverse?: boolean }): Iterable<Buffer> {
		return this.dbUtils.keys(this.dbi, options);
	}
}
