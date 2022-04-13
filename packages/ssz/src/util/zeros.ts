import {digest2Bytes32} from "@chainsafe/as-sha256";

// create array of "zero hashes", successively hashed zero chunks
const zeroHashes = [new Uint8Array(32)];

export function zeroHash(depth: number): Uint8Array {
  if (depth >= zeroHashes.length) {
    for (let i = zeroHashes.length; i <= depth; i++) {
      zeroHashes[i] = digest2Bytes32(zeroHashes[i - 1], zeroHashes[i - 1]);
    }
  }
  return zeroHashes[depth];
}
