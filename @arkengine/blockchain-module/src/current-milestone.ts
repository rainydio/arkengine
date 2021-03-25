import { ICurrentMilestone, Milestone } from "@arkengine/blockchain";
import { IMilestonesProvider } from "@arkengine/blockchain-settings";
import assert from "assert";
import { inject, injectable } from "inversify";

const merge = <T extends Record<string, unknown>>(target: T, source: unknown): T => {
	if (typeof source === "object" && source !== null) {
		Object.assign(target, source);

		for (const [key, value] of Object.entries(source)) {
			if (typeof target[key] === "object") {
				merge(target[key] as Record<string, unknown>, value);
			}
		}
	}

	return target;
};

@injectable()
export class CurrentMilestone implements ICurrentMilestone {
	private readonly milestones: Milestone[] = [];
	private index = 0;

	public constructor(
		@inject(IMilestonesProvider)
		private readonly milestoneProvider: IMilestonesProvider
	) {
		for (const milestone of this.milestoneProvider.getMilestones()) {
			const m = {} as Milestone;
			merge(m, this.milestones[this.milestones.length - 1]);
			merge(m, milestone);
			this.milestones.push(m);
		}

		assert(this.milestones.length);
	}

	public get(): Milestone {
		return this.milestones[this.index];
	}

	public select(height: number): void {
		while (this.index < this.milestones.length - 1 && height >= this.milestones[this.index + 1].height) {
			this.index++;
		}

		while (height < this.milestones[this.index].height) {
			this.index--;
		}
	}
}
