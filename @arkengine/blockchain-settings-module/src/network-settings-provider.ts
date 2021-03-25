import { INetworkSettingsProvider } from "@arkengine/blockchain-settings";
import * as fs from "fs";
import { inject, injectable } from "inversify";

import { Config } from "./config";

type NetworkJson = {
	pubKeyHash: number;
};

@injectable()
export class NetworkSettingsProvider implements INetworkSettingsProvider {
	private readonly networkJson: NetworkJson;

	public constructor(
		@inject(Config)
		private readonly config: Config
	) {
		const contents = fs.readFileSync(this.config.getNetworkJsonPath(), "utf8");
		this.networkJson = JSON.parse(contents) as NetworkJson;
	}

	public getPubKeyHash(): number {
		return this.networkJson.pubKeyHash;
	}
}
