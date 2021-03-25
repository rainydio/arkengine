import { Milestone } from "@arkengine/blockchain";
import { IMilestonesProvider } from "@arkengine/blockchain-settings";
import * as fs from "fs";
import { inject, injectable } from "inversify";

import { Config } from "./config";

@injectable()
export class MilestonesProvider implements IMilestonesProvider {
	private readonly milestones: Milestone[];

	public constructor(
		@inject(Config)
		private readonly config: Config
	) {
		const contents = fs.readFileSync(this.config.getMilestonesJsonPath(), "utf8");
		this.milestones = JSON.parse(contents) as Milestone[];
	}

	public getMilestones(): readonly Milestone[] {
		return this.milestones;
	}
}
