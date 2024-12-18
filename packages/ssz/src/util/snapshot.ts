import {zeroHash} from "@chainsafe/persistent-merkle-tree";
import {hash64} from "./merkleize.js";
import {Snapshot} from "./types.js";

/**
 * Create a zero snapshot with the given chunksDepth.
 */
export function zeroSnapshot(chunkDepth: number): Snapshot {
  return {
    finalized: [],
    count: 0,
    root: hash64(zeroHash(chunkDepth), zeroHash(0)),
  };
}
