import {digest2Bytes32} from "@chainsafe/as-sha256";
import {alloc} from "./byteArray";

// create array of "zero hashes", successively hashed zero chunks
const zeroHashes = [alloc(32)];

export function zeroHash(depth: number): Uint8Array {
  if (depth >= zeroHashes.length) {
    for (let i = zeroHashes.length; i <= depth; i++) {
      zeroHashes[i] = digest2Bytes32(zeroHashes[i - 1], zeroHashes[i - 1]);
    }
  }
  return zeroHashes[depth];
}
