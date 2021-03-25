import {
	ITransaction1HandlerPlugin,
	ITransaction2HandlerPlugin,
	Transaction1,
	Transaction2,
} from "@arkengine/blockchain";

export interface ISecondPublicKeyDb {
	has(address: Buffer): boolean;
	set(address: Buffer, secondPublicKey: Buffer): void;
	get(address: Buffer): Buffer;
}

export interface ILegacyMultiSignatureDb {
	has(address: Buffer): boolean;
	set(address: Buffer, min: number, lifetime: number, publicKeys: readonly Buffer[]): void;
	getMin(address: Buffer): number;
	getLifetime(address: Buffer): number;
	getPublicKeys(address: Buffer): Buffer[];
}

export interface ISecondSignatureService {
	enable(address: Buffer, secondPublicKey: Buffer): void;
	isEnabled(address: Buffer): boolean;
	getSecondPublicKey(address: Buffer): Buffer;
	verify(address: Buffer, hash: Buffer, signature: Buffer): void;
}

export interface ILegacyMultiSignatureService {
	enable(address: Buffer, min: number, lifetime: number, publicKeys: readonly Buffer[]): void;
	isEnabled(address: Buffer): boolean;
	getMin(address: Buffer): number;
	getLifetime(address: Buffer): number;
	getPublicKeys(address: Buffer): Buffer[];
	verify(address: Buffer, hash: Buffer, signatures: readonly Buffer[]): void;
}

export const CoreGroup = 1 as const;
export type CoreGroup = 1;

export enum CoreType {
	Transfer = 0,
	SecondSignature = 1,
	DelegateRegistration = 2,
	Vote = 3,
	MultiSignature = 4,
	Ipfs = 5,
	MultiPayment = 6,
	DelegateResignation = 7,
	HtlcLock = 8,
	HtlcClaim = 9,
	HtlcRefund = 10,
}

// TRANSFER

export type TransferAsset = {
	readonly recipientAddress: Buffer;
	readonly amount: bigint;
	readonly expirationHeight: number;
};

export type Transfer1 = Transaction1 & {
	readonly type: CoreType.Transfer;
	readonly asset: TransferAsset;
};

export type Transfer2 = Transaction2 & {
	readonly group: CoreGroup;
	readonly type: CoreType.Transfer;
	readonly asset: TransferAsset;
};

export interface ITransferHandler
	extends ITransaction1HandlerPlugin<Transfer1>,
		ITransaction2HandlerPlugin<Transfer2> {}

// SECOND SIGNATURE

export type SecondSignatureAsset = {
	readonly secondPublicKey: Buffer;
};

export type SecondSignature1 = Transaction1 & {
	readonly type: CoreType.SecondSignature;
	readonly asset: SecondSignatureAsset;
};

export type SecondSignature2 = Transaction2 & {
	readonly group: CoreGroup;
	readonly type: CoreType.SecondSignature;
	readonly asset: SecondSignatureAsset;
};

export interface ISecondSignatureHandler
	extends ITransaction1HandlerPlugin<SecondSignature1>,
		ITransaction2HandlerPlugin<SecondSignature2> {}

// MULTI SIGNATURE

export type MultiSignature1Asset = {
	readonly min: number;
	readonly lifetime: number;
	readonly publicKeys: Buffer[];
};

export type MultiSignature2Asset = {
	readonly min: number;
	readonly publicKeys: Buffer[];
};

export type MultiSignature1 = Transaction1 & {
	readonly type: CoreType.MultiSignature;
	readonly asset: MultiSignature1Asset;
};

export type MultiSignature2 = Transaction2 & {
	readonly group: CoreGroup;
	readonly type: CoreType.MultiSignature;
	readonly asset: MultiSignature2Asset;
};

export interface IMultiSignatureHandler
	extends ITransaction1HandlerPlugin<MultiSignature1>,
		ITransaction2HandlerPlugin<MultiSignature2> {}

export const ISecondPublicKeyDb = Symbol(`ISecondPublicKeyDb@${__filename}`);
export const ISecondSignatureService = Symbol(`ISecondSignatureService@${__filename}`);

export const ITransferHandler = Symbol(`ITransferHandler@${__filename}`);
export const ISecondSignatureHandler = Symbol(`ISecondSignatureHandler@${__filename}`);
export const IMultiSignatureHandler = Symbol(`IMultiSignatureHandler@${__filename}`);
