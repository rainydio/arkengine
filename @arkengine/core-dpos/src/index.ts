import {
	ITransaction1HandlerPlugin,
	ITransaction2HandlerPlugin,
	Transaction1,
	Transaction2,
} from "@arkengine/blockchain";
import { CoreGroup, CoreType } from "@arkengine/core";

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

export const IDelegateRegistrationHandler = Symbol(`IDelegateRegistrationHandler@${__filename}`);
export const IVoteHandler = Symbol(`IVoteHandler@${__filename}`);
