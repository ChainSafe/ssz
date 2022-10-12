import {doStreamXORUpdate} from "./chacha20";

export const INPUT_LENGTH = 512;
// See stablelib
export const KEY_LENGTH = 32;
export const COUNTER_LENGTH = 16;

// input buffer
const inputArr = new Uint8Array(INPUT_LENGTH);
export const input = inputArr.buffer;

const keyArr = new Uint8Array(KEY_LENGTH);
export const key = keyArr.buffer;

// the nonce in chacha
const counterArr = new Uint8Array(COUNTER_LENGTH);
export const counter = counterArr.buffer;

// output buffer
const outputArr = new Uint8Array(INPUT_LENGTH);
export const output = outputArr.buffer;

const debugArr = new Int32Array(64);
export const debug = debugArr.buffer;

export function streamXORUpdate(dataLength: u32): u32 {
  return doStreamXORUpdate(inputArr, dataLength, keyArr, counterArr, outputArr);
}
