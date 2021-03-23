import { IDbTxnContext, IDbUtils } from "@arkengine/db";
import { inject, injectable } from "inversify";
import { Cursor, Dbi, DbiOptions, Key } from "node-lmdb";

@injectable()
export class DbUtils implements IDbUtils {
	public constructor(
		@inject(IDbTxnContext)
		private readonly dbTxnContext: IDbTxnContext
	) {}

	public *keys<O extends DbiOptions>(dbi: Dbi<O>, options?: { from?: Key<O>; reverse?: boolean }): Iterable<Key<O>> {
		const cursor = new Cursor(this.dbTxnContext.getTxn(), dbi);

		try {
			let key: Key<O> | null;

			if (options?.from) {
				key = cursor.goToRange(options.from);

				if (options.reverse) {
					if (key) {
						if (typeof options.from === typeof key && key !== options.from) {
							key = cursor.goToPrev();
						}

						if (options.from instanceof Buffer && key instanceof Buffer && !key.equals(options.from)) {
							key = cursor.goToPrev();
						}
					} else {
						key = cursor.goToLast();
					}
				}
			} else {
				if (options?.reverse) {
					key = cursor.goToLast();
				} else {
					key = cursor.goToFirst();
				}
			}

			while (key) {
				yield key;

				if (options?.reverse) {
					key = cursor.goToPrev();
				} else {
					key = cursor.goToNext();
				}
			}
		} finally {
			cursor.close();
		}
	}

	public *dups<O extends DbiOptions & { dupSort: true }>(
		dbi: Dbi<O>,
		key: Key<O>,
		options?: { from?: Buffer; reverse?: boolean }
	): Iterable<Buffer> {
		const cursor = new Cursor(this.dbTxnContext.getTxn(), dbi);

		try {
			if (options?.from) {
				if (!cursor.goToDupRange(key, options.from)) {
					if (!options.reverse || !cursor.goToKey(key)) {
						return;
					}

					cursor.goToLastDup();
				} else {
					if (options.reverse && !cursor.getCurrentBinary().equals(options.from)) {
						cursor.goToPrevDup();
					}
				}
			} else {
				if (!cursor.goToKey(key)) {
					return;
				}

				if (options?.reverse) {
					cursor.goToLastDup();
				}
			}

			do {
				yield cursor.getCurrentBinary();
			} while (options?.reverse ? cursor.goToPrevDup() : cursor.goToNextDup());
		} finally {
			cursor.close();
		}
	}
}
