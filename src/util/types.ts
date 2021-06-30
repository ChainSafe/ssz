import {Type} from "@chainsafe/ssz";
import * as mainnetTypes from "@chainsafe/lodestar-config/lib/chainConfig/presets/mainnet";
import * as minimalTypes from "@chainsafe/lodestar-config/lib/chainConfig/presets/minimal";
import { allForks, phase0, altair } from "@chainsafe/lodestar-types/lib/sszTypes";
// import {allForks, phase0, altair} from "@chainsafe/lodestar-types";

// export const presets = {
//   mainnet: mainnetTypes as unknown as Record<string, Type<any>>,
//   minimal: minimalTypes as unknown as Record<string, Type<any>>,
// } as const;

// export type PresetName = keyof typeof presets;

// export function typeNames<T>(types: Record<string, Type<T>>): string[] {
//   return Object.keys(types).sort();
// }

export const forks = {
  // allForks: allForks as unknown as Record<string, Type<any>>,
  phase0: phase0 as Record<string, Type<any>>,
  altair: altair as Record<string, Type<any>>,
}

export type ForkName = keyof typeof forks;

export function typeNames<T>(types: Record<string, Type<T>>): string[] {
  return Object.keys(types).sort();
}