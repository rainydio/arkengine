import "reflect-metadata";

import blockchain from "@arkengine/blockchain-module";
import blockchainSerde from "@arkengine/blockchain-serde-module";
import blockchainSettings from "@arkengine/blockchain-settings-module";
import coreDposModule from "@arkengine/core-dpos-module";
import core from "@arkengine/core-module";
import coreSerde from "@arkengine/core-serde-module";
import db from "@arkengine/db-module";
import serde from "@arkengine/serde-module";
import state from "@arkengine/state-module";
import { Container, ContainerModule } from "inversify";

import { App } from "./app";
import { BlockReader } from "./block-reader";

process.env["ARK_ENGINE_DB_ENV_PATH"] =
	process.env["ARK_ENGINE_DB_ENV_PATH"] ?? `${process.env["HOME"]}/.local/share/arkengine/mainnet`;

process.env["ARK_ENGINE_NETWORK_JSON"] =
	process.env["ARK_ENGINE_NETWORK_JSON"] ?? require.resolve("@arkecosystem/crypto-networks/dist/mainnet/network.json");

process.env["ARK_ENGINE_MILESTONES_JSON"] =
	process.env["ARK_ENGINE_MILESTONES_JSON"] ??
	require.resolve("@arkecosystem/crypto-networks/dist/mainnet/milestones.json");

process.env["ARK_ENGINE_GENESIS_BLOCK_JSON"] =
	process.env["ARK_ENGINE_GENESIS_BLOCK_JSON"] ??
	require.resolve("@arkecosystem/crypto-networks/dist/mainnet/genesisBlock.json");

process.env["ARK_ENGINE_EXCEPTIONS_JSON"] =
	process.env["ARK_ENGINE_EXCEPTIONS_JSON"] ??
	require.resolve("@arkecosystem/crypto-networks/dist/mainnet/exceptions.json");

const container = new Container();

container.load(new ContainerModule(blockchain));
container.load(new ContainerModule(blockchainSerde));
container.load(new ContainerModule(blockchainSettings));
container.load(new ContainerModule(coreDposModule));
container.load(new ContainerModule(core));
container.load(new ContainerModule(coreSerde));
container.load(new ContainerModule(db));
container.load(new ContainerModule(serde));
container.load(new ContainerModule(state));

container.bind(BlockReader).toSelf();

container
	.resolve(App)
	.run()
	.catch((error) => {
		console.error(error.stack);
		process.exitCode = 1;
	});
