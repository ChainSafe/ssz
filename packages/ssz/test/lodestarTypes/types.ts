import type {Slot} from "./primitive/types";

export * from "./primitive/types";
export {ts as phase0} from "./phase0";
export {ts as altair} from "./altair";
export {ts as bellatrix} from "./bellatrix";
export {ts as capella} from "./capella";
export {ts as deneb} from "./deneb";

export {ts as allForks} from "./allForks";

/** Common non-spec type to represent roots as strings */
export type RootHex = string;

/** Handy enum to represent the block production source */
export enum ProducedBlockSource {
  builder = "builder",
  engine = "engine",
}

export type SlotRootHex = {slot: Slot; root: RootHex};
export type SlotOptionalRoot = {slot: Slot; root?: RootHex};
