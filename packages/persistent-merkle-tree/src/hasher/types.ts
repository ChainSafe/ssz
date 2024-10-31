import type {HashObject} from "@chainsafe/as-sha256/lib/hashObject";
import type {HashComputationLevel} from "../hashComputation";

export type {HashObject};

export type Hasher = {
  // name of the hashing library
  name: string;
  /**
   * Hash two 32-byte Uint8Arrays
   */
  digest64(a32Bytes: Uint8Array, b32Bytes: Uint8Array): Uint8Array;
  /**
   * Hash two 32-byte HashObjects
   */
  digest64HashObjects(left: HashObject, right: HashObject, parent: HashObject): void;
  /**
   * Merkleize n SHA256 blocks in a single Uint8Array, each block is 64 bytes
   * padFor is maxChunkCount, use it to compute layers to hash
   * blocksBytes is mutated after the function
   */
  merkleizeBlocksBytes(blocksBytes: Uint8Array, padFor: number, output: Uint8Array, offset: number): void;
  /**
   * Hash multiple chunks (1 chunk = 32 bytes) at multiple levels
   * With nLevel = 3, hash multiple of 256 bytes, return multiple of 32 bytes.
   * The result is unsafe as it will be overwritten by the next call.
   */
  digestNLevel(data: Uint8Array, nLevel: number): Uint8Array;
  /**
   * Execute a batch of HashComputations
   */
  executeHashComputations(hashComputations: HashComputationLevel[]): void;
};
