
export function writeUint32LE(value: i32, out: Uint8Array, offset: u8 = 0): Uint8Array {
  out[offset + 0] = value >>> 0;
  out[offset + 1] = value >>> 8;
  out[offset + 2] = value >>> 16;
  out[offset + 3] = value >>> 24;
  return out;
}

export function wipe(array: Uint8Array): Uint8Array {
  // Right now it's similar to array.fill(0). If it turns
  // out that runtimes optimize this call away, maybe
  // we can try something else.
  for (let i = 0; i < array.length; i++) {
    array[i] = 0;
  }
  return array;
}