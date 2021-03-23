declare module "bcrypto/lib" {
	export * as encoding from "bcrypto/lib/encoding";
	export { default as SHA256 } from "bcrypto/lib/sha256";
	export { default as Hash256 } from "bcrypto/lib/hash256";
	export { default as secp256k1 } from "bcrypto/lib/secp256k1";
	export { default as RIPEMD160 } from "bcrypto/lib/ripemd160";
}
