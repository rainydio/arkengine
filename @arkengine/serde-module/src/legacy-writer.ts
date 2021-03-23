import { ILegacyWriter } from "@arkengine/serde";
import assert from "assert";
import { injectable } from "inversify";

@injectable()
export class LegacyWriter implements ILegacyWriter {
	public readonly buffer: Buffer;
	public offset = 0;

	public constructor(buffer: Buffer) {
		this.buffer = buffer;
	}

	public get remaining(): number {
		return this.buffer.length - this.offset;
	}

	public get result(): Buffer {
		return this.buffer.slice(0, this.offset);
	}

	public writeUInt8(value: number): void {
		this.offset = this.buffer.writeUInt8(value, this.offset);
	}

	public writeUInt32LE(value: number): void {
		this.offset = this.buffer.writeUInt32LE(value, this.offset);
	}

	public writeBigUInt64LE(value: bigint): void {
		this.offset = this.buffer.writeBigUInt64LE(value, this.offset);
	}

	public writeUtf8(value: string): void {
		this.offset += this.buffer.write(value, this.offset);
	}

	public writeAddress(address: Buffer | null): void {
		if (address !== null) {
			assert(address.length === 21);
			this.offset += address.copy(this.buffer, this.offset);
		} else {
			this.buffer.fill(0x00, this.offset, this.offset + 21);
			this.offset += 21;
		}
	}

	public writePublicKey(publicKey: Buffer): void {
		assert(publicKey.length === 33);
		this.offset += publicKey.copy(this.buffer, this.offset);
	}

	public writeVendorField(vendorField: Buffer): void {
		this.offset += vendorField.copy(this.buffer, this.offset);

		const len = Math.max(0, 64 - vendorField.length);
		this.buffer.fill(0x00, this.offset, this.offset + len);
		this.offset += len;
	}

	public writeEcdsaSignature(signature: Buffer): void {
		assert(2 + signature.readUInt8(1) === signature.length);
		this.offset += signature.copy(this.buffer, this.offset);
	}
}
