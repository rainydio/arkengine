export type GenesisBalance = {
	readonly address: Buffer;
	readonly balance: bigint;
};

export type GenesisDelegate = {
	readonly address: Buffer;
	readonly username: string;
};

export type GenesisState = {
	readonly id: Buffer;
	readonly balances: readonly GenesisBalance[];
	readonly delegates: readonly GenesisDelegate[];
};

export type Milestone = {
	readonly height: number;
	readonly reward: number;
	readonly activeDelegates: number;
	readonly blocktime: number;
	readonly epoch: string;
	readonly vendorFieldLength: number;
	readonly multiPaymentLimit: number;
	readonly aip11?: boolean;

	readonly fees: {
		readonly staticFees: {
			readonly transfer: number;
			readonly secondSignature: number;
			readonly delegateRegistration: number;
			readonly vote: number;
			readonly multiSignature: number;
			readonly ipfs: number;
			readonly multiPayment: number;
			readonly delegateResignation: number;
			readonly htlcLock: number;
			readonly htlcClaim: number;
			readonly htlcRefund: number;
		};
	};

	readonly block?: {
		readonly maxTransactions?: number;
		readonly maxPayload?: number;
		readonly idFullSha256?: boolean;
		readonly acceptExpiredTransactionTimestamps?: boolean;
	};
};

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
	readonly signature: Buffer;
	readonly transactions: readonly Buffer[];
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
		readonly multi?: readonly Buffer[];
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

export interface ICurrentBlock {
	getId(): Buffer;
	getHeight(): number;
	getTotalAmount(): bigint;
	getTotalFee(): bigint;
	getIncludedTransactionIds(): readonly Buffer[];

	startNewBlock<T>(blockId: Buffer, cb: () => T): T;
	increaseTotalAmount(amount: bigint): void;
	increaseTotalFee(fee: bigint): void;
	includeTransactionId(transactionId: Buffer): void;
}

export interface ICurrentTransaction {
	getId(): Buffer;
	isTrusted(): boolean;

	startNewTransaction<T>(transactionId: Buffer, cb: () => T): T;
}

export interface ICurrentMilestone {
	get(): Milestone;
	select(height: number): void;
}

export interface IBlockchain {
	start<T>(cb: () => Promise<T>): Promise<T>;
	handle(blockBuffer: Buffer): void;
}

export interface IBlockHandler {
	handle(blockBuffer: Buffer): void;
}

export interface ITransaction1Handler {
	handle(transactionBuffer: Buffer): void;
}

export interface ITransaction2Handler {
	handle(transactionBuffer: Buffer): void;
}

export interface ITransaction1HandlerPlugin<T extends Transaction1> {
	readonly type: T["type"];

	handleTransaction1(senderAddress: Buffer, asset: T["asset"]): void;
}

export interface ITransaction2HandlerPlugin<T extends Transaction2> {
	readonly group: T["group"];
	readonly type: T["type"];

	handleTransaction2(senderAddress: Buffer, asset: T["asset"]): void;
}

export const ICurrentBlock = Symbol(`ICurrentBlock@${__filename}`);
export const ICurrentTransaction = Symbol(`ICurrentTransaction@${__filename}`);
export const ICurrentMilestone = Symbol(`ICurrentMilestone@${__filename}`);

export const IBlockchain = Symbol(`IBlockchain@${__filename}`);
export const IBlockHandler = Symbol(`IBlockHandler@${__filename}`);
export const ITransaction1Handler = Symbol(`ITransaction1Handler@${__filename}`);
export const ITransaction2Handler = Symbol(`ITransaction2Handler@${__filename}`);
export const ITransaction1HandlerPlugin = Symbol(`ITransaction1HandlerPlugin@${__filename}`);
export const ITransaction2HandlerPlugin = Symbol(`ITransaction2HandlerPlugin@${__filename}`);
