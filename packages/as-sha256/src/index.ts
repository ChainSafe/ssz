import {newInstance} from "./wasm";
import {HashObject, byteArrayToHashObject, hashObjectToByteArray} from "./hashObject";
import SHA256 from "./sha256";
import { HashId, getCache, getCacheOffset } from "./hashCache";
export * from "./hashCache";

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

/**
 *
 */
export function digest64HashIds(id1: HashId, id2: HashId, out: HashId): void {
  const {cache: cache1} = getCache(id1);
  let offset1 = getCacheOffset(id1);
  const {cache: cache2} = getCache(id2);
  let offset2 = getCacheOffset(id2);

  // inputUint8Array.set(cache1.subarray(offset1, offset1 + HASH_SIZE));
  // inputUint8Array.set(cache2.subarray(offset2, offset2 + HASH_SIZE), HASH_SIZE);
  // instead of using inputUint8Array.set, we set each byte individually, without a for loop

  inputUint8Array[0] = cache1[offset1++];
  inputUint8Array[1] = cache1[offset1++];
  inputUint8Array[2] = cache1[offset1++];
  inputUint8Array[3] = cache1[offset1++];
  inputUint8Array[4] = cache1[offset1++];
  inputUint8Array[5] = cache1[offset1++];
  inputUint8Array[6] = cache1[offset1++];
  inputUint8Array[7] = cache1[offset1++];
  inputUint8Array[8] = cache1[offset1++];
  inputUint8Array[9] = cache1[offset1++];
  inputUint8Array[10] = cache1[offset1++];
  inputUint8Array[11] = cache1[offset1++];
  inputUint8Array[12] = cache1[offset1++];
  inputUint8Array[13] = cache1[offset1++];
  inputUint8Array[14] = cache1[offset1++];
  inputUint8Array[15] = cache1[offset1++];
  inputUint8Array[16] = cache1[offset1++];
  inputUint8Array[17] = cache1[offset1++];
  inputUint8Array[18] = cache1[offset1++];
  inputUint8Array[19] = cache1[offset1++];
  inputUint8Array[20] = cache1[offset1++];
  inputUint8Array[21] = cache1[offset1++];
  inputUint8Array[22] = cache1[offset1++];
  inputUint8Array[23] = cache1[offset1++];
  inputUint8Array[24] = cache1[offset1++];
  inputUint8Array[25] = cache1[offset1++];
  inputUint8Array[26] = cache1[offset1++];
  inputUint8Array[27] = cache1[offset1++];
  inputUint8Array[28] = cache1[offset1++];
  inputUint8Array[29] = cache1[offset1++];
  inputUint8Array[30] = cache1[offset1++];
  inputUint8Array[31] = cache1[offset1++];
  inputUint8Array[32] = cache2[offset2++];
  inputUint8Array[33] = cache2[offset2++];
  inputUint8Array[34] = cache2[offset2++];
  inputUint8Array[35] = cache2[offset2++];
  inputUint8Array[36] = cache2[offset2++];
  inputUint8Array[37] = cache2[offset2++];
  inputUint8Array[38] = cache2[offset2++];
  inputUint8Array[39] = cache2[offset2++];
  inputUint8Array[40] = cache2[offset2++];
  inputUint8Array[41] = cache2[offset2++];
  inputUint8Array[42] = cache2[offset2++];
  inputUint8Array[43] = cache2[offset2++];
  inputUint8Array[44] = cache2[offset2++];
  inputUint8Array[45] = cache2[offset2++];
  inputUint8Array[46] = cache2[offset2++];
  inputUint8Array[47] = cache2[offset2++];
  inputUint8Array[48] = cache2[offset2++];
  inputUint8Array[49] = cache2[offset2++];
  inputUint8Array[50] = cache2[offset2++];
  inputUint8Array[51] = cache2[offset2++];
  inputUint8Array[52] = cache2[offset2++];
  inputUint8Array[53] = cache2[offset2++];
  inputUint8Array[54] = cache2[offset2++];
  inputUint8Array[55] = cache2[offset2++];
  inputUint8Array[56] = cache2[offset2++];
  inputUint8Array[57] = cache2[offset2++];
  inputUint8Array[58] = cache2[offset2++];
  inputUint8Array[59] = cache2[offset2++];
  inputUint8Array[60] = cache2[offset2++];
  inputUint8Array[61] = cache2[offset2++];
  inputUint8Array[62] = cache2[offset2++];
  inputUint8Array[63] = cache2[offset2++];

  ctx.digest64(wasmInputValue, wasmOutputValue);

  const {cache: outCache} = getCache(out);
  const outOffset = getCacheOffset(out);

  // outputCache.set(outputUint8Array, outputOffset);
  // instead of using outputCache.set, we set each byte individually, without a for loop

  outCache[outOffset] = outputUint8Array[0];
  outCache[outOffset + 1] = outputUint8Array[1];
  outCache[outOffset + 2] = outputUint8Array[2];
  outCache[outOffset + 3] = outputUint8Array[3];
  outCache[outOffset + 4] = outputUint8Array[4];
  outCache[outOffset + 5] = outputUint8Array[5];
  outCache[outOffset + 6] = outputUint8Array[6];
  outCache[outOffset + 7] = outputUint8Array[7];
  outCache[outOffset + 8] = outputUint8Array[8];
  outCache[outOffset + 9] = outputUint8Array[9];
  outCache[outOffset + 10] = outputUint8Array[10];
  outCache[outOffset + 11] = outputUint8Array[11];
  outCache[outOffset + 12] = outputUint8Array[12];
  outCache[outOffset + 13] = outputUint8Array[13];
  outCache[outOffset + 14] = outputUint8Array[14];
  outCache[outOffset + 15] = outputUint8Array[15];
  outCache[outOffset + 16] = outputUint8Array[16];
  outCache[outOffset + 17] = outputUint8Array[17];
  outCache[outOffset + 18] = outputUint8Array[18];
  outCache[outOffset + 19] = outputUint8Array[19];
  outCache[outOffset + 20] = outputUint8Array[20];
  outCache[outOffset + 21] = outputUint8Array[21];
  outCache[outOffset + 22] = outputUint8Array[22];
  outCache[outOffset + 23] = outputUint8Array[23];
  outCache[outOffset + 24] = outputUint8Array[24];
  outCache[outOffset + 25] = outputUint8Array[25];
  outCache[outOffset + 26] = outputUint8Array[26];
  outCache[outOffset + 27] = outputUint8Array[27];
  outCache[outOffset + 28] = outputUint8Array[28];
  outCache[outOffset + 29] = outputUint8Array[29];
  outCache[outOffset + 30] = outputUint8Array[30];
  outCache[outOffset + 31] = outputUint8Array[31];
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
