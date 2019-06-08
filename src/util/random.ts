import {AnySSZType, FullSSZType, parseType, Type, UintType} from '@chainsafe/ssz';

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
