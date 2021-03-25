import { ITransaction1HandlerPlugin, ITransaction2HandlerPlugin } from "@arkengine/blockchain";
import {
	ISecondPublicKeyDb,
	ISecondSignatureHandler,
	ISecondSignatureService,
	ITransferHandler,
} from "@arkengine/core";
import { interfaces } from "inversify";

import { SecondPublicKeyDb } from "./second-public-key-db";
import { SecondSignatureHandler } from "./second-signature-handler";
import { SecondSignatureService } from "./second-signature-service";
import { TransferHandler } from "./transfer-handler";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<ISecondPublicKeyDb>(ISecondPublicKeyDb).to(SecondPublicKeyDb);
	bind<ISecondSignatureService>(ISecondSignatureService).to(SecondSignatureService);

	bind<ITransferHandler>(ITransferHandler).to(TransferHandler);
	bind<ISecondSignatureHandler>(ISecondSignatureHandler).to(SecondSignatureHandler);

	bind(ITransaction1HandlerPlugin).toService(ITransferHandler);
	bind(ITransaction1HandlerPlugin).toService(ISecondSignatureHandler);

	bind(ITransaction2HandlerPlugin).toService(ITransferHandler);
	bind(ITransaction2HandlerPlugin).toService(ISecondSignatureHandler);
};

export default serviceProvider;
