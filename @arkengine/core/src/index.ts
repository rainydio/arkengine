import {
	ITransaction1HandlerPlugin,
	ITransaction2HandlerPlugin,
	Transaction1,
	Transaction2,
} from "@arkengine/blockchain";

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

// DELEGATE REGISTRATION

export type DelegateRegistrationAsset = {
	readonly username: string;
};

export type DelegateRegistration1 = Transaction1 & {
	readonly type: CoreType.DelegateRegistration;
	readonly asset: DelegateRegistrationAsset;
};

export type DelegateRegistration2 = Transaction2 & {
	readonly group: CoreGroup;
	readonly type: CoreType.DelegateRegistration;
	readonly asset: DelegateRegistrationAsset;
};

export interface IDelegateRegistrationHandler
	extends ITransaction1HandlerPlugin<DelegateRegistration1>,
		ITransaction2HandlerPlugin<DelegateRegistration2> {}

// VOTE

export type VoteAsset = {
	readonly votes: readonly {
		readonly op: "+" | "-";
		readonly delegatePublicKey: Buffer;
	}[];
};

export type Vote1 = Transaction1 & {
	readonly type: CoreType.Vote;
	readonly asset: VoteAsset;
};

export type Vote2 = Transaction2 & {
	readonly group: CoreGroup;
	readonly type: CoreType.Vote;
	readonly asset: VoteAsset;
};

export interface IVoteHandler extends ITransaction1HandlerPlugin<Vote1>, ITransaction2HandlerPlugin<Vote2> {}

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

export const ITransferHandler = Symbol(`ITransferHandler@${__filename}`);
export const ISecondSignatureHandler = Symbol(`ISecondSignatureHandler@${__filename}`);
export const IDelegateRegistrationHandler = Symbol(`IDelegateRegistrationHandler@${__filename}`);
export const IVoteHandler = Symbol(`IVoteHandler@${__filename}`);
export const IMultiSignatureHandler = Symbol(`IMultiSignatureHandler@${__filename}`);
