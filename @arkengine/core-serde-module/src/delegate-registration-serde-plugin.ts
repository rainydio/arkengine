import { CoreGroup, CoreType, DelegateRegistration1, DelegateRegistrationAsset } from "@arkengine/core";
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

	public writeTransaction1PayloadLegacy(writer: ILegacyWriter, data: DelegateRegistration1): void {
		writer.writeUInt8(data.type);
		writer.writeUInt32LE(data.timestamp);
		writer.writePublicKey(data.senderPublicKey);
		writer.writeAddress(null);
		writer.writeVendorField(data.vendorField);
		writer.writeBigUInt64LE(0n);
		writer.writeBigUInt64LE(data.fee);
		writer.writeUtf8(data.asset.username);
	}

	public readTransaction2Asset(reader: IReader): DelegateRegistrationAsset {
		return this.readTransaction1Asset(reader);
	}

	public writeTransaction2Asset(writer: IWriter, asset: DelegateRegistrationAsset): void {
		this.writeTransaction2Asset(writer, asset);
	}
}
