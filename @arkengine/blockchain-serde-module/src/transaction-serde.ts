import { Transaction } from "@arkengine/blockchain";
import { ITransaction1Serde, ITransactionSerde } from "@arkengine/blockchain-serde";
import assert from "assert";
import { inject, injectable } from "inversify";

@injectable()
export class TransactionSerde implements ITransactionSerde {
	public constructor(
		@inject(ITransaction1Serde)
		private readonly transaction1Serde: ITransaction1Serde
	) {}

	public getId(transaction: Transaction): Buffer {
		switch (transaction.version) {
			case 1:
				return this.transaction1Serde.getId(transaction);
			default:
				throw new Error(`Unsupported "${transaction.version}" transaction version.`);
		}
	}

	public serialize(transaction: Transaction): Buffer {
		switch (transaction.version) {
			case 1:
				return this.transaction1Serde.serialize(transaction);
			default:
				throw new Error(`Unsupported "${transaction.version}" transaction version.`);
		}
	}

	public deserialize(buffer: Buffer): Transaction {
		assert(buffer.readUInt8(0) === 0xff);

		const version = buffer.readUInt8(1);

		switch (version) {
			case 1:
				return this.transaction1Serde.deserialize(buffer);
			default:
				throw new Error(`Unsupported "${version}" transaction version.`);
		}
	}
}
