import {newInstance} from './wasm';

export default class SHA256 {
  constructor() {
    this.ctx = newInstance();
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
    if (data.length <= SHA256.ctx.INPUT_LENGTH) {
      const input = new Uint8Array(SHA256.ctx.memory.buffer, SHA256.ctx.input.value, SHA256.ctx.INPUT_LENGTH);
      input.set(data);
      SHA256.ctx.digest(data.length);
      const output = new Uint8Array(32);
      output.set(new Uint8Array(SHA256.ctx.memory.buffer, SHA256.ctx.output.value, 32));
      return output;
    }
    return SHA256.ctx.init().update(data).final();
  }
}

SHA256.ctx = new SHA256();
