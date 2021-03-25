import { GenesisBalance, GenesisDelegate, GenesisState } from "@arkengine/blockchain";
import { IGenesisStateProvider } from "@arkengine/blockchain-settings";
import { CoreType } from "@arkengine/core";
import { IAddressService } from "@arkengine/state";
import assert from "assert";
import base58 from "bcrypto/lib/encoding/base58";
import * as fs from "fs";
import { inject, injectable } from "inversify";

import { Config } from "./config";

type TransferJson = {
	readonly type: CoreType.Transfer;
	readonly amount: string;
	readonly fee: string;
	readonly recipientId: string;
	readonly timestamp: number;
	readonly senderPublicKey: string;
	readonly signature: string;
	readonly id: string;
};

type DelegateRegistrationJson = {
	readonly type: CoreType.DelegateRegistration;
	readonly amount: string;
	readonly fee: string;
	readonly recipientId: null;
	readonly timestamp: number;
	readonly asset: {
		readonly delegate: {
			readonly username: string;
			readonly publicKey: string;
		};
	};
	readonly senderPublicKey: string;
	readonly signature: string;
	readonly id: string;
};

type GenesisBlockJson = {
	readonly version: number;
	readonly timestamp: number;
	readonly height: number;
	readonly previousBlock: null;
	readonly numberOfTransactions: number;
	readonly totalAmount: string;
	readonly totalFee: string;
	readonly reward: string;
	readonly payloadLength: number;
	readonly payloadHash: string;
	readonly generatorPublicKey: string;
	readonly blockSignature: string;
	readonly transactions: readonly (TransferJson | DelegateRegistrationJson)[];
	readonly id: string;
};

@injectable()
export class GenesisStateProvider implements IGenesisStateProvider {
	private readonly genesisState: GenesisState;

	public constructor(
		@inject(Config)
		private readonly config: Config,

		@inject(IAddressService)
		private readonly addressService: IAddressService
	) {
		const contents = fs.readFileSync(this.config.getGenesisBlockJsonPath(), "utf8");
		const genesisBlockJson = JSON.parse(contents) as GenesisBlockJson;
		const genesisBlockJsonTransactionTypes = [CoreType.Transfer, CoreType.DelegateRegistration];

		assert(genesisBlockJson.version === 0);
		assert(genesisBlockJson.timestamp === 0);
		assert(genesisBlockJson.height === 1);
		assert(genesisBlockJson.previousBlock === null);
		assert(genesisBlockJson.numberOfTransactions === genesisBlockJson.transactions.length);
		assert(genesisBlockJson.transactions.every((t) => genesisBlockJsonTransactionTypes.includes(t.type)));
		assert(genesisBlockJson.transactions.every((t) => t.timestamp === 0));

		const id = this.getGenesisBlockJsonId(genesisBlockJson);
		const balances = this.getGenesisBlockJsonBalances(genesisBlockJson);
		const delegates = this.getGenesisBlockJsonDelegates(genesisBlockJson);

		this.genesisState = { id, balances, delegates };
	}

	public getGenesisBlockJsonId(genesisBlockJson: GenesisBlockJson): Buffer {
		if (genesisBlockJson.id.length === 64) {
			return Buffer.from(genesisBlockJson.id, "hex");
		} else {
			const id = Buffer.alloc(8);
			id.writeBigUInt64BE(BigInt(genesisBlockJson.id));
			return id;
		}
	}

	public getGenesisBlockJsonBalances(genesisBlockJson: GenesisBlockJson): GenesisBalance[] {
		const balances: GenesisBalance[] = [];

		for (const transactionJson of genesisBlockJson.transactions) {
			if (transactionJson.type === CoreType.Transfer) {
				const address = base58.decode(transactionJson.recipientId).slice(0, 21);
				const balance = BigInt(transactionJson.amount);

				balances.push({ address, balance });
			}
		}

		return balances;
	}

	public getGenesisBlockJsonDelegates(genesisBlockJson: GenesisBlockJson): GenesisDelegate[] {
		const delegates: GenesisDelegate[] = [];

		for (const transactionJson of genesisBlockJson.transactions) {
			if (transactionJson.type === CoreType.DelegateRegistration) {
				const publicKey = Buffer.from(transactionJson.senderPublicKey, "hex");
				const address = this.addressService.convertPublicKeyToAddress(publicKey);
				const username = transactionJson.asset.delegate.username;

				delegates.push({ address, username });
			}
		}

		return delegates;
	}

	public getGenesisState(): GenesisState {
		return this.genesisState;
	}
}
