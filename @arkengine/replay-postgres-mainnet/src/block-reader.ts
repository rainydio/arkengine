import { Blocks, Utils } from "@arkecosystem/crypto";
import { IBlockSerde } from "@arkengine/blockchain-serde";
import SHA256 from "bcrypto/lib/sha256";
import { inject, injectable } from "inversify";
import { Client } from "pg";

@injectable()
export class BlockReader {
	public constructor(
		@inject(IBlockSerde)
		private readonly blockSerde: IBlockSerde
	) {}

	public async *getBlocks(heightStart: number, heightEnd: number): AsyncIterable<Buffer> {
		const client = new Client({
			user: "ark",
			password: "password",
			database: "ark_mainnet",
		});

		await client.connect();

		try {
			let queryHeightStart = heightStart;

			while (queryHeightStart < heightEnd) {
				const queryHeightEnd = Math.min(queryHeightStart + 10 ** 5, heightEnd);

				const blocksResult = await client.query(`
					SELECT * FROM blocks
					WHERE height >= ${queryHeightStart} AND height < ${queryHeightEnd}
					ORDER BY height
				`);

				const transactionsResult = await client.query(`
					SELECT block_id, serialized
					FROM transactions
					WHERE block_height >= ${queryHeightStart} AND block_height < ${queryHeightEnd}
					ORDER BY block_height, sequence
				`);

				for (const br of blocksResult.rows) {
					let id: Buffer;
					let previousBlockId: Buffer;

					if (br["id"].length !== 64) {
						id = Buffer.alloc(8);
						id.writeBigUInt64BE(BigInt(br["id"]));
					} else {
						id = Buffer.from(br["id"], "hex");
					}

					const timestamp = parseInt(br["timestamp"]);

					if (br["previous_block"] === null) {
						previousBlockId = Buffer.alloc(8);
					} else if (br["previous_block"].length !== 64) {
						previousBlockId = Buffer.alloc(8);
						previousBlockId.writeBigUInt64BE(BigInt(br["previous_block"]));
					} else {
						previousBlockId = Buffer.from(br["previous_block"], "hex");
					}

					const height = br["height"] as number;
					const totalAmount = BigInt(br["total_amount"]);
					const totalFee = BigInt(br["total_fee"]);
					const reward = BigInt(br["reward"]);
					const payloadLength = parseInt(br["payload_length"]);
					const payloadHash = Buffer.from(br["payload_hash"], "hex");
					const generatorPublicKey = Buffer.from(br["generator_public_key"], "hex");
					const signature = Buffer.from(br["block_signature"], "hex");
					const transactions: Buffer[] = [];

					while (transactionsResult.rows.length && transactionsResult.rows[0]["block_id"] === br["id"]) {
						const { serialized } = transactionsResult.rows.shift();
						transactions.push(serialized);
					}

					const block = {
						version: 0 as const,
						previousBlockId,
						timestamp,
						height,
						totalAmount,
						totalFee,
						reward,
						payloadLength,
						payloadHash,
						generatorPublicKey,
						signature,
						transactions,
					};

					if (!this.blockSerde.getIdLegacy(block).equals(id)) {
						const cryptoBlockData = {
							version: br["version"],
							previousBlock: br["previous_block"],
							numberOfTransactions: transactions.length,
							timestamp: br["timestamp"],
							height: br["height"],
							totalAmount: Utils.BigNumber.make(br["total_amount"]),
							totalFee: Utils.BigNumber.make(br["total_fee"]),
							reward: Utils.BigNumber.make(br["reward"]),
							payloadLength: br["payload_length"],
							payloadHash: br["payload_hash"],
							generatorPublicKey: br["generator_public_key"],
							blockSignature: br["block_signature"],
						};

						console.error(block);
						console.error();

						console.error("Blocks.Block.getIdHex(cryptoBlockData)", Blocks.Block.getIdHex(cryptoBlockData));
						console.error("Blocks.Block.getId(cryptoBlockData)", Blocks.Block.getId(cryptoBlockData));
						console.error("cryptoBlockData.previousBlockHex", cryptoBlockData["previousBlockHex"]);
						console.error();
						console.error(Buffer.from(Blocks.Block.getIdHex(cryptoBlockData), "hex").reverse().readBigUInt64LE());
						console.error(SHA256.digest(Blocks.Serializer.serialize(cryptoBlockData)));

						console.error(`height=${br["height"]}, id=${br["id"]}`);
						console.error();
						console.error(id.readBigUInt64BE().toString(10));
						console.error(id.toString("hex"));
						console.error();
						console.error(this.blockSerde.getIdLegacy(block).readBigUInt64BE().toString(10));
						console.error(this.blockSerde.getIdLegacy(block).toString("hex"));
						console.error();
						console.error(this.blockSerde.getId(block).toString("hex"));
						console.error();

						return;
					}

					yield this.blockSerde.serialize(block);
				}

				queryHeightStart = queryHeightEnd;
			}
		} catch (error) {
			console.error(error.stack);
			throw error;
		} finally {
			await client.end();
		}
	}
}
