import { IDbProvider, IKeyValueDb } from "@arkengine/db";
import { ILastBlockDb } from "@arkengine/state";
import { inject, injectable } from "inversify";

const K_ID = Buffer.from("id", "utf8");
const K_HEIGHT = Buffer.from("height", "utf8");

@injectable()
export class LastBlockDb implements ILastBlockDb {
	private readonly db: IKeyValueDb;

	public constructor(
		@inject(IDbProvider)
		private readonly dbProvider: IDbProvider
	) {
		this.db = this.dbProvider.getKeyValueDb("last_block");
	}

	public hasId(): boolean {
		return this.db.has(K_ID);
	}

	public getId(): Buffer {
		return this.db.get(K_ID);
	}

	public setId(id: Buffer): void {
		if (id.length === 0) {
			this.db.delete(K_ID);
		} else {
			this.db.set(K_ID, id);
		}
	}

	public getHeight(): number {
		if (this.db.has(K_HEIGHT)) {
			return this.db.get(K_HEIGHT).readUInt32BE();
		} else {
			return 0;
		}
	}

	public setHeight(height: number): void {
		if (height === 0) {
			this.db.delete(K_HEIGHT);
		} else {
			const buf = Buffer.alloc(4);
			buf.writeUInt32BE(height);
			this.db.set(K_HEIGHT, buf);
		}
	}
}
