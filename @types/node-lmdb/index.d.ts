declare module "node-lmdb" {
	export type EnvOptions = {
		path?: string;
		mapSize?: number;
		maxDbs?: number;
	};

	export type TxnOptions = {
		readOnly?: boolean;
	};

	export type DbiStat = {
		pageSize: number;
		treeDepth: number;
		treeBranchPageCount: number;
		treeLeafPageCount: number;
		entryCount: number;
		overflowPages: number;
	};

	export type Key<O extends DbiOptions> = O["keyIsBuffer"] extends true
		? Buffer
		: O["keyIsUint32"] extends true
		? number
		: O["keyIsString"] extends string
		? string
		: number | string | Buffer;

	export type Data = boolean | number | string | Buffer;

	export type CursorDupCallback<O extends DbiOptions, D extends Data> = (key: Key<O>, data: D) => void;

	export class Env {
		public constructor();

		public open(options: EnvOptions): void;
		public openDbi<O extends DbiOptions>(options: O): Dbi<O>;
		public beginTxn(options: TxnOptions): Txn;
		public close(): void;
	}

	export type DbiOptions = {
		name: string;
		create?: boolean;
		dupSort?: boolean;
		reverseKey?: boolean;
		reverseDup?: boolean;
		keyIsUint32?: boolean;
		keyIsBuffer?: boolean;
		keyIsString?: boolean;
	};

	export class Dbi<O extends DbiOptions> {
		private options: O;

		public stat(): DbiStat;
	}

	export class Txn {
		public getBoolean<O extends DbiOptions>(dbi: Dbi<O>, key: Key<O>): boolean | null;
		public putBoolean<O extends DbiOptions>(dbi: Dbi<O>, key: Key<O>, data: boolean): void;

		public getString<O extends DbiOptions>(dbi: Dbi<O>, key: Key<O>): string | null;
		public putString<O extends DbiOptions>(dbi: Dbi<O>, key: Key<O>, data: string): void;

		public getNumber<O extends DbiOptions>(dbi: Dbi<O>, key: Key<O>): number | null;
		public putNumber<O extends DbiOptions>(dbi: Dbi<O>, key: Key<O>, data: number): void;

		public getBinary<O extends DbiOptions>(dbi: Dbi<O>, key: Key<O>): Buffer | null;
		public putBinary<O extends DbiOptions>(dbi: Dbi<O>, key: Key<O>, data: Buffer): void;

		public del<O extends DbiOptions>(dbi: Dbi<O>, key: Key<O>, data?: Data): void;

		public commit(): void;
		public abort(): void;
	}

	export class Cursor<O extends DbiOptions> {
		public constructor(txn: Txn, dbi: Dbi<O>);

		public goToFirst(): Key<O> | null;
		public goToLast(): Key<O> | null;
		public goToKey(key: Key<O>): Key<O> | null;
		public goToRange(key: Key<O>): Key<O> | null;
		public goToNext(): Key<O> | null;
		public goToPrev(): Key<O> | null;

		public goToDup(key: Key<O>, data: Data): Key<O> | null;
		public goToDupRange(key: Key<O>, data: Data): Key<O> | null;
		public goToNextDup(): Key<O> | null;
		public goToPrevDup(): Key<O> | null;
		public goToFirstDup(): Key<O> | null;
		public goToLastDup(): Key<O> | null;

		public getCurrentBoolean(cb?: CursorDupCallback<O, boolean>): boolean;
		public getCurrentString(cb?: CursorDupCallback<O, string>): string;
		public getCurrentNumber(cb?: CursorDupCallback<O, number>): number;
		public getCurrentBinary(cb?: CursorDupCallback<O, Buffer>): Buffer;

		public close(): void;
	}
}
