import { IReader, IReaderFactory } from "@arkengine/serde";
import { injectable } from "inversify";

import { Reader } from "./reader";

@injectable()
export class ReaderFactory implements IReaderFactory {
	public createReader(buffer: Buffer): IReader {
		return new Reader(buffer);
	}
}
