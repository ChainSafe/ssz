import {doStreamXORUpdate} from "./chacha20";
import {clean, digest, init, polyArr, update} from "./poly1305";

export const CHACHA20_INPUT_LENGTH = 512;
// See stablelib
export const CHACHA20_KEY_LENGTH = 32;
export const CHACHA20_COUNTER_LENGTH = 16;
export const POLY1305_KEY_LENGTH = 32;
export const POLY1305_OUTPUT_LENGTH = 16;
// TODO: review input length
export const POLY1305_INPUT_LENGTH = 512;

// input buffer
export const chacha20Input = new ArrayBuffer(CHACHA20_INPUT_LENGTH);
const chacha20InputPtr = changetype<usize>(chacha20Input);

export const chacha20Key = new ArrayBuffer(CHACHA20_KEY_LENGTH);
const chacha20KeyPtr = changetype<usize>(chacha20Key);

// the nonce in chacha
export const chacha20Counter = new ArrayBuffer(CHACHA20_COUNTER_LENGTH);
const chacha20CounterPtr = changetype<usize>(chacha20Counter);

// output buffer
export const chacha20Output = new ArrayBuffer(CHACHA20_INPUT_LENGTH);
const chacha20OutputPtr = changetype<usize>(chacha20Output);

const debugArr = new Uint32Array(64);
export const debug = debugArr.buffer;
// const debugPtr = changetype<usize>(debug);

const poly1305InputArr = new Uint8Array(POLY1305_INPUT_LENGTH);
export const poly1305Input = poly1305InputArr.buffer;

const poly1305KeyArr = new Uint8Array(POLY1305_KEY_LENGTH);
export const poly1305Key = poly1305KeyArr.buffer;

const poly1305OutputArr = new Uint8Array(POLY1305_OUTPUT_LENGTH);
export const poly1305Output = poly1305OutputArr.buffer;

export function chacha20StreamXORUpdate(dataLength: u32): u32 {
  return doStreamXORUpdate(chacha20InputPtr, dataLength, chacha20KeyPtr, chacha20CounterPtr, chacha20OutputPtr);
}

export function poly1305Init(): void {
  init(poly1305KeyArr);
}

export function poly1305Update(dataLength: u32): void {
  // TODO: be careful when converting to pointer
  update(poly1305InputArr.subarray(0, dataLength));
}

export function poly1305Digest(): void {
  digest(poly1305OutputArr);
  debugArr.set(polyArr);
  clean();
}
