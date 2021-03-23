import { CoreGroup, CoreType, MultiSignature1, MultiSignature1Asset, MultiSignature2Asset } from "@arkengine/core";
import { IMultiSignatureSerdePlugin } from "@arkengine/core-serde";
import { ILegacyWriter, IReader, IWriter } from "@arkengine/serde";
import { injectable } from "inversify";

@injectable()
export class MultiSignatureSerdePlugin implements IMultiSignatureSerdePlugin {
	public readonly group = CoreGroup;
	public readonly type = CoreType.MultiSignature;

	public readTransaction1Asset(reader: IReader): MultiSignature1Asset {
		const min = reader.readUInt8();
		const count = reader.readUInt8();
		const lifetime = reader.readUInt8();
		const publicKeys: Buffer[] = [];

		for (let i = 0; i < count; i++) {
			const publicKey = reader.readPublicKey();
			publicKeys.push(publicKey);
		}

		return { min, lifetime, publicKeys };
	}

	public writeTransaction1Asset(writer: IWriter, asset: MultiSignature1Asset): void {
		writer.writeUInt8(asset.min);
		writer.writeUInt8(asset.publicKeys.length);
		writer.writeUInt8(asset.lifetime);

		for (const publicKey of asset.publicKeys) {
			writer.writePublicKey(publicKey);
		}
	}

	public writeTransaction1PayloadLegacy(writer: ILegacyWriter, transaction: MultiSignature1): void {
		writer.writeUInt8(transaction.type);
		writer.writeUInt32LE(transaction.timestamp);
		writer.writePublicKey(transaction.senderPublicKey);
		writer.writeAddress(null);
		writer.writeVendorField(transaction.vendorField);
		writer.writeBigUInt64LE(0n);
		writer.writeBigUInt64LE(transaction.fee);
		writer.writeUInt8(transaction.asset.min);
		writer.writeUInt8(transaction.asset.lifetime);

		for (const publicKey of transaction.asset.publicKeys) {
			writer.writeUtf8("+");
			writer.writeUtf8(publicKey.toString("hex"));
		}
	}

	public readTransaction2Asset(reader: IReader): MultiSignature2Asset {
		const min = reader.readUInt8();
		const count = reader.readUInt8();
		const publicKeys: Buffer[] = [];

		for (let i = 0; i < count; i++) {
			const publicKey = reader.readPublicKey();
			publicKeys.push(publicKey);
		}

		return { min, publicKeys };
	}

	public writeTransaction2Asset(writer: IWriter, asset: MultiSignature2Asset): void {
		writer.writeUInt8(asset.min);
		writer.writeUInt8(asset.publicKeys.length);

		for (const publicKey of asset.publicKeys) {
			writer.writePublicKey(publicKey);
		}
	}
}
