import { IEcdsaService, ISecondSignatureService } from "@arkengine/state";
import { inject, injectable } from "inversify";

const db = new Map<string, Buffer>();

@injectable()
export class SecondSignatureService implements ISecondSignatureService {
	public constructor(
		@inject(IEcdsaService)
		private readonly ecdsaService: IEcdsaService
	) {}

	public isEnabled(address: Buffer): boolean {
		return db.has(address.toString("hex"));
	}

	public getSecondPublicKey(address: Buffer): Buffer {
		const secondPublicKey = db.get(address.toString("hex"));

		if (!secondPublicKey) {
			throw new Error("Second signature is not enabled");
		}

		return secondPublicKey;
	}

	public enable(address: Buffer, secondPublicKey: Buffer): void {
		if (db.has(address.toString("hex"))) {
			throw new Error("Second signature is already enabled");
		}

		db.set(address.toString("hex"), secondPublicKey);
	}

	public verify(address: Buffer, hash: Buffer, signature: Buffer): void {
		this.ecdsaService.verify(this.getSecondPublicKey(address), hash, signature);
	}
}
