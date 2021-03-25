import { ICurrentTransaction } from "@arkengine/blockchain";
import { IAddressCodec } from "@arkengine/serde";
import { IAddressService, IBalanceDb, IBalanceService } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class BalanceService implements IBalanceService {
	public constructor(
		@inject(IBalanceDb)
		private readonly db: IBalanceDb,

		@inject(ICurrentTransaction)
		private readonly currentTransaction: ICurrentTransaction,

		@inject(IAddressService)
		private readonly addressService: IAddressService,

		@inject(IAddressCodec)
		private readonly addressCodec: IAddressCodec
	) {}

	public get(address: Buffer): bigint {
		try {
			this.addressService.verifyAddressNetwork(address);
		} catch (error) {
			const addressStr = this.addressCodec.convertAddressToString(address);
			throw new Error(`Cannot read "${addressStr}" balance. ${error.message}`);
		}

		return this.db.get(address);
	}

	public reward(address: Buffer, amount: bigint): void {
		try {
			if (amount < 0n) {
				if (this.currentTransaction.isTrusted() === false) {
					throw new Error(`"${amount}" is negative.`);
				}
			}

			this.addressService.verifyAddressNetwork(address);
		} catch (error) {
			const addressStr = this.addressCodec.convertAddressToString(address);
			throw new Error(`Cannot reward "${amount}" to "${addressStr}". ${error.message}`);
		}

		this.db.set(address, this.db.get(address) + amount);
	}

	public burn(address: Buffer, amount: bigint): void {
		try {
			if (amount < 0n) {
				if (this.currentTransaction.isTrusted() === false) {
					throw new Error(`"${amount}" is negative.`);
				}
			}

			this.addressService.verifyAddressNetwork(address);
		} catch (error) {
			const addressStr = this.addressCodec.convertAddressToString(address);
			throw new Error(`Cannot burn "${amount}" from "${addressStr}". ${error.message}`);
		}

		this.db.set(address, this.db.get(address) - amount);
	}

	public transfer(from: Buffer, to: Buffer, amount: bigint): void {
		const fromCurrentBalance = this.db.get(from);
		const toCurrentBalance = this.db.get(to);

		try {
			if (amount < 0n) {
				if (this.currentTransaction.isTrusted() === false) {
					throw new Error(`"${amount}" is negative.`);
				}
			}

			this.addressService.verifyAddressNetwork(from);
			this.addressService.verifyAddressNetwork(to);

			if (fromCurrentBalance - amount < 0n) {
				if (this.currentTransaction.isTrusted() === false) {
					const fromStr = this.addressCodec.convertAddressToString(from);
					throw new Error(`Insufficient balance. "${fromStr}" has "${fromCurrentBalance}" but needs "${amount}".`);
				}
			}
		} catch (error) {
			const fromStr = this.addressCodec.convertAddressToString(from);
			const toStr = this.addressCodec.convertAddressToString(to);
			throw new Error(`Cannot transfer "${amount}" from "${fromStr}" to "${toStr}". ${error.message}`);
		}

		this.db.set(from, fromCurrentBalance - amount);
		this.db.set(to, toCurrentBalance + amount);
	}
}
