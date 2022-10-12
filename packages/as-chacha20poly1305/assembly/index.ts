import {doStreamXORUpdate} from "./chacha20";

export const INPUT_LENGTH = 512;
// See stablelib
export const KEY_LENGTH = 32;
export const COUNTER_LENGTH = 16;

// input buffer
export const input = new ArrayBuffer(INPUT_LENGTH);
const inputPtr = changetype<usize>(input);

export const key = new ArrayBuffer(KEY_LENGTH);
const keyPtr = changetype<usize>(key);

// the nonce in chacha
export const counter = new ArrayBuffer(COUNTER_LENGTH);
const counterPtr = changetype<usize>(counter);

// output buffer
export const output = new ArrayBuffer(INPUT_LENGTH);
const outputPtr = changetype<usize>(output);

export const debug = new ArrayBuffer(64);
const debugPtr = changetype<usize>(debug);

export function streamXORUpdate(dataLength: u32): u32 {
  return doStreamXORUpdate(inputPtr, dataLength, keyPtr, counterPtr, outputPtr);
}
