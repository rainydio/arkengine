import { Dbi, DbiOptions, Env, Key, Txn } from "node-lmdb";

export interface IDbUtils {
	keys<O extends DbiOptions>(dbi: Dbi<O>, options?: { from?: Key<O>; reverse?: boolean }): Iterable<Key<O>>;
	dups<O extends DbiOptions & { dupSort: true }>(
		dbi: Dbi<O>,
		key: Key<O>,
		options?: { from?: Buffer; reverse?: boolean }
	): Iterable<Buffer>;
}

export interface IDbEnvContext {
	getEnv(): Env;
	openEnvSync<T>(cb: () => T): T;
	openEnvAsync<T>(cb: () => Promise<T>): Promise<T>;
}

export interface IDbTxnContext {
	getTxn(): Txn;
	runReadTxnSync<T>(cb: () => T): T;
	runReadTxnAsync<T>(cb: () => Promise<T>): Promise<T>;
	runWriteTxnSync<T>(cb: () => T): T;
}

export interface IDbProvider {
	getKeyValueDb(name: string): IKeyValueDb;
	getKeyValueSetDb(name: string): IKeyValueSetDb;
}

export interface IKeyValueDb {
	has(key: Buffer): boolean;
	get(key: Buffer): Buffer;
	set(key: Buffer, value: Buffer): void;
	delete(key: Buffer): void;
	keys(options?: { from?: Buffer; reverse?: boolean }): Iterable<Buffer>;
}

export interface IKeyValueSetDb {
	has(key: Buffer, value: Buffer): boolean;
	get(key: Buffer, options?: { from?: Buffer; reverse?: boolean }): Iterable<Buffer>;
	add(key: Buffer, value: Buffer): void;
	remove(key: Buffer, value: Buffer): void;
	clear(key: Buffer): void;
	keys(options?: { from?: Buffer; reverse?: boolean }): Iterable<Buffer>;
}

export const IDbUtils = Symbol(`IDbUtils@${__filename}`);
export const IDbEnvContext = Symbol(`IDbEnvContext@${__filename}`);
export const IDbTxnContext = Symbol(`IDbTxnContext@${__filename}`);
export const IDbProvider = Symbol(`IDbProvider@${__filename}`);
