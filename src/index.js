import {newInstance} from './wasm';

export default class SHA256 {
  constructor() {
    this.ctx = newInstance();
    this.wasmInputValue = this.ctx.input.value;
    this.wasmOutputValue = this.ctx.output.value;
    this.inputArray = new Uint8Array(this.ctx.memory.buffer, this.wasmInputValue, this.ctx.INPUT_LENGTH);
    this.outputArray = new Uint8Array(this.ctx.memory.buffer, this.wasmOutputValue, 32);
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
        this.inputArray.set(sliced);
        this.ctx.update(this.wasmInputValue, sliced.length);
      }
    } else {
      this.inputArray.set(data);
      this.ctx.update(this.wasmInputValue, data.length);
    }
    return this;
  }
  final() {
    this.ctx.final(this.wasmOutputValue);
    const output = new Uint8Array(32);
    output.set(this.outputArray);
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
      staticInstance.inputArray.set(data);
      staticInstance.ctx.digest64(staticInstance.wasmInputValue, staticInstance.wasmOutputValue);
      const output = new Uint8Array(32);
      output.set(staticInstance.outputArray);
      return output;
    }
    throw new Error("InvalidLengthForDigest64");
  }

  /**
   * Digest 2 objects, each has 8 properties from h0 to h7.
   * This has same performance to digest64 above.
   * @returns
   */
  static digestObjects(obj1, obj2) {
    // TODO: expect obj1 and obj2 as Objects
    objToByteArr(obj1, staticInstance.inputArray, 0);
    objToByteArr(obj2, staticInstance.inputArray, 32);
    staticInstance.ctx.digest64(staticInstance.wasmInputValue, staticInstance.wasmOutputValue);
    return byteArrToObj(staticInstance.outputArray)
  }
}

/**
 * Pass 8 numbers in an object and set that to inputArray.
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 * TODO: move this to wasm by passing 8 numbers to inputArray.
 **/
export function objToByteArr(obj, byteArr, offset) {
  let index = 0;
  let tmp = obj.h0;
  byteArr[3] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[2] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[1] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[0] = tmp & 0xff;

  index = 1;
  tmp = obj.h1;
  byteArr[7] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[6] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[5] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[4] = tmp & 0xff;

  index = 2;
  tmp = obj.h2;
  byteArr[11] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[10] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[9] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[8] = tmp & 0xff;

  index = 3;
  tmp = obj.h3;
  byteArr[15] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[14] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[13] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[12] = tmp & 0xff;

  index = 4;
  tmp = obj.h4;
  byteArr[19] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[18] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[17] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[16] = tmp & 0xff;

  index = 5;
  tmp = obj.h5;
  byteArr[23] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[22] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[21] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[20] = tmp & 0xff;

  index = 6;
  tmp = obj.h6;
  byteArr[27] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[26] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[25] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[24] = tmp & 0xff;

  index = 7;
  tmp = obj.h7;
  byteArr[31] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[30] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[29] = tmp & 0xff;
  tmp = tmp >> 8;
  byteArr[28] = tmp & 0xff;
}

/**
 * Parse outputArray into an object of 8 numbers.
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 * TODO: move this part to wasm by passing 8 numbers to output array.
 **/
export function byteArrToObj(byteArr) {
  let index = 0;
  let tmp = 0;
  tmp |= byteArr[0] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[1] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[2] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[3] & 0xff;
  const h0 = tmp;

  index = 1;
  tmp = 0;
  tmp |= byteArr[4] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[5] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[6] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[7] & 0xff;
  const h1 = tmp;

  index = 2;
  tmp = 0;
  tmp |= byteArr[8] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[9] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[10] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[11] & 0xff;
  const h2 = tmp;

  index = 3;
  tmp = 0;
  tmp |= byteArr[12] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[13] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[14] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[15] & 0xff;
  const h3 = tmp;

  index = 4;
  tmp = 0;
  tmp |= byteArr[16] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[17] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[18] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[19] & 0xff;
  const h4 = tmp;

  index = 5;
  tmp = 0;
  tmp |= byteArr[20] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[21] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[22] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[23] & 0xff;
  const h5 = tmp;

  index = 6;
  tmp = 0;
  tmp |= byteArr[24] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[25] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[26] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[27] & 0xff;
  const h6 = tmp;

  index = 7;
  tmp = 0;
  tmp |= byteArr[28] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[29] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[30] & 0xff;
  tmp = tmp << 8;
  tmp |= byteArr[31] & 0xff;
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

const staticInstance = new SHA256();
