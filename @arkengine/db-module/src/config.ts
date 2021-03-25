import assert from "assert";
import { injectable } from "inversify";

@injectable()
export class Config {
	public getEnvPath(): string {
		const path = process.env["ARK_ENGINE_DB_ENV_PATH"];
		assert(path);
		return path;
	}

	public getEnvMapSize(): number {
		const s = process.env["ARK_ENGINE_DB_ENV_MAP_SIZE"];

		if (s) {
			const val = parseInt(s);
			assert(val.toString() === s);
			return val;
		} else {
			return 8 * 1024 ** 3;
		}
	}

	public getEnvMaxDbs(): number {
		const s = process.env["ARK_ENGINE_DB_ENV_MAX_DBS"];

		if (s) {
			const val = parseInt(s);
			assert(val.toString() === s);
			return val;
		} else {
			return 10000;
		}
	}
}
