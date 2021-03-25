export interface ILastBlockDb {
	hasId(): boolean;
	getId(): Buffer;
	setId(id: Buffer): void;

	getHeight(): number;
	setHeight(height: number): void;
}

export interface IBalanceDb {
	get(address: Buffer): bigint;
	set(address: Buffer, balance: bigint): void;
}

export interface IAddressService {
	convertPublicKeyToAddress(publicKey: Buffer): Buffer;
	verifyAddressNetwork(address: Buffer): void;
}

export interface IBalanceService {
	get(address: Buffer): bigint;
	reward(address: Buffer, amount: bigint): void;
	burn(address: Buffer, amount: bigint): void;
	transfer(from: Buffer, to: Buffer, amount: bigint): void;
}

export interface ILastBlockService {
	getId(): Buffer;
	getHeight(): number;
	setNext(blockId: Buffer): void;
}

export interface IPublicKeyService {
	verify(publicKey: Buffer): void;
}

export interface IEcdsaService {
	verify(publicKey: Buffer, hash: Buffer, signature: Buffer): void;
}

export const IBalanceDb = Symbol(`IBalanceDb@${__filename}`);
export const ILastBlockDb = Symbol(`ILastBlockDb@${__filename}`);

export const IAddressService = Symbol(`IAddressService@${__filename}`);
export const IBalanceService = Symbol(`IBalanceService@${__filename}`);
export const ILastBlockService = Symbol(`ILastBlockService@${__filename}`);

export const IPublicKeyService = Symbol(`IPublicKeyService@${__filename}`);
export const IEcdsaService = Symbol(`IEcdsaService@${__filename}`);
