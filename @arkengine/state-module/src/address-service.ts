import { ICurrentTransaction } from "@arkengine/blockchain";
import { IAddressCodec } from "@arkengine/serde";
import { IAddressService } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class AddressService implements IAddressService {
	public constructor(
		@inject(ICurrentTransaction)
		private readonly currentTransaction: ICurrentTransaction,

		@inject(IAddressCodec)
		private readonly addressCodec: IAddressCodec
	) {}

	public convertPublicKeyToAddress(publicKey: Buffer): Buffer {
		return this.addressCodec.convertPublicKeyToAddress(publicKey, 23);
	}

	public verifyAddressNetwork(address: Buffer): void {
		const addressNetwork = this.addressCodec.getAddressNetwork(address);
		const blockchainNetwork = 23;

		if (addressNetwork !== blockchainNetwork) {
			if (this.currentTransaction.isTrusted() === false) {
				const addressStr = this.addressCodec.convertAddressToString(address);
				throw new Error(`"${addressStr}" is from different "${addressNetwork}" network.`);
			}
		}
	}
}
