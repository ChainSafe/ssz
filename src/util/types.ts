import {Type} from "@chainsafe/ssz";
import * as sszTypes from "@chainsafe/lodestar-types/lib/sszTypes";

const {phase0, altair, allForks, ...primitive} = sszTypes;

export const forks = {
  phase0: {...phase0, ...primitive} as Record<string, Type<unknown>>,
  altair: {...altair, ...primitive} as Record<string, Type<unknown>>,
}

export type ForkName = keyof typeof forks;

export function typeNames<T>(types: Record<string, Type<T>>): string[] {
  return Object.keys(types).sort();
}