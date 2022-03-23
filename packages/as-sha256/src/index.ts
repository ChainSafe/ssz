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
const inputDataView = new DataView(ctx.memory.buffer, wasmInputValue, ctx.INPUT_LENGTH);
// extracting numbers from Uint32Array causes more memory
// uint32OutputArray = new Uint32Array(ctx.memory.buffer, wasmOutputValue, 32);

const NUMBER_2_POW_32 = 2 ** 32;

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

enum HashInputType {
  HashObject,
  Uint8Array,
  Uint64,
}

type HashInput =
  | {type: HashInputType.HashObject; hashObject: HashObject}
  | {type: HashInputType.Uint8Array; uint8Array: Uint8Array}
  | {type: HashInputType.Uint64; uint64: number};

enum HashOutputType {
  HashObject,
  Uint8Array,
}

function setHashInput(input: HashInput, offset32: number): void {
  switch (input.type) {
    case HashInputType.HashObject: {
      const offset4 = offset32 * 8;
      const {hashObject} = input;
      inputUint32Array[offset4 + 0] = hashObject.h0;
      inputUint32Array[offset4 + 1] = hashObject.h1;
      inputUint32Array[offset4 + 2] = hashObject.h2;
      inputUint32Array[offset4 + 3] = hashObject.h3;
      inputUint32Array[offset4 + 4] = hashObject.h4;
      inputUint32Array[offset4 + 5] = hashObject.h5;
      inputUint32Array[offset4 + 6] = hashObject.h6;
      inputUint32Array[offset4 + 7] = hashObject.h7;
      break;
    }

    case HashInputType.Uint8Array: {
      inputUint8Array.set(input.uint8Array, offset32 * 32);
      break;
    }

    case HashInputType.Uint64: {
      const offset4 = offset32 * 8;
      const offset1 = offset32 * 32;
      inputDataView.setUint32(offset1, input.uint64 & 0xffffffff, true);
      inputDataView.setUint32(offset1 + 4, (input.uint64 / NUMBER_2_POW_32) & 0xffffffff, true);
      inputUint32Array[offset4 + 2] = 0;
      inputUint32Array[offset4 + 3] = 0;
      inputUint32Array[offset4 + 4] = 0;
      inputUint32Array[offset4 + 5] = 0;
      inputUint32Array[offset4 + 6] = 0;
      inputUint32Array[offset4 + 7] = 0;
    }
  }
}

export function digest64TypedData(
  input1: HashInput,
  input2: HashInput,
  outputType: HashOutputType.HashObject
): HashObject;

export function digest64TypedData(
  input1: HashInput,
  input2: HashInput,
  outputType: HashOutputType.Uint8Array
): Uint8Array;

/**
 * Digest 2 objects, each has 8 properties from h0 to h7.
 * The performance is a little bit better than digest64 due to the use of Uint32Array
 * and the memory is a little bit better than digest64 due to no temporary Uint8Array.
 * @returns
 */
export function digest64TypedData(
  input1: HashInput,
  input2: HashInput,
  outputType: HashOutputType
): HashObject | Uint8Array {
  setHashInput(input1, 0);
  setHashInput(input2, 1);

  ctx.digest64(wasmInputValue, wasmOutputValue);

  switch (outputType) {
    case HashOutputType.HashObject:
      // extracting numbers from Uint32Array causes more memory
      return byteArrayToHashObject(outputUint8Array);

    case HashOutputType.Uint8Array:
      // TODO: Benchmark fastest way to copy bytes
      return outputUint8Array.slice(0, 32);
  }
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
