import { IDbEnvContext, IDbProvider, IDbTxnContext, IDbUtils, IKeyValueDb, IKeyValueSetDb } from "@arkengine/db";
import { inject, injectable } from "inversify";

import { KeyValueDb } from "./key-value-db";
import { KeyValueSetDb } from "./key-value-set-db";

@injectable()
export class DbProvider implements IDbProvider {
	public constructor(
		@inject(IDbEnvContext)
		private readonly dbEnvContext: IDbEnvContext,

		@inject(IDbTxnContext)
		private readonly dbTxnContext: IDbTxnContext,

		@inject(IDbUtils)
		private readonly dbUtils: IDbUtils
	) {}

	public getKeyValueDb(name: string): IKeyValueDb {
		return new KeyValueDb(name, this.dbEnvContext, this.dbTxnContext, this.dbUtils);
	}

	public getKeyValueSetDb(name: string): IKeyValueSetDb {
		return new KeyValueSetDb(name, this.dbEnvContext, this.dbTxnContext, this.dbUtils);
	}
}
