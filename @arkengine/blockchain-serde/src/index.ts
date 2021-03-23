import { Block, Transaction, Transaction1, Transaction2 } from "@arkengine/blockchain";
import { ILegacyWriter, IReader, IWriter } from "@arkengine/serde";

export interface IBlockSerde {
	getId(block: Block): Buffer;
	getHash(block: Block): Buffer;
	serialize(block: Block): Buffer;
	deserialize(buffer: Buffer): Block;
}

export interface ITransactionSerde {
	getId(transaction: Transaction): Buffer;
	serialize(transaction: Transaction): Buffer;
	deserialize(buffer: Buffer): Transaction;
}

export interface ITransaction1Serde {
	getId(transaction: Transaction1): Buffer;
	getPrimaryHash(transaction: Transaction1): Buffer;
	getSecondHash(transaction: Transaction1): Buffer;
	getMultiHash(transaction: Transaction1): Buffer;
	serialize(transaction: Transaction1): Buffer;
	deserialize(buffer: Buffer): Transaction1;
}

export interface ITransaction2Serde {
	getId(transaction: Transaction2): Buffer;
	getHash(transaction: Transaction2): Buffer;
	serialize(transaction: Transaction2): Buffer;
	deserialize(buffer: Buffer): Transaction2;
}

export interface ITransaction1SerdePlugin<T extends Transaction1> {
	readonly type: T["type"];

	readTransaction1Asset(reader: IReader): T["asset"];
	writeTransaction1Asset(writer: IWriter, asset: T["asset"]): void;
	writeTransaction1PayloadLegacy(writer: ILegacyWriter, payload: Omit<T, "signature">): void;
}

export interface ITransaction2SerdePlugin<T extends Transaction2> {
	readonly group: T["group"];
	readonly type: T["type"];

	readTransaction2Asset(reader: IReader): T["asset"];
	writeTransaction2Asset(writer: IWriter, asset: T["asset"]): void;
}

export const ITransaction1Serde = Symbol();
export const ITransaction2Serde = Symbol();
export const ITransaction1SerdePlugin = Symbol();
export const ITransaction2SerdePlugin = Symbol();
