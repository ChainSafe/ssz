import {Slot} from "./primitive/types.ts";

export * from "./primitive/types.ts";
export {ts as phase0} from "./phase0/index.ts";
export {ts as altair} from "./altair/index.ts";
export {ts as bellatrix} from "./bellatrix/index.ts";
export {ts as capella} from "./capella/index.ts";
export {ts as deneb} from "./deneb/index.ts";

export {ts as allForks} from "./allForks/index.ts";

/** Common non-spec type to represent roots as strings */
export type RootHex = string;

/** Handy enum to represent the block production source */
export enum ProducedBlockSource {
  builder = "builder",
  engine = "engine",
}

export type SlotRootHex = {slot: Slot; root: RootHex};
export type SlotOptionalRoot = {slot: Slot; root?: RootHex};
