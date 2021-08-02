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
    const input = new Uint8Array(this.ctx.memory.buffer, this.ctx.input.value, INPUT_LENGTH);
    if (data.length > INPUT_LENGTH) {
      for (let i = 0; i < data.length; i += INPUT_LENGTH) {
        const sliced = data.slice(i, i + INPUT_LENGTH);
        input.set(sliced);
        this.ctx.update(this.ctx.input.value, sliced.length);
      }
    } else {
      input.set(data)
      this.ctx.update(this.ctx.input.value, data.length);
    }
    return this;
  }
  final() {
    this.ctx.final(this.ctx.output.value);
    const output = new Uint8Array(32);
    output.set(new Uint8Array(this.ctx.memory.buffer, this.ctx.output.value, 32));
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

  // digest64 average 80
  static digest64(data) {
    if (data.length==64) {
      const input = new Uint8Array(staticInstance.ctx.memory.buffer, staticInstance.ctx.input.value, staticInstance.ctx.INPUT_LENGTH);
      input.set(data);
      // console.log("@@@ digest64 inputArray[0123]", staticInstance.inputArray[0], staticInstance.inputArray[1], staticInstance.inputArray[2], staticInstance.inputArray[3]);
      staticInstance.ctx.digest64(staticInstance.ctx.input.value,staticInstance.ctx.output.value);
      const output = new Uint8Array(32);
      output.set(new Uint8Array(staticInstance.ctx.memory.buffer, staticInstance.ctx.output.value, 32));
      // console.log("@@@ digest64 output", output);
      return output;
    }
    throw new Error("InvalidLengthForDigest64");
  }

  // digest64 average 80
  static digest642(data) {
    if (data.length==64) {
      staticInstance.inputArray.set(data);
      // staticInstance.inputArray.set(data);
      // console.log("@@@ digest64 inputArray[0123]", staticInstance.inputArray[0], staticInstance.inputArray[1], staticInstance.inputArray[2], staticInstance.inputArray[3]);
      staticInstance.ctx.digest64(staticInstance.wasmInputValue, staticInstance.wasmOutputValue);
      const output = new Uint8Array(32);
      output.set(staticInstance.outputArray);
      // console.log("@@@ digest64 output", output);
      return output;
    }
    throw new Error("InvalidLengthForDigest64");
  }

  /**
   * 70 if return Uint8Array
   * 100 if return Uint8Array.buffer
   * 119 if return buffer.slice()
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

export function objToByteArr(obj, byteArr, offset) {
  for (let index = 0; index < 8; index++) {
    let tmp = obj[index];
    for (let byte = 0; byte < 4; byte++) {
      byteArr[index * 4 + (3 - byte) + offset] = tmp & 0xff;
      if (byte < 3) tmp = tmp >> 8;
    }
  }
}

export function byteArrToObj(byteArr) {
  const result = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
  };
  for (let nbr = 0; nbr < 8; nbr++) {
    let tmp = 0;
    // 4 byte = 1 number
    for (let byte = 0; byte < 4; byte++) {
      tmp |= byteArr[nbr * 4 + byte] & 0xff;
      if (byte < 3) tmp = tmp << 8;
    }
    result[nbr] = tmp;
  }
  return result;
}

const staticInstance = new SHA256();
