import {presets} from "../util/types";
import {
  BasicType,
  CompositeType,
  isBooleanType,
  isListType,
  isVectorType,
  isBitListType,
  isBitVectorType,
  isContainerType,
  isByteVectorType,
  isNumberUintType,
  isBigIntUintType,
} from "@chainsafe/ssz";


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

function randomByteVector(length): Uint8Array {
  const array = new Uint8Array(length);
  self.crypto.getRandomValues(array);
  return array;
}

function createRandomValue(type: BasicType<unknown> | CompositeType<object>): 
boolean | number | bigint | Uint8Array | Array<boolean> | object | undefined {
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
    const obj = {};
    Object.entries(type.fields).forEach(([fieldName, fieldType]) => {
      obj[fieldName] = createRandomValue(fieldType);
    });
    return obj;
  }
}

function getSSZType(data: {sszTypeName: string; presetName: string; input: object}): 
BasicType<unknown> | CompositeType<object> {
  return presets[data.presetName][data.sszTypeName];
}

export function createRandomValueWorker(data: {sszTypeName: string; presetName: string; input: object}): 
boolean | number | bigint | Uint8Array | Array<boolean> | object | undefined {
  const sszType = getSSZType(data);
  const value = createRandomValue(sszType);
  return value;
}

export function serialize<T>(data: {sszTypeName: string; presetName: string; input: object}): object {
  const type = getSSZType(data);
  const serialized = type.serialize(data.input);
  const root = type.hashTreeRoot(data.input);
  return {serialized, root};
}
