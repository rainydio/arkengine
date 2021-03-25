import { ITransaction1HandlerPlugin, ITransaction2HandlerPlugin } from "@arkengine/blockchain";
import { IDelegateRegistrationHandler, IVoteHandler } from "@arkengine/core-dpos";
import { interfaces } from "inversify";

import { DelegateRegistrationHandler } from "./delegate-registration-handler";
import { VoteHandler } from "./vote-handler";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<IDelegateRegistrationHandler>(IDelegateRegistrationHandler).to(DelegateRegistrationHandler);
	bind<IVoteHandler>(IVoteHandler).to(VoteHandler);

	bind(ITransaction1HandlerPlugin).toService(IDelegateRegistrationHandler);
	bind(ITransaction1HandlerPlugin).toService(IVoteHandler);

	bind(ITransaction2HandlerPlugin).toService(IDelegateRegistrationHandler);
	bind(ITransaction2HandlerPlugin).toService(IVoteHandler);
};

export default serviceProvider;
