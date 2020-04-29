import {BasicType, CompositeType, isBooleanType, isListType, isVectorType, isBitListType, isBitVectorType, isContainerType, isByteVectorType, isNumberUintType, isBigIntUintType} from '@chainsafe/ssz';

function randomNumber(length: number): number {
  return Math.random() * length | 0;
}

function randomNumberUint(byteLength: number): number {
  return randomNumber(byteLength);
}

function randomBigUint(byteLength: number): BigInt {
  return BigInt(randomNumber(byteLength));
}

function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

function randomBooleanArray(length: number): Array<boolean> {
  return Array.from({ length }, () => randomBoolean());
}

function randomByteVector(length: number): Uint8Array {
  var array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

export function createRandomValue(type: BasicType<unknown> | CompositeType<object>): any {
  try {
    if(isNumberUintType(type)) {
      return randomNumberUint(type.byteLength);
    }
    else if(isBigIntUintType(type)) {
      return randomBigUint(type.byteLength);
    }
    else if(isBooleanType(type)) {
      return randomBoolean();
    }
    else if(isBitVectorType(type)) {
      return randomBooleanArray(type.length);
    }
    else if(isByteVectorType(type)) {
      return randomByteVector(type.length);
    }
    else if(isBitListType(type)) {
      const listLength = Math.min(Math.floor(Math.random() * 16), type.limit);
      return randomBooleanArray(listLength);
    }
    else if(isListType(type)) {
      const listLength = Math.min(Math.floor(Math.random() * 16), type.limit);
        return Array.from({ length: listLength }, () => createRandomValue(type.elementType));
    }
    else if(isVectorType(type)) {
      return Array.from({ length: type.length }, () => createRandomValue(type.elementType));
    }
    else if(isContainerType(type)) {
      const obj: any = {};
      Object.entries(type.fields).forEach(([fieldName, fieldType]) => {
        obj[fieldName] = createRandomValue(fieldType);
      });
      return obj;
    }
  } catch(e) {
    console.error(e.message, e.name);
    return;
  }
}
