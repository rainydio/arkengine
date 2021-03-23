import { IDbEnvContext, IDbProvider, IDbTxnContext, IDbUtils } from "@arkengine/db";
import { interfaces } from "inversify";

import { DbEnvContext } from "./db-env-context";
import { DbProvider } from "./db-provider";
import { TxnContext } from "./db-txn-context";
import { DbUtils } from "./db-utils";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<IDbUtils>(IDbUtils).to(DbUtils);
	bind<IDbEnvContext>(IDbEnvContext).to(DbEnvContext).inSingletonScope();
	bind<IDbTxnContext>(IDbTxnContext).to(TxnContext).inRequestScope();
	bind<IDbProvider>(IDbProvider).to(DbProvider);
};

export default serviceProvider;
