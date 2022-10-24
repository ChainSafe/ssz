import {DATA_CHUNK_LENGTH, KEY_LENGTH, TAG_LENGTH} from "../common/const";
import {WasmContext} from "./wasm";

export class Poly1305 {
  private wasmKeyArr: Uint8Array;
  private wasmInputArr: Uint8Array;
  private wasmOutputArr: Uint8Array;
  private wasmDebugArr: Uint32Array;

  constructor(private readonly ctx: WasmContext) {
    const wasmPoly1305KeyValue = ctx.poly1305Key.value;
    this.wasmKeyArr = new Uint8Array(ctx.memory.buffer, wasmPoly1305KeyValue, KEY_LENGTH);
    const wasmPoly1305InputValue = ctx.poly1305Input.value;
    this.wasmInputArr = new Uint8Array(ctx.memory.buffer, wasmPoly1305InputValue, DATA_CHUNK_LENGTH);
    const wasmPoly1305OutputValue = ctx.poly1305Output.value;
    this.wasmOutputArr = new Uint8Array(ctx.memory.buffer, wasmPoly1305OutputValue, TAG_LENGTH);
    const wasmPoly1305DebugValue = ctx.debug.value;
    this.wasmDebugArr = new Uint32Array(ctx.memory.buffer, wasmPoly1305DebugValue, 64);
  }

  init(key: Uint8Array): void {
    if (key.length != KEY_LENGTH) {
      throw Error(`Invalid poly1305 key length ${key.length}, expect ${KEY_LENGTH}`);
    }
    this.wasmKeyArr.set(key);
    this.ctx.poly1305Init();
  }

  update(data: Uint8Array): void {
    if (data.length <= DATA_CHUNK_LENGTH) {
      this.wasmInputArr.set(data);
      this.ctx.poly1305Update(data.length);
      return;
    }

    for (let offset = 0; offset < data.length; offset += DATA_CHUNK_LENGTH) {
      const end = Math.min(data.length, offset + DATA_CHUNK_LENGTH);
      this.wasmInputArr.set(data.subarray(offset, end));
      this.ctx.poly1305Update(end - offset);
    }
  }

  digest(): Uint8Array {
    this.ctx.poly1305Digest();
    const out = new Uint8Array(TAG_LENGTH);
    out.set(this.wasmOutputArr);
    return out;
  }
}
