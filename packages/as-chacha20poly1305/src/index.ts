import {newInstance} from "./wasm";

const ctx = newInstance();
const wasmInputValue = ctx.input.value;
const wasmOutputValue = ctx.output.value;
const wasmKeyValue = ctx.key.value;
const wasmCounterValue = ctx.counter.value;
const {INPUT_LENGTH, KEY_LENGTH, COUNTER_LENGTH} = ctx;

const inputUint8Array = new Uint8Array(ctx.memory.buffer, wasmInputValue, INPUT_LENGTH);
const outputUint8Array = new Uint8Array(ctx.memory.buffer, wasmOutputValue, INPUT_LENGTH);
const keyUint8Array = new Uint8Array(ctx.memory.buffer, wasmKeyValue, KEY_LENGTH);
const counterUint8Array = new Uint8Array(ctx.memory.buffer, wasmCounterValue, COUNTER_LENGTH);
const debugUint8Array = new Int32Array(ctx.memory.buffer, ctx.debug.value, 64);

export function streamXOR(key: Uint8Array, nonce: Uint8Array, src: Uint8Array): Uint8Array {
  // We only support 256-bit keys.
  if (key.length != KEY_LENGTH) {
    throw new Error("ChaCha: key size must be 32 bytes, expected " + KEY_LENGTH + " got " + key.length);
  }

  if (nonce.length != COUNTER_LENGTH) {
    throw new Error("ChaCha nonce with counter must be 16 bytes");
  }

  // init
  keyUint8Array.set(key);
  counterUint8Array.set(nonce);
  const output = new Uint8Array(src.length);

  // chunkify the work
  const loop = Math.floor(src.length / INPUT_LENGTH);
  for (let i = 0; i <= loop; i++) {
    const start = i * INPUT_LENGTH;
    const end = Math.min((i + 1) * INPUT_LENGTH, src.length);
    inputUint8Array.set(loop === 0 ? src : src.subarray(start, end));
    const length = end - start;
    const dataLength = ctx.streamXORUpdate(length);
    output.set(dataLength === INPUT_LENGTH ? outputUint8Array : outputUint8Array.subarray(0, dataLength), start);
  }

  return output;
}
