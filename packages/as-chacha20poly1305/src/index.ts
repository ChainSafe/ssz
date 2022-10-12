import {newInstance} from "./wasm";

const ctx = newInstance();
const wasmInputValue = ctx.input.value;
const wasmOutputValue = ctx.output.value;
const wasmKeyValue = ctx.key.value;
const wasmCounterValue = ctx.counter.value;

const inputUint8Array = new Uint8Array(ctx.memory.buffer, wasmInputValue, ctx.INPUT_LENGTH);
const outputUint8Array = new Uint8Array(ctx.memory.buffer, wasmOutputValue, ctx.INPUT_LENGTH);
const keyUint8Array = new Uint8Array(ctx.memory.buffer, wasmKeyValue, ctx.KEY_LENGTH);
const counterUint8Array = new Uint8Array(ctx.memory.buffer, wasmCounterValue, ctx.COUNTER_LENGTH);
const debugUint8Array = new Int32Array(ctx.memory.buffer, ctx.debug.value, 64);

export function streamXOR(key: Uint8Array, nonce: Uint8Array, src: Uint8Array): Uint8Array {
  // We only support 256-bit keys.
  if (key.length != ctx.KEY_LENGTH) {
    throw new Error("ChaCha: key size must be 32 bytes, expected " + ctx.KEY_LENGTH + " got " + key.length);
  }

  if (nonce.length != ctx.COUNTER_LENGTH) {
    throw new Error("ChaCha nonce with counter must be 16 bytes");
  }

  // init
  keyUint8Array.set(key);
  counterUint8Array.set(nonce);
  const output = new Uint8Array(src.length);

  // chunkify the work
  const loop = Math.floor(src.length / ctx.INPUT_LENGTH);
  for (let i = 0; i <= loop; i++) {
    const start = i * ctx.INPUT_LENGTH;
    const end = Math.min((i + 1) * ctx.INPUT_LENGTH, src.length);
    inputUint8Array.set(src.subarray(start, end));
    const length = end - start;
    const dataLength = ctx.streamXORUpdate(length);
    output.set(outputUint8Array.subarray(0, dataLength), start);
  }

  return output;
}
