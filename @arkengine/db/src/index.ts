import { Env, Txn } from "node-lmdb";

export interface IDbEnvContext {
	getEnv(): Env;
	start<T>(cb: () => Promise<T>): Promise<T>;
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

export const IDbEnvContext = Symbol(`IDbEnvContext@${__filename}`);
export const IDbTxnContext = Symbol(`IDbTxnContext@${__filename}`);
export const IDbProvider = Symbol(`IDbProvider@${__filename}`);
