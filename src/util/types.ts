import {AnySSZType} from "@chainsafe/ssz";
import deepEqual from "deep-equal";

import {types as rawTypes} from '../types';

export const names = Object.keys(rawTypes).sort();
export const types = rawTypes as unknown as Record<string, AnySSZType>;

export function typeName(type: AnySSZType, types: Record<string, AnySSZType>): string {
  for (const [name, typ] of Object.entries(types)) {
    if (deepEqual(type, typ)) {
      return name;
    }
  }
  return "unknown";
}
