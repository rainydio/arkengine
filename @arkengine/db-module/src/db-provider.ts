import { IDbEnvContext, IDbProvider, IDbTxnContext, IKeyValueDb, IKeyValueSetDb } from "@arkengine/db";
import { inject, injectable } from "inversify";

import { KeyValueDb } from "./key-value-db";
import { KeyValueSetDb } from "./key-value-set-db";
import { Utils } from "./utils";

@injectable()
export class DbProvider implements IDbProvider {
	public constructor(
		@inject(IDbEnvContext)
		private readonly dbEnvContext: IDbEnvContext,

		@inject(IDbTxnContext)
		private readonly dbTxnContext: IDbTxnContext,

		@inject(Utils)
		private readonly utils: Utils
	) {}

	public getKeyValueDb(name: string): IKeyValueDb {
		return new KeyValueDb(name, this.dbEnvContext, this.dbTxnContext, this.utils);
	}

	public getKeyValueSetDb(name: string): IKeyValueSetDb {
		return new KeyValueSetDb(name, this.dbEnvContext, this.dbTxnContext, this.utils);
	}
}
