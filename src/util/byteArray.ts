/* eslint-disable @typescript-eslint/no-unused-vars */
import {ByteVector} from "../interface";

export function toHexString(target: Uint8Array | ByteVector): string {
  return "0x" + [...target].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export function fromHexString(data: string): Uint8Array {
  if (typeof data !== "string") {
    throw new Error("Expected hex string to be a string");
  }
  if (data.length % 2 !== 0) {
    throw new Error("Expected an even number of characters");
  }
  data = data.replace("0x", "");
  return new Uint8Array(data.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
}

export function byteArrayEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function getByteBits(target: Uint8Array, offset: number): boolean[] {
  const byte = target[offset];
  if (!byte) {
    return [false, false, false, false, false, false, false, false];
  }
  const bits = Array.prototype.map
    .call(byte.toString(2).padStart(8, "0"), (c) => (c === "1" ? true : false))
    .reverse() as boolean[];
  return bits;
}
