import type {HashObject} from "@chainsafe/as-sha256/lib/hashObject";
import {HashComputation} from "../node";

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
  digest64HashObjects(a: HashObject, b: HashObject): HashObject;
  /**
   * Batch hash 2 * n HashObjects, return n HashObjects output
   */
  batchHashObjects(inputs: HashObject[]): HashObject[];
  /**
   * Execute a batch of HashComputations
   */
  executeHashComputations(hashComputations: Array<HashComputation[]>): void;
};
