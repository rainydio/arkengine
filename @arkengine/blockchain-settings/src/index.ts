import { GenesisState, Milestone } from "@arkengine/blockchain";

export interface INetworkSettingsProvider {
	getPubKeyHash(): number;
}

export interface IMilestonesProvider {
	getMilestones(): readonly Milestone[];
}

export interface IGenesisStateProvider {
	getGenesisState(): GenesisState;
}

export interface IExceptionsProvider {
	getBlockIdReplacements(): readonly [Buffer, Buffer][];
	getTransactionIdReplacements(): readonly [Buffer, Buffer][];
	getTrustedTransactionIds(): readonly Buffer[];
	getReversedBlockIds(): readonly Buffer[];
}

export const INetworkSettingsProvider = Symbol(`INetworkSettingsProvider@${__filename}`);
export const IMilestonesProvider = Symbol(`IMilestonesProvider@${__filename}`);
export const IGenesisStateProvider = Symbol(`IGenesisStateProvider@${__filename}`);
export const IExceptionsProvider = Symbol(`IExceptionsProvider@${__filename}`);
