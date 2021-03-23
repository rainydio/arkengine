import { IWriter, IWriterFactory } from "@arkengine/serde";
import { injectable } from "inversify";

import { Writer } from "./writer";

@injectable()
export class WriterFactory implements IWriterFactory {
	public createWriter(buffer: Buffer): IWriter {
		return new Writer(buffer);
	}
}
