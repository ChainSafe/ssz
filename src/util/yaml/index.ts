import yaml from 'js-yaml';
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
        output[fieldName] = expandInput(input[fieldName], fieldType);
      })
      return output;
  }
}

// random

function randomUint(type: UintType): number {
  const byteLength = Math.min(type.byteLength, 5);
  let out = 0;
  for (let i = 0; i < byteLength; i++) {
    out += Math.floor(Math.random() * 8);
    out = out << 1;
  }
  return out;
}

function randomBool(): boolean {
  if (Math.random() > 0.5) {
    return true;
  } else {
    return false;
  }
}

function randomNibble(): string {
  return Math.floor(Math.random() * 16).toString(16);
}

function randomBytes(length: number): string {
  return '0x' + Array.from({length: length * 2}, () => randomNibble()).join('');
}

export function createRandomValue(type: AnySSZType): any {
  return _createRandomValue(parseType(type));
}

function _createRandomValue(type: FullSSZType): any {
  switch (type.type) {
    case Type.uint:
      return randomUint(type);
    case Type.bool:
      return randomBool();
    case Type.byteList:
      const byteListLength = Math.floor(Math.random() * 16);
      return randomBytes(byteListLength);
    case Type.byteVector:
      return randomBytes(type.length);
    case Type.list:
      const listLength = Math.floor(Math.random() * 16);
      return Array.from({length: listLength}, () => _createRandomValue(type.elementType));
    case Type.vector:
      return Array.from({length: type.length}, () => _createRandomValue(type.elementType));
    case Type.container:
      const obj: any = {};
      type.fields.forEach(([fieldName, fieldType]) => {
        obj[fieldName] = _createRandomValue(fieldType);
      });
      return obj;
  }
}
