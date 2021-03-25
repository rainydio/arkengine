import { IDbProvider, IKeyValueDb } from "@arkengine/db";
import { IBalanceDb } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class BalanceDb implements IBalanceDb {
	private readonly db: IKeyValueDb;

	public constructor(
		@inject(IDbProvider)
		private readonly dbProvider: IDbProvider
	) {
		this.db = this.dbProvider.getKeyValueDb("balance_by_address");
	}

	public get(address: Buffer): bigint {
		if (this.db.has(address)) {
			return this.db.get(address).readBigInt64BE();
		} else {
			return 0n;
		}
	}

	public set(address: Buffer, balance: bigint): void {
		if (balance === 0n) {
			this.db.delete(address);
		} else {
			const buf = Buffer.alloc(8);
			buf.writeBigInt64BE(balance);
			this.db.set(address, buf);
		}
	}
}
