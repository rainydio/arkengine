import { IReader } from "@arkengine/serde";
import { injectable } from "inversify";

@injectable()
export class Reader implements IReader {
	public readonly buffer: Buffer;
	public offset = 0;

	public constructor(buffer: Buffer) {
		this.buffer = buffer;
	}

	public get remaining(): number {
		return this.buffer.length - this.offset;
	}

	public jump(length: number): void {
		if (length < -this.offset || length > this.buffer.length - this.offset) {
			throw new RangeError("Jump over buffer boundary.");
		}

		this.offset += length;
	}

	public readInt8(): number {
		const value = this.buffer.readInt8(this.offset);
		this.offset += 1;
		return value;
	}

	public readInt16LE(): number {
		const value = this.buffer.readInt16LE(this.offset);
		this.offset += 2;
		return value;
	}

	public readInt32LE(): number {
		const value = this.buffer.readInt32LE(this.offset);
		this.offset += 4;
		return value;
	}

	public readBigInt64LE(): bigint {
		const value = this.buffer.readBigInt64LE(this.offset);
		this.offset += 8;
		return value;
	}

	public readUInt8(): number {
		const value = this.buffer.readUInt8(this.offset);
		this.offset += 1;
		return value;
	}

	public readUInt16LE(): number {
		const value = this.buffer.readUInt16LE(this.offset);
		this.offset += 2;
		return value;
	}

	public readUInt32LE(): number {
		const value = this.buffer.readUInt32LE(this.offset);
		this.offset += 4;
		return value;
	}

	public readBigUInt64LE(): bigint {
		const value = this.buffer.readBigUInt64LE(this.offset);
		this.offset += 8;
		return value;
	}

	public readBuffer(length: number): Buffer {
		const value = this.buffer.slice(this.offset, this.offset + length);
		this.offset += length;
		return value;
	}

	public readPublicKey(): Buffer {
		return this.readBuffer(33);
	}

	public readEcdsaSignature(): Buffer {
		return this.readBuffer(2 + this.buffer.readUInt8(1 + this.offset));
	}

	public readAddress(): Buffer {
		return this.readBuffer(21);
	}
}
