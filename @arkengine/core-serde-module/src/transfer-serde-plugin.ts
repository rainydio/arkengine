import { CoreGroup, CoreType, Transfer1, TransferAsset } from "@arkengine/core";
import { ITransferSerdePlugin } from "@arkengine/core-serde";
import { ILegacyWriter, IReader, IWriter } from "@arkengine/serde";
import { injectable } from "inversify";

@injectable()
export class TransferSerdePlugin implements ITransferSerdePlugin {
	public readonly group = CoreGroup;
	public readonly type = CoreType.Transfer;

	public readTransaction1Asset(reader: IReader): TransferAsset {
		const amount = reader.readBigUInt64LE();
		const expirationHeight = reader.readUInt32LE();
		const recipientAddress = reader.readAddress();

		return { recipientAddress, amount, expirationHeight };
	}

	public writeTransaction1Asset(writer: IWriter, asset: TransferAsset): void {
		writer.writeBigUInt64LE(asset.amount);
		writer.writeUInt32LE(asset.expirationHeight);
		writer.writeAddress(asset.recipientAddress);
	}

	public writeTransaction1PayloadLegacy(writer: ILegacyWriter, transaction: Transfer1): void {
		writer.writeUInt8(transaction.type);
		writer.writeUInt32LE(transaction.timestamp);
		writer.writePublicKey(transaction.senderPublicKey);
		writer.writeAddress(transaction.asset.recipientAddress);
		writer.writeVendorField(transaction.vendorField);
		writer.writeBigUInt64LE(transaction.asset.amount);
		writer.writeBigUInt64LE(transaction.fee);
	}

	public readTransaction2Asset(reader: IReader): TransferAsset {
		return this.readTransaction1Asset(reader);
	}

	public writeTransaction2Asset(writer: IWriter, asset: TransferAsset): void {
		this.writeTransaction1Asset(writer, asset);
	}
}
