import { ISecondPublicKeyDb } from "@arkengine/core";
import { IDbProvider, IKeyValueDb } from "@arkengine/db";
import { inject, injectable } from "inversify";

@injectable()
export class SecondPublicKeyDb implements ISecondPublicKeyDb {
	private readonly db: IKeyValueDb;

	public constructor(
		@inject(IDbProvider)
		private readonly dbProvider: IDbProvider
	) {
		this.db = this.dbProvider.getKeyValueDb("core_second_public_key_by_address");
	}

	public has(address: Buffer): boolean {
		return this.db.has(address);
	}

	public set(address: Buffer, secondPublicKey: Buffer): void {
		this.db.set(address, secondPublicKey);
	}

	public get(address: Buffer): Buffer {
		return this.db.get(address);
	}
}
