import yaml from 'js-yaml';
import decamelize from 'decamelize';
import {AnySSZType, FullSSZType, parseType, Type, UintType} from '@chainsafe/ssz';

import * as ETH_SCHEMA from './schema';

export function dumpYaml(input: any): string {
  return yaml.dump(input);
}

export function parseYaml(input: string, type: AnySSZType): any {
  const _type = parseType(type);
  const loaded = yaml.load(input, {schema: ETH_SCHEMA});
  return expandInput(loaded, _type);
}
export function expandInput(input: any, type: FullSSZType): any {
  switch (type.type) {
    case Type.uint:
    case Type.bool:
      return input;
    case Type.byteList:
    case Type.byteVector:
      if (input.slice(0, 2) === '0x') {
        return Buffer.from(input.slice(2), 'hex');
      } else {
        return Buffer.from(input, 'hex');
      }
    case Type.list:
    case Type.vector:
      return input.map((i: any) => expandInput(i, type.elementType));
    case Type.container:
      const output: any = {};
      type.fields.forEach(([fieldName, fieldType]) => {
        output[fieldName] = expandInput(input[fieldName] || input[decamelize(fieldName)], fieldType);
      })
      return output;
  }
}
