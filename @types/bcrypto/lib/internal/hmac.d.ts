declare module "bcrypto/lib/internal/hmac" {
	export default class HMAC {
		init(key: Buffer): this;
		update(data: Buffer): this;
		final(): Buffer;
	}
}
