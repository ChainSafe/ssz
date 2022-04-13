import {newInstance} from "./wasm";
import {HashObject, byteArrayToHashObject, hashObjectToByteArray} from "./hashObject";
import SHA256 from "./sha256";
export {HashObject, byteArrayToHashObject, hashObjectToByteArray, SHA256};

const ctx = newInstance();
const wasmInputValue = ctx.input.value;
const wasmOutputValue = ctx.output.value;
const inputUint8Array = new Uint8Array(ctx.memory.buffer, wasmInputValue, ctx.INPUT_LENGTH);
const outputUint8Array = new Uint8Array(ctx.memory.buffer, wasmOutputValue, 32);
const inputUint32Array = new Uint32Array(ctx.memory.buffer, wasmInputValue, ctx.INPUT_LENGTH);

export function digest(data: Uint8Array): Uint8Array {
  if (data.length === 64) {
    return digest64(data);
  }

  if (data.length <= ctx.INPUT_LENGTH) {
    inputUint8Array.set(data);
    ctx.digest(data.length);
    const output = new Uint8Array(32);
    output.set(outputUint8Array);
    return output;
  }

  ctx.init();
  update(data);
  return final();
}

export function digest64(data: Uint8Array): Uint8Array {
  if (data.length === 64) {
    inputUint8Array.set(data);
    ctx.digest64(wasmInputValue, wasmOutputValue);
    const output = new Uint8Array(32);
    output.set(outputUint8Array);
    return output;
  }
  throw new Error("InvalidLengthForDigest64");
}

export function digest2Bytes32(bytes1: Uint8Array, bytes2: Uint8Array): Uint8Array {
  if (bytes1.length === 32 && bytes2.length === 32) {
    inputUint8Array.set(bytes1);
    inputUint8Array.set(bytes2, 32);
    ctx.digest64(wasmInputValue, wasmOutputValue);
    const output = new Uint8Array(32);
    output.set(outputUint8Array);
    return output;
  }
  throw new Error("InvalidLengthForDigest64");
}

/**
 * Digest 2 objects, each has 8 properties from h0 to h7.
 * The performance is a little bit better than digest64 due to the use of Uint32Array
 * and the memory is a little bit better than digest64 due to no temporary Uint8Array.
 * @returns
 */
export function digest64HashObjects(obj1: HashObject, obj2: HashObject): HashObject {
  // TODO: expect obj1 and obj2 as HashObject
  inputUint32Array[0] = obj1.h0;
  inputUint32Array[1] = obj1.h1;
  inputUint32Array[2] = obj1.h2;
  inputUint32Array[3] = obj1.h3;
  inputUint32Array[4] = obj1.h4;
  inputUint32Array[5] = obj1.h5;
  inputUint32Array[6] = obj1.h6;
  inputUint32Array[7] = obj1.h7;
  inputUint32Array[8] = obj2.h0;
  inputUint32Array[9] = obj2.h1;
  inputUint32Array[10] = obj2.h2;
  inputUint32Array[11] = obj2.h3;
  inputUint32Array[12] = obj2.h4;
  inputUint32Array[13] = obj2.h5;
  inputUint32Array[14] = obj2.h6;
  inputUint32Array[15] = obj2.h7;

  ctx.digest64(wasmInputValue, wasmOutputValue);

  // extracting numbers from Uint32Array causes more memory
  return byteArrayToHashObject(outputUint8Array);
}

function update(data: Uint8Array): void {
  const INPUT_LENGTH = ctx.INPUT_LENGTH;
  if (data.length > INPUT_LENGTH) {
    for (let i = 0; i < data.length; i += INPUT_LENGTH) {
      const sliced = data.slice(i, i + INPUT_LENGTH);
      inputUint8Array.set(sliced);
      ctx.update(wasmInputValue, sliced.length);
    }
  } else {
    inputUint8Array.set(data);
    ctx.update(wasmInputValue, data.length);
  }
}

function final(): Uint8Array {
  ctx.final(wasmOutputValue);
  const output = new Uint8Array(32);
  output.set(outputUint8Array);
  return output;
}