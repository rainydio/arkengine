import HMAC from "bcrypto/lib/internal/hmac";

declare module "bcrypto/lib/ripemd160" {
	export default class RIPEMD160 {
		static native: boolean;
		static id: "RIPEMD160";
		static size: 20;
		static bits: 160;
		static blockSize: 64;
		static zero: Buffer;
		static ctx: RIPEMD160;

		static hash(): RIPEMD160;
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
