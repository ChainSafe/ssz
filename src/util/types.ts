import {AnySSZType} from "@chainsafe/ssz";

import {types as rawTypes} from '../types';

export const names = Object.keys(rawTypes).sort();
export const types = rawTypes as unknown as Record<string, AnySSZType>;
