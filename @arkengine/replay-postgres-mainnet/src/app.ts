import { IBlockchain, IBlockHandler, ITransaction1Handler } from "@arkengine/blockchain";
import { ITransaction1Serde } from "@arkengine/blockchain-serde";
import { IDbEnvContext, IDbTxnContext } from "@arkengine/db";
import assert from "assert";
import { inject, injectable } from "inversify";

import { BlockReader } from "./block-reader";

@injectable()
export class App {
	public constructor(
		@inject(BlockReader)
		private readonly blockReader: BlockReader,

		@inject(IBlockchain)
		private readonly blockchain: IBlockchain,

		@inject(IBlockHandler)
		private readonly blockHandler: IBlockHandler,

		@inject(IDbTxnContext)
		private readonly dbTxnContext: IDbTxnContext
	) {}

	public async run(): Promise<void> {
		let start: number;
		let ts: number;
		let count = 0;

		const batch: Buffer[] = [];

		await this.blockchain.start(async () => {
			for await (const blockBuffer of this.blockReader.getBlocks(2, 11273000)) {
				start = start ?? Date.now();
				ts = ts ?? start;

				batch.push(blockBuffer);

				if (Date.now() - ts > 50) {
					ts = Date.now();

					this.dbTxnContext.runWriteTxnSync(() => {
						batch.forEach((bb) => this.blockHandler.handle(bb));
					});

					count += batch.length;
					batch.splice(0, batch.length);

					const bps = Math.floor((1000 * count) / (Date.now() - start));
					console.clear();
					console.log(`${count} (${bps}/s) blocks replayed`);
				}
			}

			this.dbTxnContext.runWriteTxnSync(() => {
				batch.forEach((bb) => this.blockHandler.handle(bb));
			});
		});
	}
}
