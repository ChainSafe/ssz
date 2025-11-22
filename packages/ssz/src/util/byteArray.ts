import {ByteVector} from "../interface.ts";

// Caching this info costs about ~1000 bytes and speeds up toHexString() by x6
const hexByByte = new Array<string>(256);

/** Wrapper to select Uint8Array.slice or Uint8Array.subarray */
export function slice(data: Uint8Array, start?: number, end?: number, reuseBytes?: boolean): Uint8Array {
  // Buffer.prototype.slice does not copy memory, force use Uint8Array.prototype.slice https://github.com/nodejs/node/issues/28087
  // - Uint8Array.prototype.slice: Copy memory, safe to mutate
  // - Buffer.prototype.slice: Does NOT copy memory, mutation affects both views
  // We could ensure that all Buffer instances are converted to Uint8Array before calling value_deserializeFromBytes
  // However doing that in a browser friendly way is not easy. Downstream code uses `Uint8Array.prototype.slice.call`
  // to ensure Buffer.prototype.slice is never used. Unit tests also test non-mutability.
  return reuseBytes
    ? Uint8Array.prototype.subarray.call(data, start, end)
    : Uint8Array.prototype.slice.call(data, start, end);
}

export function toHexString(bytes: Uint8Array | ByteVector): string {
  let hex = "0x";
  for (const byte of bytes) {
    if (!hexByByte[byte]) {
      hexByByte[byte] = byte < 16 ? `0${byte.toString(16)}` : byte.toString(16);
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

  const byteLen = hex.length / 2;
  const bytes = new Uint8Array(byteLen);
  for (let i = 0; i < byteLen; i++) {
    const byte = parseInt(hex.slice(i * 2, (i + 1) * 2), 16);
    bytes[i] = byte;
  }
  return bytes;
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
