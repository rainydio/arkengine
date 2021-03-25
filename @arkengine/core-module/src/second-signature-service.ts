import { ISecondPublicKeyDb, ISecondSignatureService } from "@arkengine/core";
import { IEcdsaService, IPublicKeyService } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class SecondSignatureService implements ISecondSignatureService {
	public constructor(
		@inject(ISecondPublicKeyDb)
		private readonly db: ISecondPublicKeyDb,

		@inject(IPublicKeyService)
		private readonly publicKeyService: IPublicKeyService,

		@inject(IEcdsaService)
		private readonly ecdsaService: IEcdsaService
	) {}

	public enable(address: Buffer, secondPublicKey: Buffer): void {
		if (this.isEnabled(address)) {
			throw new Error("Second signature is already enabled.");
		}

		this.publicKeyService.verify(secondPublicKey);
		this.db.set(address, secondPublicKey);
	}

	public isEnabled(address: Buffer): boolean {
		return this.db.has(address);
	}

	public getSecondPublicKey(address: Buffer): Buffer {
		if (this.db.has(address) === false) {
			throw new Error("Second signature is not enabled.");
		}

		return this.db.get(address);
	}

	public verify(address: Buffer, hash: Buffer, signature: Buffer): void {
		this.ecdsaService.verify(this.getSecondPublicKey(address), hash, signature);
	}
}
