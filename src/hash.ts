import SHA256, {byteArrayToHashObject, HashObject, hashObjectToByteArray} from "@chainsafe/as-sha256";

const input = new Uint8Array(64);

/**
 * Hash two 32 byte arrays
 */
export function hash(a: Uint8Array, b: Uint8Array): Uint8Array {
  input.set(a, 0);
  input.set(b, 32);
  return SHA256.digest64(input);
}

/**
 * Hash 2 objects, each store 8 numbers (equivalent to Uint8Array(32))
 */
export function hashTwoObjects(a: HashObject, b: HashObject): HashObject {
  return SHA256.digestTwoHashObjects(a, b);
}

export function hashObjectToUint8Array(obj: HashObject): Uint8Array {
  const byteArr = new Uint8Array(32);
  hashObjectToByteArray(obj, byteArr, 0);
  return byteArr;
}

export function uint8ArrayToHashObject(byteArr: Uint8Array): HashObject {
  return byteArrayToHashObject(byteArr);
}

export function isHashObject(hash: HashObject | Uint8Array): hash is HashObject {
  // @ts-ignore
  return hash.length === undefined;
}
