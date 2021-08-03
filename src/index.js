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
 * This function contains multiple same for loop but we intentionally
 * do it step by step to improve performance a bit.
 * TODO: move this to wasm by passing 8 numbers to inputArray.
 **/
export function objToByteArr(obj, byteArr, offset) {
  let index = 0;
  let tmp = obj.h0;
  // this for loop is the same for every step
  for (let byte = 0; byte < 4; byte++) {
    byteArr[index * 4 + (3 - byte) + offset] = tmp & 0xff;
    if (byte < 3) tmp = tmp >> 8;
  }

  index = 1;
  tmp = obj.h1;
  for (let byte = 0; byte < 4; byte++) {
    byteArr[index * 4 + (3 - byte) + offset] = tmp & 0xff;
    if (byte < 3) tmp = tmp >> 8;
  }

  index = 2;
  tmp = obj.h2;
  for (let byte = 0; byte < 4; byte++) {
    byteArr[index * 4 + (3 - byte) + offset] = tmp & 0xff;
    if (byte < 3) tmp = tmp >> 8;
  }

  index = 3;
  tmp = obj.h3;
  for (let byte = 0; byte < 4; byte++) {
    byteArr[index * 4 + (3 - byte) + offset] = tmp & 0xff;
    if (byte < 3) tmp = tmp >> 8;
  }

  index = 4;
  tmp = obj.h4;
  for (let byte = 0; byte < 4; byte++) {
    byteArr[index * 4 + (3 - byte) + offset] = tmp & 0xff;
    if (byte < 3) tmp = tmp >> 8;
  }

  index = 5;
  tmp = obj.h5;
  for (let byte = 0; byte < 4; byte++) {
    byteArr[index * 4 + (3 - byte) + offset] = tmp & 0xff;
    if (byte < 3) tmp = tmp >> 8;
  }

  index = 6;
  tmp = obj.h6;
  for (let byte = 0; byte < 4; byte++) {
    byteArr[index * 4 + (3 - byte) + offset] = tmp & 0xff;
    if (byte < 3) tmp = tmp >> 8;
  }

  index = 7;
  tmp = obj.h7;
  for (let byte = 0; byte < 4; byte++) {
    byteArr[index * 4 + (3 - byte) + offset] = tmp & 0xff;
    if (byte < 3) tmp = tmp >> 8;
  }
}

/**
 * Parse outputArray into an object of 8 numbers.
 * This function contains multiple same for loop but we intentionally
 * do it step by step to improve performance a bit.
 * TODO: move this part to wasm by passing 8 numbers to output array.
 **/
export function byteArrToObj(byteArr) {
  let index = 0;
  let tmp = 0;
  // this for loop is the same for every step
  for (let byte = 0; byte < 4; byte++) {
    tmp |= byteArr[index * 4 + byte] & 0xff;
    if (byte < 3) tmp = tmp << 8;
  }
  const h0 = tmp;

  index = 1;
  tmp = 0;
  for (let byte = 0; byte < 4; byte++) {
    tmp |= byteArr[index * 4 + byte] & 0xff;
    if (byte < 3) tmp = tmp << 8;
  }
  const h1 = tmp;

  index = 2;
  tmp = 0;
  for (let byte = 0; byte < 4; byte++) {
    tmp |= byteArr[index * 4 + byte] & 0xff;
    if (byte < 3) tmp = tmp << 8;
  }
  const h2 = tmp;

  index = 3;
  tmp = 0;
  for (let byte = 0; byte < 4; byte++) {
    tmp |= byteArr[index * 4 + byte] & 0xff;
    if (byte < 3) tmp = tmp << 8;
  }
  const h3 = tmp;

  index = 4;
  tmp = 0;
  for (let byte = 0; byte < 4; byte++) {
    tmp |= byteArr[index * 4 + byte] & 0xff;
    if (byte < 3) tmp = tmp << 8;
  }
  const h4 = tmp;

  index = 5;
  tmp = 0;
  for (let byte = 0; byte < 4; byte++) {
    tmp |= byteArr[index * 4 + byte] & 0xff;
    if (byte < 3) tmp = tmp << 8;
  }
  const h5 = tmp;

  index = 6;
  tmp = 0;
  for (let byte = 0; byte < 4; byte++) {
    tmp |= byteArr[index * 4 + byte] & 0xff;
    if (byte < 3) tmp = tmp << 8;
  }
  const h6 = tmp;

  index = 7;
  tmp = 0;
  for (let byte = 0; byte < 4; byte++) {
    tmp |= byteArr[index * 4 + byte] & 0xff;
    if (byte < 3) tmp = tmp << 8;
  }
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
