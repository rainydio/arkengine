import { ILegacyMultiSignatureService } from "@arkengine/state";
import { injectable } from "inversify";

@injectable()
export class LegacyMultiSignatureService implements ILegacyMultiSignatureService {
	public enable(address: Buffer, min: number, lifetime: number, publicKeys: Buffer[]): void {
		throw new Error("Method not implemented.");
	}

	public isEnabled(address: Buffer): boolean {
		return false;
	}

	public getMin(address: Buffer): number {
		throw new Error("Method not implemented.");
	}

	public getLifetime(address: Buffer): number {
		throw new Error("Method not implemented.");
	}

	public getPublicKeys(address: Buffer): Buffer[] {
		throw new Error("Method not implemented.");
	}

	public verify(address: Buffer, hash: Buffer, signatures: Buffer[]): void {
		throw new Error("Method not implemented.");
	}
}
