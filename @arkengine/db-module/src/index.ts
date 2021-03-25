import { IDbEnvContext, IDbProvider, IDbTxnContext } from "@arkengine/db";
import { interfaces } from "inversify";

import { Config } from "./config";
import { DbEnvContext } from "./db-env-context";
import { DbProvider } from "./db-provider";
import { TxnContext } from "./db-txn-context";
import { Utils } from "./utils";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind(Config).toSelf();
	bind(Utils).toSelf();

	bind<IDbEnvContext>(IDbEnvContext).to(DbEnvContext).inSingletonScope();
	bind<IDbTxnContext>(IDbTxnContext).to(TxnContext).inSingletonScope();
	bind<IDbProvider>(IDbProvider).to(DbProvider);
};

export default serviceProvider;
