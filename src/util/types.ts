import deepEqual from "deep-equal";
import {Type} from "@chainsafe/ssz";
import {types as mainnetTypes} from "@chainsafe/lodestar-types/lib/ssz/presets/mainnet";
import {types as minimalTypes} from "@chainsafe/lodestar-types/lib/ssz/presets/minimal";

export const presets = {
  mainnet: mainnetTypes as unknown as Record<string, Type<any>>,
  minimal: minimalTypes as unknown as Record<string, Type<any>>,
} as const;

export type PresetName = keyof typeof presets;

export function typeNames(types: Record<string, Type<any>>): string[] {
  return Object.keys(types).sort();
}

export function typeName(type: Type<any>, types: Record<string, Type<any>>): string {
  for (const [name, typ] of Object.entries(types)) {
    if (deepEqual(type, typ)) {
      return name;
    }
  }
  return "unknown";
}
