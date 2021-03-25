import { IBlockSerde, ITransaction1Serde, ITransactionSerde } from "@arkengine/blockchain-serde";
import { interfaces } from "inversify";

import { BlockSerde } from "./block-serde";
import { TransactionSerde } from "./transaction-serde";
import { Transaction1Serde } from "./transaction1-serde";

export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
	bind<IBlockSerde>(IBlockSerde).to(BlockSerde);
	bind<ITransactionSerde>(ITransactionSerde).to(TransactionSerde);
	bind<ITransaction1Serde>(ITransaction1Serde).to(Transaction1Serde);
};

export default serviceProvider;
