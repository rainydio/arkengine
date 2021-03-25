import {
	IBlockchain,
	IBlockHandler,
	ICurrentBlock,
	ICurrentMilestone,
	ICurrentTransaction,
	ITransaction1Handler,
} from "@arkengine/blockchain";
import { interfaces } from "inversify";

import { BlockHandler } from "./block-handler";
import { Blockchain } from "./blockchain";
import { CurrentBlock } from "./current-block";
import { CurrentMilestone } from "./current-milestone";
import { CurrentTransaction } from "./current-transaction";
import { Transaction1Handler } from "./transaction1-handler";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<ICurrentBlock>(ICurrentBlock).to(CurrentBlock).inSingletonScope();
	bind<ICurrentTransaction>(ICurrentTransaction).to(CurrentTransaction).inSingletonScope();
	bind<ICurrentMilestone>(ICurrentMilestone).to(CurrentMilestone).inSingletonScope();

	bind<IBlockchain>(IBlockchain).to(Blockchain);
	bind<IBlockHandler>(IBlockHandler).to(BlockHandler);
	bind<ITransaction1Handler>(ITransaction1Handler).to(Transaction1Handler);
};

export default serviceProvider;
