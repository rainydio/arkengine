import { ITransaction1SerdePlugin, ITransaction2SerdePlugin } from "@arkengine/blockchain-serde";
import {
	DelegateRegistration1,
	DelegateRegistration2,
	MultiSignature1,
	MultiSignature2,
	SecondSignature1,
	SecondSignature2,
	Transfer1,
	Transfer2,
	Vote1,
	Vote2,
} from "@arkengine/core";

export interface ITransferSerdePlugin
	extends ITransaction1SerdePlugin<Transfer1>,
		ITransaction2SerdePlugin<Transfer2> {}

export interface ISecondSignatureSerdePlugin
	extends ITransaction1SerdePlugin<SecondSignature1>,
		ITransaction2SerdePlugin<SecondSignature2> {}

export interface IDelegateRegistrationSerdePlugin
	extends ITransaction1SerdePlugin<DelegateRegistration1>,
		ITransaction2SerdePlugin<DelegateRegistration2> {}

export interface IVoteSerdePlugin extends ITransaction1SerdePlugin<Vote1>, ITransaction2SerdePlugin<Vote2> {}

export interface IMultiSignatureSerdePlugin
	extends ITransaction1SerdePlugin<MultiSignature1>,
		ITransaction2SerdePlugin<MultiSignature2> {}

export const ITransferSerdePlugin = Symbol(`ITransferSerdePlugin@${__filename}`);
export const ISecondSignatureSerdePlugin = Symbol(`ISecondSignatureSerdePlugin@${__filename}`);
export const IDelegateRegistrationSerdePlugin = Symbol(`IDelegateRegistrationSerdePlugin@${__filename}`);
export const IVoteSerdePlugin = Symbol(`IVoteSerdePlugin@${__filename}`);
export const IMultiSignatureSerdePlugin = Symbol(`IMultiSignatureSerdePlugin@${__filename}`);
