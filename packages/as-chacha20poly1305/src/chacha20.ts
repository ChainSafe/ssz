import {newInstance} from "./wasm";

const ctx = newInstance();
const wasmChacha20InputValue = ctx.chacha20Input.value;
const wasmChacha20OutputValue = ctx.chacha20Output.value;
const wasmChacha20KeyValue = ctx.chacha20Key.value;
const wasmChacha20CounterValue = ctx.chacha20Counter.value;
const {CHACHA20_INPUT_LENGTH, CHACHA20_KEY_LENGTH, CHACHA20_COUNTER_LENGTH} = ctx;

const chacha20InputUint8Array = new Uint8Array(ctx.memory.buffer, wasmChacha20InputValue, CHACHA20_INPUT_LENGTH);
const chacha20OutputUint8Array = new Uint8Array(ctx.memory.buffer, wasmChacha20OutputValue, CHACHA20_INPUT_LENGTH);
const chacha20KeyUint8Array = new Uint8Array(ctx.memory.buffer, wasmChacha20KeyValue, CHACHA20_KEY_LENGTH);
const chacha20CounterUint8Array = new Uint8Array(ctx.memory.buffer, wasmChacha20CounterValue, CHACHA20_COUNTER_LENGTH);
const debugArray = new Uint32Array(ctx.memory.buffer, ctx.debug.value, 64);

export function chacha20StreamXOR(key: Uint8Array, nonce: Uint8Array, src: Uint8Array): Uint8Array {
  // We only support 256-bit keys.
  if (key.length != CHACHA20_KEY_LENGTH) {
    throw new Error("ChaCha: key size must be 32 bytes, expected " + CHACHA20_KEY_LENGTH + " got " + key.length);
  }

  if (nonce.length != CHACHA20_COUNTER_LENGTH) {
    throw new Error("ChaCha nonce with counter must be 16 bytes");
  }

  // init
  chacha20KeyUint8Array.set(key);
  chacha20CounterUint8Array.set(nonce);
  const output = new Uint8Array(src.length);

  // chunkify the work
  const loop = Math.floor(src.length / CHACHA20_INPUT_LENGTH);
  for (let i = 0; i <= loop; i++) {
    const start = i * CHACHA20_INPUT_LENGTH;
    const end = Math.min((i + 1) * CHACHA20_INPUT_LENGTH, src.length);
    chacha20InputUint8Array.set(loop === 0 ? src : src.subarray(start, end));
    const length = end - start;
    const dataLength = ctx.chacha20StreamXORUpdate(length);
    output.set(dataLength === CHACHA20_INPUT_LENGTH ? chacha20OutputUint8Array : chacha20OutputUint8Array.subarray(0, dataLength), start);
  }

  return output;
}
