import {hasher} from "@chainsafe/persistent-merkle-tree/lib/hasher";

// create array of "zero hashes", successively hashed zero chunks
const zeroHashes = [new Uint8Array(32)];

export function zeroHash(depth: number): Uint8Array {
  if (depth >= zeroHashes.length) {
    for (let i = zeroHashes.length; i <= depth; i++) {
      zeroHashes[i] = hasher.digest64(zeroHashes[i - 1], zeroHashes[i - 1]);
    }
  }
  return zeroHashes[depth];
}
