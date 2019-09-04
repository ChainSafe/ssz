import {AnySSZType} from "@chainsafe/ssz";

import {types as rawTypes} from '../types';


function _typeNames(types: any): string[] {
  // const names = [];
  // for (const name in types) {
  //   names.push(name);
  // }
  return Object.keys(rawTypes)
}


function _typeTypes(names: string[]): Record<string, AnySSZType> {
  // const types: Record<string, AnySSZType> = {};
  // for (const name of names) {
  //   types[name] = (rawTypes as Record<string, AnySSZType>)[name];
  // }
  return rawTypes as unknown as Record<string, AnySSZType>;
}

export const names = _typeNames(rawTypes).sort();
export const types = _typeTypes(names);
