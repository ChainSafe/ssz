// use noble here instead of using hasher variable because this is used inside hasher itself
// we cache zero hashes so performance is not a concern
import {sha256} from "@noble/hashes/sha256";

// create array of "zero hashes", successively hashed zero chunks
const zeroHashes: Array<Uint8Array> = [new Uint8Array(32)];

export function zeroHash(depth: number): Uint8Array {
  if (depth >= zeroHashes.length) {
    for (let i = zeroHashes.length; i <= depth; i++) {
      zeroHashes[i] = sha256
        .create()
        .update(zeroHashes[i - 1])
        .update(zeroHashes[i - 1])
        .digest();
    }
  }
  return zeroHashes[depth];
}
