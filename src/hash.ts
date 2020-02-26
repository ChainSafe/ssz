import SHA256 from "@chainsafe/as-sha256";

export function hash(a: Uint8Array, b: Uint8Array): Uint8Array {
  return SHA256.digest(Buffer.concat([a, b]));
}
