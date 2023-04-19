import {byteArrayToHashObject, HashObject, hashObjectToByteArray} from "@chainsafe/as-sha256/lib/hashObject";

export function hashObjectToUint8Array(obj: HashObject): Uint8Array {
  const byteArr = new Uint8Array(32);
  hashObjectToByteArray(obj, byteArr, 0);
  return byteArr;
}

export function uint8ArrayToHashObject(byteArr: Uint8Array): HashObject {
  return byteArrayToHashObject(byteArr);
}
