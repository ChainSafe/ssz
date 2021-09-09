import {
  isBooleanType,
  isListType,
  isVectorType,
  isBitListType,
  isBitVectorType,
  isContainerType,
  isByteVectorType,
  isNumberUintType,
  isBigIntUintType,
  Type,
} from "@chainsafe/ssz";
import {forks} from "../../util/types";

function randomNumber(length: number): number {
  return Math.random() * length | 0;
}

function randomNumberUint(byteLength: number): number {
  return randomNumber(byteLength);
}

function randomBigUint(byteLength: number): bigint {
  return BigInt(randomNumber(byteLength));
}

function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

function randomBooleanArray(length: number): Array<boolean> {
  return Array.from({length}, () => randomBoolean());
}

function randomByteVector(length: number): Uint8Array {
  const array = new Uint8Array(length);
  self.crypto.getRandomValues(array);
  return array;
}

// type primitiveType = boolean | number | bigint | Uint8Array | Array<boolean> | object | undefined;

export function createRandomValue(type: Type<unknown>): 
unknown {
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
    return Array.from({length: listLength}, () => createRandomValue(type.elementType));
  }
  else if(isVectorType(type)) {
    return Array.from({length: type.length}, () => createRandomValue(type.elementType));
  }
  else if(isContainerType(type)) {
    const obj: Record<string, unknown> = {};
    Object.entries(type.fields).forEach(([fieldName, fieldType]) => {
      obj[fieldName] = createRandomValue(fieldType);
    });
    return obj;
  }
}

export function getSSZType(sszTypeName: string, forkName: string):
Type<unknown> {
  return forks[forkName][sszTypeName];
}