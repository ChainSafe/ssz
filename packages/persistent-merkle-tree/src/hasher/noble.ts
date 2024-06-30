import {sha256} from "@noble/hashes/sha256";
import {digest64HashObjects, HashObject, byteArrayIntoHashObject} from "@chainsafe/as-sha256";
import type {Hasher} from "./types";
import {hashObjectToUint8Array} from "./util";

const digest64 = (a: Uint8Array, b: Uint8Array): Uint8Array => sha256.create().update(a).update(b).digest();

export const hasher: Hasher = {
  name: "noble",
  digest64,
  digest64HashObjects: (left, right, parent) => {
    byteArrayIntoHashObject(digest64(hashObjectToUint8Array(left), hashObjectToUint8Array(right)), parent);
  },
  digestNLevelUnsafe(data: Uint8Array, nLevel: number): Uint8Array {
    throw new Error("Not implemented");
  },
  batchHashObjects: (inputs: HashObject[]) => {
    // noble does not support batch hash
    if (inputs.length === 0) {
      return [];
    } else if (inputs.length % 2 !== 0) {
      throw new Error(`Expect inputs.length to be even, got ${inputs.length}`);
    }

    const outputs = new Array<HashObject>();
    for (let i = 0; i < inputs.length; i += 2) {
      const output = digest64HashObjects(inputs[i], inputs[i + 1]);
      outputs.push(output);
    }
    return outputs;
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
