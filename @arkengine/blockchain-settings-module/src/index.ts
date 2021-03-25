import {
	IExceptionsProvider,
	IGenesisStateProvider,
	IMilestonesProvider,
	INetworkSettingsProvider,
} from "@arkengine/blockchain-settings";
import { interfaces } from "inversify";

import { Config } from "./config";
import { ExceptionsProvider } from "./exceptions-provider";
import { GenesisStateProvider } from "./genesis-state-provider";
import { MilestonesProvider } from "./milestones-provider";
import { NetworkSettingsProvider } from "./network-settings-provider";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind(Config).toSelf();

	bind<INetworkSettingsProvider>(INetworkSettingsProvider).to(NetworkSettingsProvider);
	bind<IMilestonesProvider>(IMilestonesProvider).to(MilestonesProvider);
	bind<IGenesisStateProvider>(IGenesisStateProvider).to(GenesisStateProvider);
	bind<IExceptionsProvider>(IExceptionsProvider).to(ExceptionsProvider);
};

export default serviceProvider;
