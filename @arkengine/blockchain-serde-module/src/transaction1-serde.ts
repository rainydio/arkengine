import { Transaction1 } from "@arkengine/blockchain";
import { ITransaction1Serde, ITransaction1SerdePlugin } from "@arkengine/blockchain-serde";
import {
	ILegacyWriter,
	ILegacyWriterFactory,
	IReader,
	IReaderFactory,
	IWriter,
	IWriterFactory,
} from "@arkengine/serde";
import assert from "assert";
import SHA256 from "bcrypto/lib/sha256";
import { inject, injectable, multiInject, optional } from "inversify";

const temp = Buffer.alloc(1024);

@injectable()
export class Transaction1Serde implements ITransaction1Serde {
	public constructor(
		@inject(IReaderFactory)
		private readonly readerFactory: IReaderFactory,

		@inject(IWriterFactory)
		private readonly writerFactory: IWriterFactory,

		@inject(ILegacyWriterFactory)
		private readonly legacyWriterFactory: ILegacyWriterFactory,

		@optional()
		@multiInject(ITransaction1SerdePlugin)
		private readonly plugins?: ITransaction1SerdePlugin<Transaction1>[]
	) {}

	public getId(transaction: Transaction1): Buffer {
		const writer = this.legacyWriterFactory.createLegacyWriter(temp);
		this.writeTransaction1PayloadLegacyByPlugin(transaction.type, writer, transaction);
		writer.writeEcdsaSignature(transaction.signature.primary);
		transaction.signature.second && writer.writeEcdsaSignature(transaction.signature.second);
		return SHA256.digest(writer.result);
	}

	public getPrimaryHash(transaction: Transaction1): Buffer {
		const writer = this.legacyWriterFactory.createLegacyWriter(temp);
		this.writeTransaction1PayloadLegacyByPlugin(transaction.type, writer, transaction);
		return SHA256.digest(writer.result);
	}

	public getSecondHash(transaction: Transaction1): Buffer {
		const writer = this.legacyWriterFactory.createLegacyWriter(temp);
		this.writeTransaction1PayloadLegacyByPlugin(transaction.type, writer, transaction);
		writer.writeEcdsaSignature(transaction.signature.primary);
		return SHA256.digest(writer.result);
	}

	public getMultiHash(transaction: Transaction1): Buffer {
		return this.getPrimaryHash(transaction);
	}

	public serialize(transaction: Transaction1): Buffer {
		const writer = this.writerFactory.createWriter(Buffer.alloc(2048));

		assert(transaction.version === 1);

		writer.writeUInt8(0xff);
		writer.writeUInt8(1);
		writer.writeUInt8(transaction.type);
		writer.writeUInt32LE(transaction.timestamp);
		writer.writePublicKey(transaction.senderPublicKey);
		writer.writeBigUInt64LE(transaction.fee);
		writer.writeUInt8(transaction.vendorField.length);
		writer.writeBuffer(transaction.vendorField);
		this.writeTransaction1AssetByPlugin(transaction.type, writer, transaction.asset);
		writer.writeEcdsaSignature(transaction.signature.primary);
		transaction.signature.second && writer.writeEcdsaSignature(transaction.signature.second);

		if (transaction.signature.multi) {
			writer.writeUInt8(0xff);
			for (const signature of transaction.signature.multi) {
				writer.writeEcdsaSignature(signature);
			}
		}

		return writer.result;
	}

	public deserialize(buffer: Buffer): Transaction1 {
		const reader = this.readerFactory.createReader(buffer);

		assert(reader.readUInt8() === 0xff);
		assert(reader.readUInt8() === 1);

		const network = reader.readUInt8();
		const type = reader.readUInt8();
		const timestamp = reader.readUInt32LE();
		const senderPublicKey = reader.readPublicKey();
		const fee = reader.readBigUInt64LE();
		const vendorField = reader.readBuffer(reader.readUInt8());
		const asset = this.readTransaction1AssetByPlugin(type, reader);

		const primary = reader.readEcdsaSignature();
		let second: Buffer | undefined;
		let multi: Buffer[] | undefined;

		if (reader.remaining.length !== 0 && reader.remaining.readUInt8() !== 0xff) {
			second = reader.readEcdsaSignature();
		}

		if (reader.remaining.length !== 0) {
			assert(reader.readUInt8() === 0xff);
			multi = [];
			while (reader.remaining.length !== 0) {
				multi.push(reader.readEcdsaSignature());
			}
		}

		return {
			version: 1 as const,
			network,
			type,
			timestamp,
			senderPublicKey,
			fee,
			vendorField,
			asset,
			signature: { primary, second, multi },
		};
	}

	public readTransaction1AssetByPlugin(type: number, reader: IReader): unknown {
		for (const plugin of this.plugins ?? []) {
			if (plugin.type === type) {
				return plugin.readTransaction1Asset(reader);
			}
		}

		throw new Error(`Transaction1SerdePlugin for type "${type}" not found.`);
	}

	public writeTransaction1AssetByPlugin(type: number, writer: IWriter, asset: unknown): void {
		for (const plugin of this.plugins ?? []) {
			if (plugin.type === type) {
				plugin.writeTransaction1Asset(writer, asset);
				return;
			}
		}

		throw new Error(`Transaction1SerdePlugin for type "${type}" not found.`);
	}

	public writeTransaction1PayloadLegacyByPlugin(type: number, writer: ILegacyWriter, transaction: Transaction1): void {
		for (const plugin of this.plugins ?? []) {
			if (plugin.type === type) {
				plugin.writeTransaction1PayloadLegacy(writer, transaction);
				return;
			}
		}

		throw new Error(`Transaction1SerdePlugin for type "${type}" not found.`);
	}
}
