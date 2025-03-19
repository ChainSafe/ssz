import {WasmContext, newInstance} from "./wasm.js";

/**
 * Class based SHA256
 */
// biome-ignore lint/style/useNamingConvention: Required to use `SHA256` name for class not PasCalCase
export default class SHA256 {
  ctx: WasmContext;
  private wasmInputValue: number;
  private wasmOutputValue: number;
  private uint8InputArray: Uint8Array;
  private uint8OutputArray: Uint8Array;

  constructor() {
    this.ctx = newInstance();
    this.wasmInputValue = this.ctx.input.value;
    this.wasmOutputValue = this.ctx.output.value;
    this.uint8InputArray = new Uint8Array(this.ctx.memory.buffer, this.wasmInputValue, this.ctx.INPUT_LENGTH);
    this.uint8OutputArray = new Uint8Array(this.ctx.memory.buffer, this.wasmOutputValue, 32);
  }

  init(): this {
    this.ctx.init();
    return this;
  }

  update(data: Uint8Array): this {
    const inputLength = this.ctx.INPUT_LENGTH;
    if (data.length > inputLength) {
      for (let i = 0; i < data.length; i += inputLength) {
        const sliced = data.slice(i, i + inputLength);
        this.uint8InputArray.set(sliced);
        this.ctx.update(this.wasmInputValue, sliced.length);
      }
    } else {
      this.uint8InputArray.set(data);
      this.ctx.update(this.wasmInputValue, data.length);
    }
    return this;
  }

  final(): Uint8Array {
    this.ctx.final(this.wasmOutputValue);
    const output = new Uint8Array(32);
    output.set(this.uint8OutputArray);
    return output;
  }
}
