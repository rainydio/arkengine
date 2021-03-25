import { CoreGroup, CoreType } from "@arkengine/core";
import { DelegateRegistration1, DelegateRegistrationAsset } from "@arkengine/core-dpos";
import { IDelegateRegistrationSerdePlugin } from "@arkengine/core-serde";
import { ILegacyWriter, IReader, IWriter } from "@arkengine/serde";
import { injectable } from "inversify";

@injectable()
export class DelegateRegistrationSerdePlugin implements IDelegateRegistrationSerdePlugin {
	public readonly group = CoreGroup;
	public readonly type = CoreType.DelegateRegistration;

	public readTransaction1Asset(reader: IReader): DelegateRegistrationAsset {
		const username = reader.readBuffer(reader.readUInt8()).toString("utf8");

		return { username };
	}

	public writeTransaction1Asset(writer: IWriter, asset: DelegateRegistrationAsset): void {
		const buf = Buffer.from(asset.username, "utf8");

		writer.writeUInt8(buf.length);
		writer.writeBuffer(buf);
	}

	public writeTransaction1PayloadLegacy(writer: ILegacyWriter, transaction: DelegateRegistration1): void {
		writer.writeUInt8(transaction.type);
		writer.writeUInt32LE(transaction.timestamp);
		writer.writePublicKey(transaction.senderPublicKey);
		writer.writeAddress(null);
		writer.writeVendorField(transaction.vendorField);
		writer.writeBigUInt64LE(0n);
		writer.writeBigUInt64LE(transaction.fee);
		writer.writeUtf8(transaction.asset.username);
	}

	public readTransaction2Asset(reader: IReader): DelegateRegistrationAsset {
		return this.readTransaction1Asset(reader);
	}

	public writeTransaction2Asset(writer: IWriter, asset: DelegateRegistrationAsset): void {
		this.writeTransaction2Asset(writer, asset);
	}
}
