import deepEqual from "deep-equal";
import {AnySSZType} from "@chainsafe/ssz";
import {types as mainnetTypes} from "@chainsafe/eth2.0-types/lib/ssz/presets/mainnet";
import {types as minimalTypes} from "@chainsafe/eth2.0-types/lib/ssz/presets/minimal";

export const presets = {
  mainnet: mainnetTypes as unknown as Record<string, AnySSZType>,
  minimal: minimalTypes as unknown as Record<string, AnySSZType>,
} as const;

export type PresetName = keyof typeof presets;

export function typeNames(types: Record<string, AnySSZType>): string[] {
  return Object.keys(types).sort();
}

export function typeName(type: AnySSZType, types: Record<string, AnySSZType>): string {
  for (const [name, typ] of Object.entries(types)) {
    if (deepEqual(type, typ)) {
      return name;
    }
  }
  return "unknown";
}
