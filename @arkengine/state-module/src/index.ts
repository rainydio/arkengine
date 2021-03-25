import {
	IAddressService,
	IBalanceDb,
	IBalanceService,
	IEcdsaService,
	ILastBlockDb,
	ILastBlockService,
	IPublicKeyService,
} from "@arkengine/state";
import { interfaces } from "inversify";

import { AddressService } from "./address-service";
import { BalanceDb } from "./balance-db";
import { BalanceService } from "./balance-service";
import { EcdsaService } from "./ecdsa-service";
import { LastBlockDb } from "./last-block-db";
import { LastBlockService } from "./last-block-service";
import { PublicKeyService } from "./public-key-service";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<IBalanceDb>(IBalanceDb).to(BalanceDb);
	bind<ILastBlockDb>(ILastBlockDb).to(LastBlockDb);

	bind<IAddressService>(IAddressService).to(AddressService);
	bind<IBalanceService>(IBalanceService).to(BalanceService);
	bind<ILastBlockService>(ILastBlockService).to(LastBlockService);

	bind<IPublicKeyService>(IPublicKeyService).to(PublicKeyService);
	bind<IEcdsaService>(IEcdsaService).to(EcdsaService);
};

export default serviceProvider;
