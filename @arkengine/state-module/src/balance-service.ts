import { IBalanceService } from "@arkengine/state";
import { injectable } from "inversify";

@injectable()
export class BalanceService implements IBalanceService {
	public getAvailable(address: Buffer): bigint {
		return 0n;
	}

	public reward(address: Buffer, amount: bigint): void {
		//
	}

	public burn(address: Buffer, amount: bigint): void {
		//
	}

	public transfer(from: Buffer, to: Buffer, amount: bigint): void {
		//
	}
}
