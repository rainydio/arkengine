import { IDbEnvContext } from "@arkengine/db";
import assert from "assert";
import * as fs from "fs";
import { inject, injectable } from "inversify";
import { Env } from "node-lmdb";

import { Config } from "./config";

@injectable()
export class DbEnvContext implements IDbEnvContext {
	private env?: Env;

	public constructor(
		@inject(Config)
		private readonly dbConfig: Config
	) {}

	public getEnv(): Env {
		assert(this.env);
		return this.env;
	}

	public openEnvSync<T>(cb: () => T): T {
		const env = new Env();
		const path = this.dbConfig.getEnvPath();
		const mapSize = this.dbConfig.getEnvMapSize();
		const maxDbs = this.dbConfig.getEnvMaxDbs();

		fs.mkdirSync(path, { recursive: true });

		env.open({ path, mapSize, maxDbs });
		this.env = env;

		try {
			return cb();
		} finally {
			this.env.close();
			this.env = undefined;
		}
	}

	public async start<T>(cb: () => Promise<T>): Promise<T> {
		const env = new Env();
		const path = this.dbConfig.getEnvPath();
		const mapSize = this.dbConfig.getEnvMapSize();
		const maxDbs = this.dbConfig.getEnvMaxDbs();

		fs.mkdirSync(path, { recursive: true });

		env.open({ path, mapSize, maxDbs });
		this.env = env;

		try {
			return await cb();
		} finally {
			this.env.close();
			this.env = undefined;
		}
	}
}
