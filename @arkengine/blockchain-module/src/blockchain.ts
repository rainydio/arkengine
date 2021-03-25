import { IBlockchain, IBlockHandler, ICurrentBlock } from "@arkengine/blockchain";
import { IGenesisStateProvider } from "@arkengine/blockchain-settings";
import { IDbEnvContext, IDbTxnContext } from "@arkengine/db";
import { IBalanceService, ILastBlockService } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class Blockchain implements IBlockchain {
	public constructor(
		@inject(IDbEnvContext)
		private readonly dbEnvContext: IDbEnvContext,

		@inject(IDbTxnContext)
		private readonly dbTxnContext: IDbTxnContext,

		@inject(IGenesisStateProvider)
		private readonly genesisStateProvider: IGenesisStateProvider,

		@inject(ILastBlockService)
		private readonly lastBlockService: ILastBlockService,

		@inject(ICurrentBlock)
		private readonly currentBlock: ICurrentBlock,

		@inject(IBalanceService)
		private readonly balanceService: IBalanceService,

		@inject(IBlockHandler)
		private readonly blockHandler: IBlockHandler
	) {}

	public async start<T>(cb: () => Promise<T>): Promise<T> {
		return await this.dbEnvContext.start(async () => {
			// const initialized = this.dbTxnContext.runReadTxnSync(() => {
			// 	return this.lastBlockService.getHeight() !== 0;
			// });

			const initialized = false;

			if (initialized === false) {
				this.dbTxnContext.runWriteTxnSync(() => {
					if (this.lastBlockService.getHeight() !== 0) {
						// might have been modified by another process
						return;
					}

					const genesisState = this.genesisStateProvider.getGenesisState();

					this.currentBlock.startNewBlock(genesisState.id, () => {
						for (const { address, balance } of genesisState.balances) {
							this.balanceService.reward(address, balance);
						}
					});
				});
			}

			return await cb();
		});
	}

	public handle(blockBuffer: Buffer): void {
		this.dbTxnContext.runWriteTxnSync(() => {
			this.blockHandler.handle(blockBuffer);
		});
	}
}
