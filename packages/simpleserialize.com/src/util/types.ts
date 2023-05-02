import {Type} from "@chainsafe/ssz";
import {ssz} from "@lodestar/types";

const {
  phase0,
  altair,
  bellatrix,
  capella,
  deneb,
  allForks,
  allForksBlinded,
  allForksBlobs,
  allForksExecution,
  allForksLightClient,
  ...primitive
} = ssz;

export const forks = {
  phase0: {...phase0, ...primitive} as Record<string, Type<unknown>>,
  altair: {...phase0, ...altair, ...primitive} as Record<string, Type<unknown>>,
  bellatrix: {...phase0, ...altair, ...bellatrix, ...primitive} as Record<string, Type<unknown>>,
  capella: {...phase0, ...altair, ...bellatrix, ...capella, ...primitive} as Record<string, Type<unknown>>,
} as Record<string, Record<string, Type<unknown>>>;

export type ForkName = keyof typeof forks;

export function typeNames<T>(types: Record<string, Type<T>>): string[] {
  return Object.keys(types).sort();
}
