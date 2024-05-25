import type {HashObject} from "@chainsafe/as-sha256/lib/hashObject";

export type Hasher = {
  /**
   * Hash two 32-byte Uint8Arrays
   */
  digest64(a32Bytes: Uint8Array, b32Bytes: Uint8Array): Uint8Array;
  /**
   * Hash two 32-byte HashObjects
   */
  digest64HashObjects(a: HashObject, b: HashObject): HashObject;
  batchHash4HashObjectInputs(inputs: HashObject[]): HashObject[];
};
