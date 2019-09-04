import {AnySSZType, FullSSZType, parseType, Type, UintType} from '@chainsafe/ssz';
import {expandInput} from "./translate";
import BN from "bn.js";

function randomUint(type: UintType): BN {
  const byteLength = type.useNumber? Math.min(type.byteLength, 6) : type.byteLength;
  let out = new BN(Math.floor(Math.random() * 8));
  for (let i = 1; i < byteLength; i++) {
    out.iushln(8);
    out.iaddn(Math.floor(Math.random() * 8));
  }
  return out;
}

function randomBool(): boolean {
  return Math.random() > 0.5;
}

function randomNibble(): string {
  return Math.floor(Math.random() * 16).toString(16);
}

function randomBytes(length: number): string {
  return '0x' + Array.from({length: length * 2}, () => randomNibble()).join('');
}

export function createRandomValue(type: AnySSZType): any {
  const fullType = parseType(type);
  const randomValue = _createRandomValue(fullType);
  return expandInput(randomValue, fullType, false);
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
    case Type.bitVector:
      return randomBytes(Math.floor((type.length - 1)/8)) + "00";
    case Type.bitList:
      const bitListLength = Math.max(Math.floor(Math.random() * 16), 1);
      return randomBytes(Math.floor((bitListLength+7)/8)) + "01";
    case Type.list:
      const listLength = Math.min(Math.floor(Math.random() * 16), type.maxLength);
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
