import assert from "assert";
import { injectable } from "inversify";

@injectable()
export class Config {
	public getNetworkJsonPath(): string {
		const path = process.env["ARK_ENGINE_NETWORK_JSON"];
		assert(path);
		return path;
	}

	public getMilestonesJsonPath(): string {
		const path = process.env["ARK_ENGINE_MILESTONES_JSON"];
		assert(path);
		return path;
	}

	public getGenesisBlockJsonPath(): string {
		const path = process.env["ARK_ENGINE_GENESIS_BLOCK_JSON"];
		assert(path);
		return path;
	}

	public getExceptionsJsonPath(): string {
		const path = process.env["ARK_ENGINE_EXCEPTIONS_JSON"];
		assert(path);
		return path;
	}
}
