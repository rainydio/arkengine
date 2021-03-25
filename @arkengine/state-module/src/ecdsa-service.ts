import { ICurrentTransaction } from "@arkengine/blockchain";
import { IEcdsaService } from "@arkengine/state";
import secp256k1 from "bcrypto/lib/secp256k1";
import { inject, injectable } from "inversify";

@injectable()
export class EcdsaService implements IEcdsaService {
	public constructor(
		@inject(ICurrentTransaction)
		private readonly currentTransaction: ICurrentTransaction
	) {}

	public verify(publicKey: Buffer, hash: Buffer, signature: Buffer): void {
		try {
			signature = secp256k1.signatureImport(signature);
		} catch (error) {
			if (this.currentTransaction.isTrusted() === false) {
				throw new Error("Failed to import ECDSA signature.");
			}
		}

		if (!secp256k1.verify(hash, signature, publicKey)) {
			if (this.currentTransaction.isTrusted() === false) {
				throw new Error("Invalid ECDSA signature.");
			}
		}
	}
}
