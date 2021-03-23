import {
	IAddressService,
	IBalanceService,
	IBlockService,
	IEcdsaService,
	ILegacyMultiSignatureService,
	ISecondSignatureService,
} from "@arkengine/state";
import { interfaces } from "inversify";

import { AddressService } from "./address-service";
import { BalanceService } from "./balance-service";
import { BlockService } from "./block-service";
import { EcdsaService } from "./ecdsa-service";
import { LegacyMultiSignatureService } from "./legacy-multi-signature-service";
import { SecondSignatureService } from "./second-signature-service";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<IBlockService>(IBlockService).to(BlockService);
	bind<IAddressService>(IAddressService).to(AddressService);
	bind<IEcdsaService>(IEcdsaService).to(EcdsaService);
	bind<ISecondSignatureService>(ISecondSignatureService).to(SecondSignatureService);
	bind<ILegacyMultiSignatureService>(ILegacyMultiSignatureService).to(LegacyMultiSignatureService);
	bind<IBalanceService>(IBalanceService).to(BalanceService);
};

export default serviceProvider;
