import HMAC from "bcrypto/lib/internal/hmac";

declare module "bcrypto/lib/hash256" {
	export default class Hash256 {
		static native: boolean;
		static id: "HASH256";
		static size: 32;
		static bits: 256;
		static blockSize: 64;
		static zero: Buffer;
		static ctx: Hash256;

		static hash(): Hash256;
		static hmac(): HMAC;
		static digest(data: Buffer): Buffer;
		static root(left: Buffer, right: Buffer): Buffer;
		static multi(x: Buffer, y: Buffer, z: Buffer): Buffer;
		static mac(data: Buffer, key: Buffer): Buffer;

		init(): this;
		update(data: Buffer): this;
		final(): Buffer;
	}
}
