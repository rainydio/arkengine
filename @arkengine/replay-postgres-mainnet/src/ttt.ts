import "reflect-metadata";

import { Block, ITransaction1Handler, Transaction } from "@arkengine/blockchain";
import blockchainModule from "@arkengine/blockchain-module";
import { ITransaction1Serde } from "@arkengine/blockchain-serde";
import blockchainSerdeModule from "@arkengine/blockchain-serde-module";
import coreModule from "@arkengine/core-module";
import coreSerdeModule from "@arkengine/core-serde-module";
import { IDbEnvContext, IDbTxnContext } from "@arkengine/db";
import dbModule from "@arkengine/db-module";
import serdeModule from "@arkengine/serde-module";
import stateModule from "@arkengine/state-module";
import { assert } from "console";
import { Container, ContainerModule, inject, injectable } from "inversify";
import { Client } from "pg";

@injectable()
class App {
	public constructor(
		@inject(ITransaction1Serde)
		private readonly transaction1Serde: ITransaction1Serde,

		@inject(ITransaction1Handler)
		private readonly transaction1Handler: ITransaction1Handler,

		@inject(IDbEnvContext)
		private readonly dbEnvContext: IDbEnvContext,

		@inject(IDbTxnContext)
		private readonly dbTxnContext: IDbTxnContext
	) {}

	public async run(): Promise<void> {
		await this.dbEnvContext.openEnvAsync(async () => {
			for await (const block of this.getBlocks()) {
				for (const transaction of block.transactions) {
					console.log(transaction);
				}
			}

			// const transaction = this.transaction1Serde.deserialize(serialized);
			// const transactionId = Buffer.from(id, "hex");
			// this.dbTxnContext.runWriteTxnSync(() => {
			// 	this.transaction1Handler.handle(transactionId, transaction);
			// });
		});
	}

	public async *getBlocks(): AsyncIterable<Block> {
		const client = new Client({
			user: "ark",
			password: "password",
			database: "ark_mainnet",
		});

		try {
			await client.connect();

			for (let h = 0; h < 11273000; h += 1000) {
				const blocksResult = await client.query(`
					SELECT * FROM blocks
					WHERE height >= ${h} AND height < ${h + 1000}
					ORDER BY height
				`);

				const transactionsResult = await client.query(`
					SELECT block_id, id, serialized
					FROM transactions
					WHERE block_height >= ${h} AND block_height < ${h + 1000}
					ORDER BY block_height, sequence
				`);

				const t = 0;

				for (const br of blocksResult.rows) {
					let id: Buffer;
					let previousBlockId: Buffer;

					if (br["id"].length === 64) {
						id = Buffer.from(br["id"], "hex");
					} else {
						id = Buffer.alloc(8);
						id.writeBigUInt64LE(BigInt(br["id"]));
					}

					const timestamp = parseInt(br["timestamp"]);

					if (br["previous_block"] === null) {
						previousBlockId = Buffer.alloc(0);
					} else if (br["previous_block"].length === 64) {
						previousBlockId = Buffer.from(br["previous_block"], "hex");
					} else {
						previousBlockId = Buffer.alloc(8);
						previousBlockId.writeBigUInt64LE(BigInt(br["previous_block"]));
					}

					const height = br["height"] as number;
					const totalAmount = BigInt(br["total_amount"]);
					const totalFee = BigInt(br["total_fee"]);
					const reward = BigInt(br["reward"]);
					const payloadLength = parseInt(br["payload_length"]);
					const payloadHash = Buffer.from(br["payload_hash"], "hex");
					const generatorPublicKey = Buffer.from(br["generator_public_key"], "hex");
					const signature = Buffer.from(br["block_signature"], "hex");

					const transactions = transactionsResult.rows
						.filter((tr) => tr["block_id"] === br["id"])
						.map((tr) => {
							const transaction = this.transaction1Serde.deserialize(tr["serialized"]);
							return transaction;
						});

					yield {
						// id,
						version: 0,
						previousBlockId,
						timestamp,
						height,
						totalAmount,
						totalFee,
						reward,
						payloadLength,
						payloadHash,
						transactions,
						generatorPublicKey,
						signature,
					};
				}
			}
		} finally {
			await client.end();
		}
	}
}

const container = new Container();

container.load(new ContainerModule(blockchainModule));
container.load(new ContainerModule(blockchainSerdeModule));
container.load(new ContainerModule(coreModule));
container.load(new ContainerModule(coreSerdeModule));
container.load(new ContainerModule(dbModule));
container.load(new ContainerModule(serdeModule));
container.load(new ContainerModule(stateModule));

try {
	container
		.resolve(App)
		.run()
		.catch((error: Error) => {
			console.error(error.stack);
			process.exitCode = 1;
		});
} catch (error) {
	console.error(error.stack);
}
