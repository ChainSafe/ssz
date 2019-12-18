import * as sha256 from "bcrypto/lib/sha256";

export function hash(a: Buffer, b: Buffer): Buffer {
  return sha256.digest(Buffer.concat([a, b]));
}
