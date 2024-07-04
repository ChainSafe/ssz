import {sha256} from "@noble/hashes/sha256";
import {digest64HashObjects, byteArrayIntoHashObject} from "@chainsafe/as-sha256";
import type {Hasher} from "./types";
import {hashObjectToUint8Array} from "./util";

const digest64 = (a: Uint8Array, b: Uint8Array): Uint8Array => sha256.create().update(a).update(b).digest();

export const hasher: Hasher = {
  name: "noble",
  digest64,
  digest64HashObjects: (left, right, parent) => {
    byteArrayIntoHashObject(digest64(hashObjectToUint8Array(left), hashObjectToUint8Array(right)), parent);
  },
  merkleizeInto(): void {
    throw new Error("Not implemented");
  },
  digestNLevel(): Uint8Array {
    throw new Error("Not implemented");
  },
  executeHashComputations: (hashComputations) => {
    for (let level = hashComputations.length - 1; level >= 0; level--) {
      const hcArr = hashComputations[level];
      if (!hcArr) {
        // should not happen
        throw Error(`no hash computations for level ${level}`);
      }

      for (const hc of hcArr) {
        hc.dest.applyHash(digest64HashObjects(hc.src0, hc.src1));
      }
    }
  },
};
