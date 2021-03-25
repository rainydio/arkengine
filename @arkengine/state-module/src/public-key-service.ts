import { ICurrentTransaction } from "@arkengine/blockchain";
import { IPublicKeyService } from "@arkengine/state";
import secp256k1 from "bcrypto/lib/secp256k1";
import { inject, injectable } from "inversify";

@injectable()
export class PublicKeyService implements IPublicKeyService {
	public constructor(
		@inject(ICurrentTransaction)
		private readonly currentTransaction: ICurrentTransaction
	) {}

	public verify(publicKey: Buffer): void {
		if (secp256k1.publicKeyVerify(publicKey) === false) {
			if (this.currentTransaction.isTrusted() === false) {
				throw new Error("Invalid public key.");
			}
		}
	}
}
