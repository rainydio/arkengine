import { IAddressCodec, ILegacyWriterFactory, IReaderFactory, IWriterFactory } from "@arkengine/serde";
import { interfaces } from "inversify";

import { AddressCodec } from "./address-codec";
import { LegacyWriterFactory } from "./legacy-writer-factory";
import { ReaderFactory } from "./reader-factory";
import { WriterFactory } from "./writer-factory";

const m: interfaces.ContainerModuleCallBack = (bind) => {
	bind<IReaderFactory>(IReaderFactory).to(ReaderFactory);
	bind<IWriterFactory>(IWriterFactory).to(WriterFactory);
	bind<ILegacyWriterFactory>(ILegacyWriterFactory).to(LegacyWriterFactory);
	bind<IAddressCodec>(IAddressCodec).to(AddressCodec);
};

export default m;
