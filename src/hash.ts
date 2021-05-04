import SHA256 from "@chainsafe/as-sha256";

/**
 * Hash two 32 byte arrays
 */
export function hash(a: Uint8Array, b: Uint8Array): Uint8Array {
  return SHA256.digest64(Buffer.concat([a, b]));
}
