import {ByteVector} from "../interface";

// Caching this info costs about ~1000 bytes and speeds up toHexString() by x6
const hexByByte: string[] = [];

export function toHexString(bytes: Uint8Array | ByteVector): string {
  let hex = "0x";
  for (const byte of bytes) {
    if (!hexByByte[byte]) {
      hexByByte[byte] = byte < 16 ? "0" + byte.toString(16) : byte.toString(16);
    }
    hex += hexByByte[byte];
  }
  return hex;
}

export function fromHexString(hex: string): Uint8Array {
  if (typeof hex !== "string") {
    throw new Error(`hex argument type ${typeof hex} must be of type string`);
  }

  if (hex.startsWith("0x")) {
    hex = hex.slice(2);
  }

  if (hex.length % 2 !== 0) {
    throw new Error(`hex string length ${hex.length} must be multiple of 2`);
  }

  const bytes: number[] = [];
  for (let i = 0, len = hex.length; i < len; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    bytes.push(byte);
  }
  return new Uint8Array(bytes);
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
