import { ILegacyWriter, ILegacyWriterFactory } from "@arkengine/serde";
import { injectable } from "inversify";

import { LegacyWriter } from "./legacy-writer";

@injectable()
export class LegacyWriterFactory implements ILegacyWriterFactory {
	public createLegacyWriter(buffer: Buffer): ILegacyWriter {
		return new LegacyWriter(buffer);
	}
}
