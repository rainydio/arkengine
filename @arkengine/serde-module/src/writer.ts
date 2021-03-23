import { IWriter } from "@arkengine/serde";
import assert from "assert";
import { injectable } from "inversify";

@injectable()
export class Writer implements IWriter {
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

	public jump(length: number): void {
		if (length < -this.offset || length > this.buffer.length - this.offset) {
			throw new RangeError("Jump over buffer boundary.");
		}

		this.offset += length;
	}

	public writeInt8(value: number): void {
		this.offset = this.buffer.writeInt8(value, this.offset);
	}

	public writeInt16LE(value: number): void {
		this.offset = this.buffer.writeInt16LE(value, this.offset);
	}

	public writeInt32LE(value: number): void {
		this.offset = this.buffer.writeInt32LE(value, this.offset);
	}

	public writeBigInt64LE(value: bigint): void {
		this.offset = this.buffer.writeBigInt64LE(value, this.offset);
	}

	public writeUInt8(value: number): void {
		this.offset = this.buffer.writeUInt8(value, this.offset);
	}

	public writeUInt16LE(value: number): void {
		this.offset = this.buffer.writeUInt16LE(value, this.offset);
	}

	public writeUInt32LE(value: number): void {
		this.offset = this.buffer.writeUInt32LE(value, this.offset);
	}

	public writeBigUInt64LE(value: bigint): void {
		this.offset = this.buffer.writeBigUInt64LE(value, this.offset);
	}

	public writeBuffer(value: Buffer): void {
		this.offset += value.copy(this.buffer, this.offset);
	}

	public writePublicKey(publicKey: Buffer): void {
		assert(publicKey.length === 33);
		this.offset += publicKey.copy(this.buffer, this.offset);
	}

	public writeEcdsaSignature(signature: Buffer): void {
		assert(2 + signature.readUInt8(1) === signature.length);
		this.offset += signature.copy(this.buffer, this.offset);
	}

	public writeAddress(address: Buffer): void {
		assert(address.length === 21);
		this.offset += address.copy(this.buffer, this.offset);
	}
}
