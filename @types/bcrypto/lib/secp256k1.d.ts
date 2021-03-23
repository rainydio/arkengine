declare module "bcrypto/lib/secp256k1" {
	export default class secp256k1 {
		static publicKeyVerify(key: Buffer): boolean;
		static signatureImport(signature: Buffer): Buffer;
		static verify(msg: Buffer, sig: Buffer, key: Buffer): boolean;
	}
}
