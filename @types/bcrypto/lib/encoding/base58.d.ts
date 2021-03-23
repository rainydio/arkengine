declare module "bcrypto/lib/encoding/base58" {
	export default class base58 {
		static encode(data: Buffer): string;
		static decode(str: string): Buffer;
		static test(str: string): boolean;
	}
}
