import type {HashObject} from "@chainsafe/as-sha256";
import type {HashComputationLevel} from "../hashComputation.js";

export type {HashObject};

export type Hasher = {
  // name of the hashing library
  name: string;
  // as-sha256 has an async initialization. must run this to detect correct bindings
  initialize?: () => Promise<void>;
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
   * Merkleize n SHA256 blocks, each is 64 bytes Uint8Array
   * blockLimit is the number of blocks to hash, should be <= blocks.length
   * padFor is maxChunkCount, use it to compute layers to hash
   * blocks are mutated after the function
   */
  merkleizeBlockArray(
    blocks: Uint8Array[],
    blockLimit: number,
    padFor: number,
    output: Uint8Array,
    offset: number
  ): void;
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
