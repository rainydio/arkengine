import { IAddressCodec } from "@arkengine/serde";
import assert from "assert";
import base58 from "bcrypto/lib/encoding/base58";
import Hash256 from "bcrypto/lib/hash256";
import RIPEMD160 from "bcrypto/lib/ripemd160";
import { injectable } from "inversify";

@injectable()
export class AddressCodec implements IAddressCodec {
	public getAddressNetwork(address: Buffer): number {
		return address.readUInt8(0);
	}

	public convertAddressToString(address: Buffer): string {
		const checksum = Hash256.digest(address);
		const string = base58.encode(Buffer.concat([address, checksum.slice(0, 4)]));

		return string;
	}

	public convertStringToAddress(string: string): Buffer {
		const bytes = base58.decode(string);
		assert(bytes.length === 21 + 4);

		const address = bytes.slice(0, 21);
		const checksum = Hash256.digest(address);
		assert(checksum.equals(bytes.slice(-4)));

		return address;
	}

	public convertPublicKeyToAddress(publicKey: Buffer, network: number): Buffer {
		const address = Buffer.alloc(21);
		address.writeUInt8(network, 0);
		RIPEMD160.digest(publicKey).copy(address, 1);

		return address;
	}
}
