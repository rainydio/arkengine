import { IDbEnvContext } from "@arkengine/db";
import assert from "assert";
import * as fs from "fs";
import { injectable } from "inversify";
import { Env } from "node-lmdb";

const envPath = "./db";

fs.rmdirSync(envPath, { recursive: true });
fs.mkdirSync(envPath, { recursive: true });

@injectable()
export class DbEnvContext implements IDbEnvContext {
	private env?: Env;

	public getEnv(): Env {
		assert(this.env);
		return this.env;
	}

	public openEnvSync<T>(cb: () => T): T {
		const env = new Env();

		env.open({
			path: envPath,
			maxDbs: 10000,
		});

		this.env = env;

		try {
			return cb();
		} finally {
			this.env.close();
			this.env = undefined;
		}
	}

	public async openEnvAsync<T>(cb: () => Promise<T>): Promise<T> {
		const env = new Env();

		env.open({
			path: envPath,
			maxDbs: 10000,
		});

		this.env = env;

		try {
			return await cb();
		} finally {
			this.env.close();
			this.env = undefined;
		}
	}
}
