import * as sha256 from "bcrypto/lib/sha256";

export function hash(a: Uint8Array, b: Uint8Array): Uint8Array {
  return Uint8Array.from(sha256.digest(Buffer.concat([a, b])));
}
