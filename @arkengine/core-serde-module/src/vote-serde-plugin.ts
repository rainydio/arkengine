import { CoreGroup, CoreType } from "@arkengine/core";
import { Vote1, VoteAsset } from "@arkengine/core-dpos";
import { IVoteSerdePlugin } from "@arkengine/core-serde";
import { IAddressCodec, ILegacyWriter, IReader, IWriter } from "@arkengine/serde";
import assert from "assert";
import { inject, injectable } from "inversify";

@injectable()
export class VoteSerdePlugin implements IVoteSerdePlugin {
	public readonly group = CoreGroup;
	public readonly type = CoreType.Vote;

	public constructor(
		@inject(IAddressCodec)
		private readonly addressCodec: IAddressCodec
	) {}

	public readTransaction1Asset(reader: IReader): VoteAsset {
		const count = reader.readUInt8();
		const votes: VoteAsset["votes"][number][] = [];

		for (let i = 0; i < count; i++) {
			const o = reader.readUInt8();
			const delegatePublicKey = reader.readPublicKey();
			assert(o === 0x00 || o === 0x01);
			votes.push({ op: o ? "+" : "-", delegatePublicKey });
		}

		return { votes };
	}

	public writeTransaction1Asset(writer: IWriter, asset: VoteAsset): void {
		writer.writeUInt8(asset.votes.length);

		for (const vote of asset.votes) {
			writer.writeUInt8(vote.op === "+" ? 0x01 : 0x00);
			writer.writePublicKey(vote.delegatePublicKey);
		}
	}

	public writeTransaction1PayloadLegacy(writer: ILegacyWriter, transaction: Vote1): void {
		const recipientAddress = this.addressCodec.convertPublicKeyToAddress(
			transaction.senderPublicKey,
			transaction.network
		);

		writer.writeUInt8(transaction.type);
		writer.writeUInt32LE(transaction.timestamp);
		writer.writePublicKey(transaction.senderPublicKey);
		writer.writeAddress(recipientAddress);
		writer.writeVendorField(transaction.vendorField);
		writer.writeBigUInt64LE(0n);
		writer.writeBigUInt64LE(transaction.fee);

		for (const vote of transaction.asset.votes) {
			writer.writeUtf8(vote.op);
			writer.writeUtf8(vote.delegatePublicKey.toString("hex"));
		}
	}

	public readTransaction2Asset(reader: IReader): VoteAsset {
		return this.readTransaction1Asset(reader);
	}

	public writeTransaction2Asset(writer: IWriter, asset: VoteAsset): void {
		this.writeTransaction2Asset(writer, asset);
	}
}
