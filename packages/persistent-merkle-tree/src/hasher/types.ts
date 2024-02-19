import {HashId, HashObject} from "@chainsafe/as-sha256";

export type Hasher = {
  /**
   * Hash two 32-byte Uint8Arrays
   */
  digest64(a32Bytes: Uint8Array, b32Bytes: Uint8Array): Uint8Array;
  /**
   * Hash two 32-byte HashObjects
   */
  digest64HashObjects(a: HashObject, b: HashObject): HashObject;
  /**
   * Hash two HashIds
   */
  digest64HashIds(a: HashId, b: HashId, out: HashId): void;
};
