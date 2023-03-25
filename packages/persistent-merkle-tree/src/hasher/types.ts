import {HashObject} from "@chainsafe/as-sha256/hashObject";

export type Hasher = {
  digest64(a32Bytes: Uint8Array, b32Bytes: Uint8Array): Uint8Array;
  digest64HashObjects(a: HashObject, b: HashObject): HashObject;
};
