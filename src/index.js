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
  static digestObjects(obj1, obj2) {
    // TODO: expect obj1 and obj2 as IHashObject
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
