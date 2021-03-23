import { ITransaction1Serde } from "@arkengine/blockchain-serde";
import { interfaces } from "inversify";

import { Transaction1Serde } from "./transaction1-serde";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<ITransaction1Serde>(ITransaction1Serde).to(Transaction1Serde);
};

export default serviceProvider;
