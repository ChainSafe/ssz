/** @module ssz */
import {BYTES_PER_CHUNK} from "./constants";
import {hash} from "./hash";

// create array of "zero hashes", successively hashed zero chunks
export const zeroHashes = [Buffer.alloc(BYTES_PER_CHUNK)];
for (let i = 0; i < 52; i++) {
  const h = hash(zeroHashes[i], zeroHashes[i]);
  zeroHashes.push(Buffer.from(h.buffer, h.byteOffset, h.byteLength));
}
