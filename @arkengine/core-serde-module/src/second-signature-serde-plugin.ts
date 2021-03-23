import { CoreGroup, CoreType, SecondSignature1, SecondSignatureAsset } from "@arkengine/core";
import { ISecondSignatureSerdePlugin } from "@arkengine/core-serde";
import { ILegacyWriter, IReader, IWriter } from "@arkengine/serde";
import { injectable } from "inversify";

@injectable()
export class SecondSignatureSerdePlugin implements ISecondSignatureSerdePlugin {
	public readonly group = CoreGroup;
	public readonly type = CoreType.SecondSignature;

	public readTransaction1Asset(reader: IReader): SecondSignatureAsset {
		const secondPublicKey = reader.readPublicKey();

		return { secondPublicKey };
	}

	public writeTransaction1Asset(writer: IWriter, asset: SecondSignatureAsset): void {
		writer.writePublicKey(asset.secondPublicKey);
	}

	public writeTransaction1PayloadLegacy(writer: ILegacyWriter, transaction: SecondSignature1): void {
		writer.writeUInt8(transaction.type);
		writer.writeUInt32LE(transaction.timestamp);
		writer.writePublicKey(transaction.senderPublicKey);
		writer.writeAddress(null);
		writer.writeVendorField(transaction.vendorField);
		writer.writeBigUInt64LE(0n);
		writer.writeBigUInt64LE(transaction.fee);
		writer.writePublicKey(transaction.asset.secondPublicKey);
	}

	public readTransaction2Asset(reader: IReader): SecondSignatureAsset {
		return this.readTransaction1Asset(reader);
	}

	public writeTransaction2Asset(writer: IWriter, asset: SecondSignatureAsset): void {
		this.writeTransaction2Asset(writer, asset);
	}
}
