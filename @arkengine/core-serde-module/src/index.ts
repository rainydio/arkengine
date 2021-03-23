import { ITransaction1SerdePlugin, ITransaction2SerdePlugin } from "@arkengine/blockchain-serde";
import {
	IDelegateRegistrationSerdePlugin,
	IMultiSignatureSerdePlugin,
	ISecondSignatureSerdePlugin,
	ITransferSerdePlugin,
	IVoteSerdePlugin,
} from "@arkengine/core-serde";
import { interfaces } from "inversify";

import { DelegateRegistrationSerdePlugin } from "./delegate-registration-serde-plugin";
import { MultiSignatureSerdePlugin } from "./multi-signature-serde-plugin";
import { SecondSignatureSerdePlugin } from "./second-signature-serde-plugin";
import { TransferSerdePlugin } from "./transfer-serde-plugin";
import { VoteSerdePlugin } from "./vote-serde-plugin";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<ITransferSerdePlugin>(ITransferSerdePlugin).to(TransferSerdePlugin);
	bind<ISecondSignatureSerdePlugin>(ISecondSignatureSerdePlugin).to(SecondSignatureSerdePlugin);
	bind<IDelegateRegistrationSerdePlugin>(IDelegateRegistrationSerdePlugin).to(DelegateRegistrationSerdePlugin);
	bind<IVoteSerdePlugin>(IVoteSerdePlugin).to(VoteSerdePlugin);
	bind<IMultiSignatureSerdePlugin>(IMultiSignatureSerdePlugin).to(MultiSignatureSerdePlugin);

	bind(ITransaction1SerdePlugin).toService(ITransferSerdePlugin);
	bind(ITransaction1SerdePlugin).toService(ISecondSignatureSerdePlugin);
	bind(ITransaction1SerdePlugin).toService(IDelegateRegistrationSerdePlugin);
	bind(ITransaction1SerdePlugin).toService(IVoteSerdePlugin);
	bind(ITransaction1SerdePlugin).toService(IMultiSignatureSerdePlugin);

	bind(ITransaction2SerdePlugin).toService(ITransferSerdePlugin);
	bind(ITransaction2SerdePlugin).toService(ISecondSignatureSerdePlugin);
	bind(ITransaction2SerdePlugin).toService(IDelegateRegistrationSerdePlugin);
	bind(ITransaction2SerdePlugin).toService(IVoteSerdePlugin);
	bind(ITransaction2SerdePlugin).toService(IMultiSignatureSerdePlugin);
};

export default serviceProvider;
