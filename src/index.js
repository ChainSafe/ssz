import {newInstance} from './wasm';

export default class SHA256 {
  constructor() {
    this.ctx = newInstance();
    this.wasmInputValue = this.ctx.input.value;
    this.wasmOutputValue = this.ctx.output.value;
    this.uint8InputArray = new Uint8Array(this.ctx.memory.buffer, this.wasmInputValue, this.ctx.INPUT_LENGTH);
    this.uint8OutputArray = new Uint8Array(this.ctx.memory.buffer, this.wasmOutputValue, 32);
    this.uint32InputArray = new Uint32Array(this.ctx.memory.buffer, this.wasmInputValue, this.ctx.INPUT_LENGTH);
    this.uint32OutputArray = new Uint32Array(this.ctx.memory.buffer, this.wasmOutputValue, 32);
  }
  init() {
    this.ctx.init();
    return this;
  }
  update(data) {
    const INPUT_LENGTH = this.ctx.INPUT_LENGTH;
    if (data.length > INPUT_LENGTH) {
      for (let i = 0; i < data.length; i += INPUT_LENGTH) {
        const sliced = data.slice(i, i + INPUT_LENGTH);
        this.uint8InputArray.set(sliced);
        this.ctx.update(this.wasmInputValue, sliced.length);
      }
    } else {
      this.uint8InputArray.set(data);
      this.ctx.update(this.wasmInputValue, data.length);
    }
    return this;
  }
  final() {
    this.ctx.final(this.wasmOutputValue);
    const output = new Uint8Array(32);
    output.set(this.uint8OutputArray);
    return output;
  }

  static digest(data) {
    if (data.length <= staticInstance.ctx.INPUT_LENGTH) {
      const input = new Uint8Array(staticInstance.ctx.memory.buffer, staticInstance.ctx.input.value, staticInstance.ctx.INPUT_LENGTH);
      input.set(data);
      staticInstance.ctx.digest(data.length);
      const output = new Uint8Array(32);
      output.set(new Uint8Array(staticInstance.ctx.memory.buffer, staticInstance.ctx.output.value, 32));
      return output;
    }
    return staticInstance.init().update(data).final();
  }

  static digest64(data) {
    if (data.length==64) {
      staticInstance.uint8InputArray.set(data);
      staticInstance.ctx.digest64(staticInstance.wasmInputValue, staticInstance.wasmOutputValue);
      const output = new Uint8Array(32);
      output.set(staticInstance.uint8OutputArray);
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
  static digestTwoHashObjects(obj1, obj2) {
    // TODO: expect obj1 and obj2 as HashObject
    staticInstance.uint32InputArray[0] = obj1.h0;
    staticInstance.uint32InputArray[1] = obj1.h1;
    staticInstance.uint32InputArray[2] = obj1.h2;
    staticInstance.uint32InputArray[3] = obj1.h3;
    staticInstance.uint32InputArray[4] = obj1.h4;
    staticInstance.uint32InputArray[5] = obj1.h5;
    staticInstance.uint32InputArray[6] = obj1.h6;
    staticInstance.uint32InputArray[7] = obj1.h7;
    staticInstance.uint32InputArray[8] = obj2.h0;
    staticInstance.uint32InputArray[9] = obj2.h1;
    staticInstance.uint32InputArray[10] = obj2.h2;
    staticInstance.uint32InputArray[11] = obj2.h3;
    staticInstance.uint32InputArray[12] = obj2.h4;
    staticInstance.uint32InputArray[13] = obj2.h5;
    staticInstance.uint32InputArray[14] = obj2.h6;
    staticInstance.uint32InputArray[15] = obj2.h7;

    staticInstance.ctx.digest64(staticInstance.wasmInputValue, staticInstance.wasmOutputValue);

    return {
      h0: staticInstance.uint32OutputArray[0],
      h1: staticInstance.uint32OutputArray[1],
      h2: staticInstance.uint32OutputArray[2],
      h3: staticInstance.uint32OutputArray[3],
      h4: staticInstance.uint32OutputArray[4],
      h5: staticInstance.uint32OutputArray[5],
      h6: staticInstance.uint32OutputArray[6],
      h7: staticInstance.uint32OutputArray[7],
    };
  }
}

const staticInstance = new SHA256();

/**
 * Pass 8 numbers in an object and set that to inputArray.
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 **/
 export function hashObjectToByteArray(obj, byteArr, offset) {
  let tmp = obj.h0;
  byteArr[0 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[1 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[2 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[3 + offset] = tmp & 0xff;

  tmp = obj.h1;
  byteArr[4 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[5 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[6 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[7 + offset] = tmp & 0xff;

  tmp = obj.h2;
  byteArr[8 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[9 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[10 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[11 + offset] = tmp & 0xff;

  tmp = obj.h3;
  byteArr[12 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[13 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[14 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[15 + offset] = tmp & 0xff;

  tmp = obj.h4;
  byteArr[16 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[17 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[18 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[19 + offset] = tmp & 0xff;

  tmp = obj.h5;
  byteArr[20 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[21 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[22 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[23 + offset] = tmp & 0xff;

  tmp = obj.h6;
  byteArr[24 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[25 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[26 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[27 + offset] = tmp & 0xff;

  tmp = obj.h7;
  byteArr[28 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[29 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[30 + offset] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[31 + offset] = tmp & 0xff;
}

/**
 * Parse outputArray into an object of 8 numbers.
 * This is the order that makes Uint32Array the same to Uint8Array
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 **/
export function byteArrayToHashObject(byteArr) {
  let tmp = 0;
  tmp |= byteArr[3] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[2] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[1] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[0] & 0xff;
  const h0 = tmp;

  tmp = 0;
  tmp |= byteArr[7] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[6] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[5] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[4] & 0xff;
  const h1 = tmp;

  tmp = 0;
  tmp |= byteArr[11] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[10] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[9] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[8] & 0xff;
  const h2 = tmp;

  tmp = 0;
  tmp |= byteArr[15] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[14] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[13] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[12] & 0xff;
  const h3 = tmp;

  tmp = 0;
  tmp |= byteArr[19] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[18] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[17] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[16] & 0xff;
  const h4 = tmp;

  tmp = 0;
  tmp |= byteArr[23] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[22] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[21] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[20] & 0xff;
  const h5 = tmp;

  tmp = 0;
  tmp |= byteArr[27] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[26] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[25] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[24] & 0xff;
  const h6 = tmp;

  tmp = 0;
  tmp |= byteArr[31] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[30] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[29] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[28] & 0xff;
  const h7 = tmp;

  return {
    h0,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h7,
  };
}
