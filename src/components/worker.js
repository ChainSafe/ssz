import {presets} from "../util/types";
import {BasicType, CompositeType, isBooleanType, isListType, isVectorType, isBitListType, isBitVectorType, isContainerType, isByteVectorType, isNumberUintType, isBigIntUintType} from '@chainsafe/ssz';

function randomNumber(length) {
  return Math.random() * length | 0;
}

function randomNumberUint(byteLength) {
  return randomNumber(byteLength);
}

function randomBigUint(byteLength) {
  return BigInt(randomNumber(byteLength));
}

function randomBoolean() {
  return Math.random() > 0.5;
}

function randomBooleanArray(length) {
  return Array.from({ length }, () => randomBoolean());
}

function randomByteVector(length) {
  var array = new Uint8Array(length);
  self.crypto.getRandomValues(array);
  return array;
}

function createRandomValue(type) {
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
      const obj = {};
      Object.entries(type.fields).forEach(([fieldName, fieldType]) => {
        obj[fieldName] = createRandomValue(fieldType);
      });
      return obj;
    }
  }
   catch(e) {
    console.error(e.message, e.name);
    return;
  }
}

function getSSZType(data) {
  return presets[data.presetName][data.sszTypeName];
}

export function createRandomValueWorker(data) {
  const sszType = getSSZType(data);
  const value = createRandomValue(sszType);
  return value;
}

export function serialize(data) {
  const type = getSSZType(data);
  const serialized = type.serialize(data.input);
  const root = type.hashTreeRoot(data.input);
  return {serialized, root};
}
