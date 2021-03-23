import { ITransaction1HandlerPlugin, ITransaction2HandlerPlugin } from "@arkengine/blockchain";
import { ISecondSignatureHandler, ITransferHandler } from "@arkengine/core";
import { interfaces } from "inversify";

import { SecondSignatureHandler } from "./second-signature-handler";
import { TransferHandler } from "./transfer-handler";

const m: interfaces.ContainerModuleCallBack = (bind) => {
	bind<ITransferHandler>(ITransferHandler).to(TransferHandler);
	bind<ISecondSignatureHandler>(ISecondSignatureHandler).to(SecondSignatureHandler);

	bind(ITransaction1HandlerPlugin).toService(ITransferHandler);
	bind(ITransaction1HandlerPlugin).toService(ISecondSignatureHandler);

	bind(ITransaction2HandlerPlugin).toService(ITransferHandler);
	bind(ITransaction2HandlerPlugin).toService(ISecondSignatureHandler);
};

export default m;
