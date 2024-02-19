import {sha256} from "@noble/hashes/sha256";
import type {Hasher} from "./types";
import {hashObjectToUint8Array, uint8ArrayToHashObject} from "./util";
import {allocHashId, getHash, setHash} from "@chainsafe/as-sha256";

const digest64 = (a: Uint8Array, b: Uint8Array): Uint8Array => sha256.create().update(a).update(b).digest();

export const hasher: Hasher = {
  digest64,
  digest64HashObjects: (a, b) => uint8ArrayToHashObject(digest64(hashObjectToUint8Array(a), hashObjectToUint8Array(b))),
  digest64HashIds: (a, b, out) => {
    const digest = digest64(getHash(a), getHash(b));
    setHash(out, digest);
  },
};
