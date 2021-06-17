import SHA256 from "@chainsafe/as-sha256";

const input = new Uint8Array(64);

/**
 * Hash two 32 byte arrays
 */
export function hash(a: Uint8Array, b: Uint8Array): Uint8Array {
  input.set(a, 0);
  input.set(b, 32);
  return SHA256.digest64(input);
}
