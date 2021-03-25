import { Block } from "@arkengine/blockchain";
import { BlockSerdeDeserializeOptions, IBlockSerde } from "@arkengine/blockchain-serde";
import { IReaderFactory, IWriter, IWriterFactory } from "@arkengine/serde";
import assert from "assert";
import SHA256 from "bcrypto/lib/sha256";
import { inject, injectable } from "inversify";

const BASE_HEADER_SIZE =
	4 + // version
	4 + // timestamp
	4 + // height
	0 + // previousBlockId.length
	4 + // transactions.length
	8 + // totalAmount
	8 + // totalFee
	8 + // reward
	4 + // payloadLength
	32 + // payloadHash
	33; // generatorPublicKey.length

@injectable()
export class BlockSerde implements IBlockSerde {
	public constructor(
		@inject(IReaderFactory)
		private readonly readerFactory: IReaderFactory,

		@inject(IWriterFactory)
		private readonly writerFactory: IWriterFactory
	) {}

	public getId(block: Block): Buffer {
		const size = BASE_HEADER_SIZE + block.previousBlockId.length + block.signature.length;
		const writer = this.writerFactory.createWriter(Buffer.alloc(size));
		this.writeHeader(writer, block);
		writer.writeEcdsaSignature(block.signature);

		assert(writer.remaining.length === 0);

		return SHA256.digest(writer.result);
	}

	public getIdLegacy(block: Block): Buffer {
		return this.getId(block).slice(0, 8).reverse();
	}

	public getHash(block: Block): Buffer {
		const size = BASE_HEADER_SIZE + block.previousBlockId.length;
		const writer = this.writerFactory.createWriter(Buffer.alloc(size));
		this.writeHeader(writer, block);

		assert(writer.remaining.length === 0);

		return SHA256.digest(writer.result);
	}

	public serialize(block: Block): Buffer {
		const size =
			BASE_HEADER_SIZE +
			block.previousBlockId.length +
			block.signature.length +
			block.transactions.reduce((s, t) => s + 4 + t.length, 0);

		const writer = this.writerFactory.createWriter(Buffer.alloc(size));
		this.writeHeader(writer, block);
		writer.writeEcdsaSignature(block.signature);

		for (const transaction of block.transactions) writer.writeUInt32LE(transaction.length);
		for (const transaction of block.transactions) writer.writeBuffer(transaction);

		assert(writer.remaining.length === 0);

		return writer.result;
	}

	public deserialize(buffer: Buffer, options: BlockSerdeDeserializeOptions): Block {
		const reader = this.readerFactory.createReader(buffer);

		assert(reader.readUInt32LE() === 0);

		const timestamp = reader.readUInt32LE();
		const height = reader.readUInt32LE();
		const previousBlockId = reader.readBuffer(options.previousBlockIdLength);
		const numberOfTransactions = reader.readUInt32LE();
		const totalAmount = reader.readBigUInt64LE();
		const totalFee = reader.readBigUInt64LE();
		const reward = reader.readBigUInt64LE();
		const payloadLength = reader.readUInt32LE();
		const payloadHash = reader.readBuffer(32);
		const generatorPublicKey = reader.readPublicKey();
		const signature = reader.readEcdsaSignature();

		const lengths: number[] = [];
		for (let i = 0; i < numberOfTransactions; i++) {
			lengths.push(reader.readUInt32LE());
		}

		const transactions: Buffer[] = [];
		for (const length of lengths) {
			transactions.push(reader.readBuffer(length));
		}

		assert(reader.remaining.length === 0);

		return {
			version: 0 as const,
			timestamp,
			height,
			previousBlockId,
			totalAmount,
			totalFee,
			reward,
			payloadLength,
			payloadHash,
			generatorPublicKey,
			signature,
			transactions,
		};
	}

	public writeHeader(writer: IWriter, block: Block): void {
		assert(block.version === 0);
		assert(block.payloadHash.length === 32);
		assert(block.generatorPublicKey.length === 33);

		writer.writeUInt32LE(block.version);
		writer.writeUInt32LE(block.timestamp);
		writer.writeUInt32LE(block.height);
		writer.writeBuffer(block.previousBlockId);
		writer.writeUInt32LE(block.transactions.length);
		writer.writeBigUInt64LE(block.totalAmount);
		writer.writeBigUInt64LE(block.totalFee);
		writer.writeBigUInt64LE(block.reward);
		writer.writeUInt32LE(block.payloadLength);
		writer.writeBuffer(block.payloadHash);
		writer.writePublicKey(block.generatorPublicKey);
	}
}
