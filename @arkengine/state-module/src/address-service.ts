import { IAddressCodec } from "@arkengine/serde";
import { IAddressService } from "@arkengine/state";
import { inject, injectable } from "inversify";

@injectable()
export class AddressService implements IAddressService {
	public constructor(
		@inject(IAddressCodec)
		private readonly addressCodec: IAddressCodec
	) {}

	public convertPublicKeyToAddress(publicKey: Buffer): Buffer {
		return this.addressCodec.convertPublicKeyToAddress(publicKey, 23);
	}

	public verifyAddressNetwork(address: Buffer): void {
		const addressNetwork = this.addressCodec.getAddressNetwork(address);
		const chainNetwork = 23;

		if (addressNetwork !== chainNetwork) {
			throw new Error(`Address is from different "${addressNetwork}" network.`);
		}
	}
}
