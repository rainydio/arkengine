export type Transaction = Transaction1 | Transaction2;

export type Block = {
	readonly version: 0;
	readonly timestamp: number;
	readonly height: number;
	readonly previousBlockId: Buffer;
	readonly totalAmount: bigint;
	readonly totalFee: bigint;
	readonly reward: bigint;
	readonly payloadLength: number;
	readonly payloadHash: Buffer;
	readonly generatorPublicKey: Buffer;
	readonly transactions: Transaction[];
	readonly signature: Buffer;
};

export type Transaction1 = {
	readonly version: 1;
	readonly network: number;
	readonly type: number;
	readonly timestamp: number;
	readonly senderPublicKey: Buffer;
	readonly fee: bigint;
	readonly vendorField: Buffer;
	readonly asset: unknown;
	readonly signature: {
		readonly primary: Buffer;
		readonly second?: Buffer;
		readonly multi?: Buffer[];
	};
};

export type Transaction2 = {
	readonly version: 2;
	readonly network: number;
	readonly group: number;
	readonly type: number;
	readonly senderPublicKey: Buffer;
	readonly nonce: bigint;
	readonly fee: bigint;
	readonly vendorField: Buffer;
	readonly asset: unknown;
	readonly signature: {
		readonly primary?: Buffer;
		readonly second?: Buffer;
		readonly multi?: readonly {
			readonly i: number;
			readonly signature: Buffer;
		}[];
	};
};

export interface ILegacyWorkaround {
	getBlockIdReplacement(id: Buffer): Buffer | undefined;
	getTransactionIdReplacement(id: Buffer): Buffer | undefined;
	isTrustedTransactionId(id: Buffer): boolean;
}

export interface IBlockHandler {
	handle(block: Block): void;
}

export interface ITransaction1Handler {
	handle(transactionId: Buffer, transaction: Transaction1): void;
}

export interface ITransaction2Handler {
	handle(transactionId: Buffer, transaction: Transaction2): void;
}

export interface ITransaction1HandlerPlugin<T extends Transaction1> {
	readonly type: T["type"];

	handleTransaction1(transactionId: Buffer, senderAddress: Buffer, asset: T["asset"]): void;
}

export interface ITransaction2HandlerPlugin<T extends Transaction2> {
	readonly group: T["group"];
	readonly type: T["type"];

	handleTransaction2(transactionId: Buffer, senderAddress: Buffer, asset: T["asset"]): void;
}

export const ILegacyWorkaround = Symbol(`ILegacyWorkaround@${__filename}`);
export const IBlockHandler = Symbol(`IBlockHandler@${__filename}`);
export const ITransaction1Handler = Symbol(`ITransaction1Handler@${__filename}`);
export const ITransaction2Handler = Symbol(`ITransaction2Handler@${__filename}`);
export const ITransaction1HandlerPlugin = Symbol(`ITransaction1HandlerPlugin@${__filename}`);
export const ITransaction2HandlerPlugin = Symbol(`ITransaction2HandlerPlugin@${__filename}`);
