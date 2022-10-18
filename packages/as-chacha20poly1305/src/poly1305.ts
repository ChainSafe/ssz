import {WasmContext} from "./wasm";

// TODO: not able to get these value from wasm
const POLY1305_KEY_LENGTH = 32;
const POLY1305_INPUT_LENGTH = 512;
const POLY1305_OUTPUT_LENGTH = 16;

// const debugArray = new Uint32Array(ctx.memory.buffer, ctx.debug.value, 64);

export class Poly1305 {
  private wasmKeyArr: Uint8Array;
  private wasmInputArr: Uint8Array;
  private wasmOutputArr: Uint8Array;
  private wasmDebugArr: Uint32Array;

  constructor(private readonly ctx: WasmContext) {
    const wasmPoly1305KeyValue = ctx.poly1305Key.value;
    this.wasmKeyArr = new Uint8Array(ctx.memory.buffer, wasmPoly1305KeyValue, POLY1305_KEY_LENGTH);
    const wasmPoly1305InputValue = ctx.poly1305Input.value;
    this.wasmInputArr = new Uint8Array(ctx.memory.buffer, wasmPoly1305InputValue, POLY1305_INPUT_LENGTH);
    const wasmPoly1305OutputValue = ctx.poly1305Output.value;
    this.wasmOutputArr = new Uint8Array(ctx.memory.buffer, wasmPoly1305OutputValue, POLY1305_OUTPUT_LENGTH);
    const wasmPoly1305DebugValue = ctx.debug.value;
    this.wasmDebugArr = new Uint32Array(ctx.memory.buffer, wasmPoly1305DebugValue, 64);
  }

  init(key: Uint8Array): void {
    if (key.length != POLY1305_KEY_LENGTH) {
      throw Error(`Invalid poly1305 key length ${key.length}, expect ${POLY1305_KEY_LENGTH}`);
    }
    this.wasmKeyArr.set(key);
    this.ctx.poly1305Init();
  }

  update(data: Uint8Array): void {
    if (data.length <= POLY1305_INPUT_LENGTH) {
      this.wasmInputArr.set(data);
      this.ctx.poly1305Update(data.length);
      return;
    }

    for (let offset = 0; offset < data.length; offset += POLY1305_INPUT_LENGTH) {
      const end = Math.min(data.length, offset + POLY1305_INPUT_LENGTH);
      this.wasmInputArr.set(data.subarray(offset, end));
      this.ctx.poly1305Update(end - offset);
    }
  }

  digest(): Uint8Array {
    this.ctx.poly1305Digest();
    const out = new Uint8Array(POLY1305_OUTPUT_LENGTH);
    out.set(this.wasmOutputArr);
    return out;
  }
}
