import { ITransaction1Handler } from "@arkengine/blockchain";
import { interfaces } from "inversify";

import { Transaction1Handler } from "./transaction1-handler";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<ITransaction1Handler>(ITransaction1Handler).to(Transaction1Handler);
};

export default serviceProvider;
