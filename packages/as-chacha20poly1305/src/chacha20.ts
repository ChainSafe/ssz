import {newInstance} from "./wasm";

const ctx = newInstance();
const wasmInputValue = ctx.chacha20Input.value;
const wasmOutputValue = ctx.chacha20Output.value;
const wasmKeyValue = ctx.chacha20Key.value;
const wasmCounterValue = ctx.chacha20Counter.value;
const {CHACHA20_INPUT_LENGTH, KEY_LENGTH, CHACHA20_COUNTER_LENGTH} = ctx;

const inputArr = new Uint8Array(ctx.memory.buffer, wasmInputValue, CHACHA20_INPUT_LENGTH);
const outputArr = new Uint8Array(ctx.memory.buffer, wasmOutputValue, CHACHA20_INPUT_LENGTH);
const keyArr = new Uint8Array(ctx.memory.buffer, wasmKeyValue, KEY_LENGTH);
const counterArr = new Uint8Array(ctx.memory.buffer, wasmCounterValue, CHACHA20_COUNTER_LENGTH);
// const debugArray = new Uint32Array(ctx.memory.buffer, ctx.debug.value, 64);

// TODO: better types for key and nonce
/**
 * chacha 20 function.
 * @param key a 32 byte Uint8Array
 * @param nonce a 16 byte Uint8Array
 * @param src
 * @returns
 */
export function chacha20StreamXOR(key: Uint8Array, nonce: Uint8Array, src: Uint8Array): Uint8Array {
  // We only support 256-bit keys.
  if (key.length != KEY_LENGTH) {
    throw new Error("ChaCha: key size must be 32 bytes, expected " + KEY_LENGTH + " got " + key.length);
  }

  if (nonce.length != CHACHA20_COUNTER_LENGTH) {
    throw new Error("ChaCha nonce with counter must be 16 bytes");
  }

  // init
  keyArr.set(key);
  counterArr.set(nonce);
  const output = new Uint8Array(src.length);

  // chunkify the work
  const loop = Math.floor(src.length / CHACHA20_INPUT_LENGTH);
  for (let i = 0; i <= loop; i++) {
    const start = i * CHACHA20_INPUT_LENGTH;
    const end = Math.min((i + 1) * CHACHA20_INPUT_LENGTH, src.length);
    inputArr.set(loop === 0 ? src : src.subarray(start, end));
    const length = end - start;
    const dataLength = ctx.chacha20StreamXORUpdate(length);
    output.set(dataLength === CHACHA20_INPUT_LENGTH ? outputArr : outputArr.subarray(0, dataLength), start);
  }

  return output;
}
