import { IExceptionsProvider } from "@arkengine/blockchain-settings";
import * as fs from "fs";
import { inject, injectable } from "inversify";

import { Config } from "./config";

type ExceptionsJson = {
	readonly outlookTable?: { [blockId: string]: string };
	readonly transactionIdFixTable?: { [transactionId: string]: string };
	readonly transactions?: readonly [string];
	readonly wrongTransactionOrder?: { [blockId: string]: [string] };
};

@injectable()
export class ExceptionsProvider implements IExceptionsProvider {
	private readonly blockIdReplacements: [Buffer, Buffer][] = [];
	private readonly transactionIdReplacements: [Buffer, Buffer][] = [];
	private readonly reversedBlockIds: Buffer[] = [];
	private readonly trustedTransactionIds: Buffer[] = [];

	public constructor(
		@inject(Config)
		private readonly config: Config
	) {
		const contents = fs.readFileSync(this.config.getExceptionsJsonPath(), "utf8");
		const exceptionsJson = JSON.parse(contents) as ExceptionsJson;

		this.addBlockIdReplacements(exceptionsJson);
		this.addTransactionIdReplacements(exceptionsJson);
		this.addReversedBlockIds(exceptionsJson);
		this.addTrustedTransactionIds(exceptionsJson);
	}

	public addBlockIdReplacements(exceptionsJson: ExceptionsJson): void {
		if (exceptionsJson.outlookTable) {
			for (const [calculatedIdStr, replacementIdStr] of Object.entries(exceptionsJson.outlookTable)) {
				let calculatedId: Buffer;

				if (calculatedIdStr.length === 64) {
					calculatedId = Buffer.from(calculatedIdStr, "hex");
				} else {
					calculatedId = Buffer.alloc(8);
					calculatedId.writeBigUInt64BE(BigInt(calculatedIdStr));
				}

				let replacementId: Buffer;

				if (replacementIdStr.length === 64) {
					replacementId = Buffer.from(replacementIdStr, "hex");
				} else {
					replacementId = Buffer.alloc(8);
					replacementId.writeBigUInt64BE(BigInt(replacementIdStr));
				}

				this.blockIdReplacements.push([calculatedId, replacementId]);
			}
		}
	}

	public addTransactionIdReplacements(exceptionsJson: ExceptionsJson): void {
		if (exceptionsJson.transactionIdFixTable) {
			for (const [calculatedIdStr, replacementIdStr] of Object.entries(exceptionsJson.transactionIdFixTable)) {
				const calculatedId = Buffer.from(calculatedIdStr, "hex");
				const replacementId = Buffer.from(replacementIdStr, "hex");

				this.transactionIdReplacements.push([calculatedId, replacementId]);
			}
		}
	}

	public addReversedBlockIds(exceptionsJson: ExceptionsJson): void {
		if (exceptionsJson.wrongTransactionOrder) {
			for (const blockIdStr of Object.keys(exceptionsJson.wrongTransactionOrder)) {
				let blockId: Buffer;

				if (blockIdStr.length === 64) {
					blockId = Buffer.from(blockIdStr, "hex");
				} else {
					blockId = Buffer.alloc(8);
					blockId.writeBigUInt64BE(BigInt(blockIdStr));
				}

				this.reversedBlockIds.push(blockId);
			}
		}
	}

	public addTrustedTransactionIds(exceptionsJson: ExceptionsJson): void {
		if (exceptionsJson.transactions) {
			for (const transactionIdStr of exceptionsJson.transactions) {
				const transactionId = Buffer.from(transactionIdStr, "hex");
				this.trustedTransactionIds.push(transactionId);
			}
		}
	}

	public getBlockIdReplacements(): readonly [Buffer, Buffer][] {
		return this.blockIdReplacements;
	}

	public getTransactionIdReplacements(): readonly [Buffer, Buffer][] {
		return this.transactionIdReplacements;
	}

	public getReversedBlockIds(): readonly Buffer[] {
		return this.reversedBlockIds;
	}

	public getTrustedTransactionIds(): readonly Buffer[] {
		return this.trustedTransactionIds;
	}
}
