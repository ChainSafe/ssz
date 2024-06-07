import {hash} from "@chainsafe/hashtree";
import {byteArrayToHashObject, hashObjectToByteArray} from "@chainsafe/as-sha256";
import {Hasher, HashObject} from "./types";
import {HashComputation, Node} from "../node";

export const hasher: Hasher = {
  digest64(obj1: Uint8Array, obj2: Uint8Array): Uint8Array {
    return hash(Uint8Array.of(obj1, obj2));
  },
  digest64HashObjects(obj1: HashObject, obj2: HashObject): HashObject {
    return byteArrayToHashObject(hasher.digest64(hashObjectToByteArray(obj1), hashObjectToByteArray(obj2)));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  batchHashObjects(inputs: HashObject[]): HashObject[] {
    throw new Error("batchHashObjects not implemented for hashtree hasher");
  },
  executeHashComputations(hashComputations: Array<HashComputation[]>): void {
    for (let level = hashComputations.length - 1; level >= 0; level--) {
      const hcArr = hashComputations[level];
      if (!hcArr) {
        // should not happen
        throw Error(`no hash computations for level ${level}`);
      }

      // size input array to 2 HashObject per computation * 32 bytes per object
      const input: Uint8Array = Uint8Array.of(new Array(hcArr.length * 2 * 32));
      const output: Node[] = [];
      for (const [i, hc] of hcArr.entries()) {
        const offset = (i - 1) * 64; // zero index * 2 leafs * 32 bytes
        hashObjectToByteArray(hc.src0, input, offset);
        hashObjectToByteArray(hc.src1, input, offset + 32);
        output.push(hc.dest);
      }

      const result: Uint8Array = hash(input);

      for (const [i, out] of output.entries()) {
        const offset = (i - 1) * 32;
        out.applyHash(result.slice(offset, offset + 32));
      }
    }
  },
};
