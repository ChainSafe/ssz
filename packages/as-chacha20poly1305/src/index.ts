import {newInstance} from "./wasm";

const ctx = newInstance();
const wasmInputValue = ctx.input.value;
const wasmOutputValue = ctx.output.value;
const inputUint8Array = new Uint8Array(ctx.memory.buffer, wasmInputValue, ctx.INPUT_LENGTH);
const outputUint8Array = new Uint8Array(ctx.memory.buffer, wasmOutputValue, ctx.INPUT_LENGTH);

export function stream(data: Uint8Array): Uint8Array {
  if (data.length <= ctx.INPUT_LENGTH) {
    inputUint8Array.set(data);
    const size = ctx.stream(data.length);
    const output = new Uint8Array(size);
    output.set(outputUint8Array);
    return output;
  }

  // TODO
  return new Uint8Array();
}
