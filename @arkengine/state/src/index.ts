export interface IBlockService {
	getId(): Buffer;
	getHeight(): number;
	getTotalAmount(): bigint;
	getTotalFee(): bigint;
	startNewBlock(id: Buffer): void;
	increaseTotalAmount(amount: bigint): void;
	increaseTotalFee(fee: bigint): void;
}

export interface IAddressService {
	convertPublicKeyToAddress(publicKey: Buffer): Buffer;
	verifyAddressNetwork(address: Buffer): void;
}

export interface IEcdsaService {
	verify(publicKey: Buffer, hash: Buffer, signature: Buffer): void;
}

export interface ISecondSignatureService {
	enable(address: Buffer, secondPublicKey: Buffer): void;
	isEnabled(address: Buffer): boolean;
	getSecondPublicKey(address: Buffer): Buffer;
	verify(address: Buffer, hash: Buffer, signature: Buffer): void;
}

export interface ILegacyMultiSignatureService {
	enable(address: Buffer, min: number, lifetime: number, publicKeys: Buffer[]): void;
	isEnabled(address: Buffer): boolean;
	getMin(address: Buffer): number;
	getLifetime(address: Buffer): number;
	getPublicKeys(address: Buffer): Buffer[];
	verify(address: Buffer, hash: Buffer, signatures: Buffer[]): void;
}

export interface IBalanceService {
	getAvailable(address: Buffer): bigint;
	reward(address: Buffer, amount: bigint): void;
	burn(address: Buffer, amount: bigint): void;
	transfer(from: Buffer, to: Buffer, amount: bigint): void;
}

export const IBlockService = Symbol(`IBlockService@${__filename}`);
export const IAddressService = Symbol(`IAddressService@${__filename}`);
export const IEcdsaService = Symbol(`IEcdsaService@${__filename}`);
export const ISecondSignatureService = Symbol(`ISecondSignatureService@${__filename}`);
export const ILegacyMultiSignatureService = Symbol(`ILegacyMultiSignatureService@${__filename}`);
export const IBalanceService = Symbol(`IBalanceService@${__filename}`);
