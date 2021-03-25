export interface IReader {
	readonly buffer: Buffer;
	readonly offset: number;
	readonly remaining: Buffer;

	jump(length: number): void;

	readInt8(): number;
	readInt16LE(): number;
	readInt32LE(): number;
	readBigInt64LE(): bigint;

	readUInt8(): number;
	readUInt16LE(): number;
	readUInt32LE(): number;
	readBigUInt64LE(): bigint;

	readBuffer(length: number): Buffer;
	readAddress(): Buffer;
	readPublicKey(): Buffer;
	readEcdsaSignature(): Buffer;
}

export interface IWriter {
	readonly buffer: Buffer;
	readonly offset: number;
	readonly remaining: Buffer;
	readonly result: Buffer;

	jump(length: number): void;

	writeInt8(value: number): void;
	writeInt16LE(value: number): void;
	writeInt32LE(value: number): void;
	writeBigInt64LE(value: bigint): void;

	writeUInt8(value: number): void;
	writeUInt16LE(value: number): void;
	writeUInt32LE(value: number): void;
	writeBigUInt64LE(value: bigint): void;

	writeBuffer(value: Buffer): void;
	writeAddress(address: Buffer): void;
	writePublicKey(publicKey: Buffer): void;
	writeEcdsaSignature(signature: Buffer): void;
}

export interface ILegacyWriter {
	readonly buffer: Buffer;
	readonly offset: number;
	readonly remaining: number;
	readonly result: Buffer;

	writeUInt8(value: number): void;
	writeUInt32LE(value: number): void;
	writeBigUInt64LE(value: bigint): void;
	writeUtf8(value: string): void;

	writeAddress(address: Buffer | null): void;
	writePublicKey(publicKey: Buffer): void;
	writeVendorField(vendorField: Buffer): void;
	writeEcdsaSignature(signature: Buffer): void;
}

export interface IReaderFactory {
	createReader(buffer: Buffer): IReader;
}

export interface IWriterFactory {
	createWriter(buffer: Buffer): IWriter;
}

export interface ILegacyWriterFactory {
	createLegacyWriter(buffer: Buffer): ILegacyWriter;
}

export interface IAddressCodec {
	getAddressNetwork(address: Buffer): number;

	convertAddressToString(address: Buffer): string;
	convertStringToAddress(string: string): Buffer;
	convertPublicKeyToAddress(publicKey: Buffer, network: number): Buffer;
}

export const IReaderFactory = Symbol();
export const IWriterFactory = Symbol();
export const ILegacyWriterFactory = Symbol();
export const IAddressCodec = Symbol();
