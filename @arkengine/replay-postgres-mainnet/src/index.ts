import "reflect-metadata";

import { Transactions } from "@arkecosystem/crypto";
import { ITransaction1Handler } from "@arkengine/blockchain";
import blockchainModule from "@arkengine/blockchain-module";
import { ITransaction1Serde } from "@arkengine/blockchain-serde";
import blockchainSerdeModule from "@arkengine/blockchain-serde-module";
import coreModule from "@arkengine/core-module";
import coreSerdeModule from "@arkengine/core-serde-module";
import { IDbEnvContext, IDbProvider, IDbTxnContext } from "@arkengine/db";
import databaseModule from "@arkengine/db-module";
import serdeModule from "@arkengine/serde-module";
import stateModule from "@arkengine/state-module";
import assert from "assert";
import { Container, ContainerModule, inject, injectable } from "inversify";
import { Env } from "node-lmdb";
import { Client } from "pg";

@injectable()
class App {
	public constructor(
		@inject(IDbEnvContext)
		private readonly dbEnvContext: IDbEnvContext,

		@inject(IDbTxnContext)
		private readonly dbTxnContext: IDbTxnContext,

		@inject(IDbProvider)
		private readonly dbProvider: IDbProvider
	) {}

	public run() {
		this.dbEnvContext.openEnvSync(() => {
			{
				const db1 = this.dbProvider.getKeyValueDb("db1");

				const someKey0 = Buffer.from("some_key_0", "utf8");
				const someKey1 = Buffer.from("some_key_1", "utf8");
				const someKey2 = Buffer.from("some_key_2", "utf8");
				const someKey3 = Buffer.from("some_key_3", "utf8");
				const someKey4 = Buffer.from("some_key_4", "utf8");
				const someVal1 = Buffer.from("some_val_1", "utf8");
				const someVal2 = Buffer.from("some_val_2", "utf8");
				const someVal3 = Buffer.from("some_val_3", "utf8");

				this.dbTxnContext.runWriteTxnSync(() => {
					db1.set(someKey1, someVal1);
					db1.set(someKey3, someVal2);
				});

				this.dbTxnContext.runReadTxnSync(() => {
					assert(db1.has(someKey1));
					assert(db1.has(someKey3));
					assert(Array.from(db1.keys()).length === 2);

					for (const key of db1.keys({ reverse: true })) {
						console.log("reverse:", key.toString("utf8"));
					}

					for (const key of db1.keys({ from: someKey0 })) {
						console.log("from some_key_0:", key.toString("utf8"));
					}

					for (const key of db1.keys({ from: someKey2 })) {
						console.log("from some_key_2:", key.toString("utf8"));
					}

					for (const key of db1.keys({ from: someKey4, reverse: true })) {
						console.log("from some_key_4 reverse:", key.toString("utf8"));
					}
				});
			}

			{
				const db2 = this.dbProvider.getKeyValueSetDb("db2");

				const someKey0 = Buffer.from("some_key_0", "utf8");
				const someKey1 = Buffer.from("some_key_1", "utf8");
				const someVal0 = Buffer.from("some_val_0", "utf8");
				const someVal1 = Buffer.from("some_val_1", "utf8");
				const someVal2 = Buffer.from("some_val_2", "utf8");
				const someVal3 = Buffer.from("some_val_3", "utf8");
				const someVal4 = Buffer.from("some_val_4", "utf8");
				const someVal5 = Buffer.from("some_val_5", "utf8");

				this.dbTxnContext.runWriteTxnSync(() => {
					db2.add(someKey1, someVal1);
					db2.add(someKey1, someVal4);
					db2.add(someKey1, someVal2);
				});

				this.dbTxnContext.runReadTxnSync(() => {
					assert(db2.has(someKey1, someVal1));
					assert(db2.has(someKey1, someVal2));
					assert(db2.has(someKey1, someVal4));

					for (const value of db2.get(someKey1, { from: someVal5, reverse: true })) {
						console.log("some_val_5 value:", value.toString("utf8"));
					}
				});
			}
		});
	}
}

const container = new Container();

container.load(new ContainerModule(blockchainModule));
container.load(new ContainerModule(blockchainSerdeModule));
container.load(new ContainerModule(coreModule));
container.load(new ContainerModule(coreSerdeModule));
container.load(new ContainerModule(databaseModule));
container.load(new ContainerModule(serdeModule));
container.load(new ContainerModule(stateModule));

try {
	container.resolve(App).run();
} catch (error) {
	console.error(error.stack);
}

/*
const transaction1Serde = container.get<ITransaction1Serde>(ITransaction1Serde);
const transaction1Handler = container.get<ITransaction1Handler>(ITransaction1Handler);

const run = async () => {
	const client = new Client({
		user: "ark",
		password: "password",
		database: "ark_mainnet",
	});

	try {
		await client.connect();

		const query = `
			SELECT id, serialized, block_height as blockHeight
			FROM transactions
			WHERE version = 1
			-- AND block_height > 1
			  AND type IN (0, 1)
			ORDER BY block_height, sequence
			-- LIMIT 10000
		`;

		const { rows } = await client.query(query);
		const start = Date.now();

		let count = 0;
		let arkengineFailCount = 0;
		let ark3FailCount = 0;

		try {
			for (const { id, serialized, blockHeight } of rows) {
				count++;
				const transaction = transaction1Serde.deserialize(serialized);
				const transactionId = transaction1Serde.getId(transaction);

				try {
					if (blockHeight !== 1 && transactionId.toString("hex") !== id) {
						throw new Error(`${transactionId.toString("hex")} !== ${id}`);
					}

					transaction1Handler.handle(transactionId, transaction);
				} catch (error) {
					arkengineFailCount++;

					const cryptoTransaction = Transactions.TransactionFactory.fromBytesUnsafe(serialized);
					const cryptoTransactionBytes = Transactions.Serializer.getBytes(cryptoTransaction.data, {
						disableVersionCheck: true,
					});

					if (transactionId.toString("hex") !== id || cryptoTransaction.verify({ disableVersionCheck: true })) {
						console.error(cryptoTransactionBytes.toString("hex"));
						console.error();

						console.error(transaction);
						console.error();
					} else {
						ark3FailCount++;
					}

					console.error(`${id} failed (arkengine=${arkengineFailCount} vs ARK3=${ark3FailCount} out of ${count})`);
					console.error(error.stack);
					console.error();

					return;
				}

				if (count % 10000 === 0) {
					const seconds = (Date.now() - start) / 1000;
					const tps = count / seconds;

					console.log(`${count} transactions in ${seconds.toFixed(2)}s (${Math.round(tps)}tps)`);
				}
			}
		} catch (error) {
			console.error(error.stack);
		}
	} finally {
		client.end();
	}
};

run().catch((error: Error) => {
	console.error(error.stack);
	process.exitCode = 1;
});

// */
