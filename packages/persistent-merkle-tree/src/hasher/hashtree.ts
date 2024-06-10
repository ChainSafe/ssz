import {hash} from "@chainsafe/hashtree";
import {byteArrayToHashObject, hashObjectToByteArray} from "@chainsafe/as-sha256";
import {Hasher, HashObject} from "./types";
import {HashComputation, Node} from "../node";

export const hasher: Hasher = {
  name: "hashtree",
  digest64(obj1: Uint8Array, obj2: Uint8Array): Uint8Array {
    return hash(Uint8Array.from([...obj1, ...obj2]));
  },
  digest64HashObjects(obj1: HashObject, obj2: HashObject): HashObject {
    const input1 = Uint8Array.from(new Array<number>(32));
    const input2 = Uint8Array.from(new Array<number>(32));
    hashObjectToByteArray(obj1, input1, 0);
    hashObjectToByteArray(obj2, input2, 0);
    return byteArrayToHashObject(hasher.digest64(input1, input2));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  batchHashObjects(inputs: HashObject[]): HashObject[] {
    if (inputs.length === 0) {
      return [];
    }
    // size input array to 2 HashObject per computation * 32 bytes per object
    const input: Uint8Array = Uint8Array.from(new Array(inputs.length * 32));
    inputs.forEach((hashObject, i) => hashObjectToByteArray(hashObject, input, i * 32));
    const result: Uint8Array = hash(input);
    const outputs: HashObject[] = [];
    for (let i = 0; i < inputs.length / 2; i++) {
      const offset = i * 32;
      outputs.push(byteArrayToHashObject(result.slice(offset, offset + 32)));
    }
    return outputs;
  },
  executeHashComputations(hashComputations: Array<HashComputation[]>): void {
    for (let level = hashComputations.length - 1; level >= 0; level--) {
      const hcArr = hashComputations[level];
      if (!hcArr) {
        // should not happen
        throw Error(`no hash computations for level ${level}`);
      }

      // size input array to 2 HashObject per computation * 32 bytes per object
      const input: Uint8Array = Uint8Array.from(new Array(hcArr.length * 2 * 32));
      const output: Node[] = [];
      for (const [i, {src0, src1, dest}] of hcArr.entries()) {
        const offset = i * 64; // zero index * 2 leafs * 32 bytes
        hashObjectToByteArray(src0, input, offset);
        hashObjectToByteArray(src1, input, offset + 32);
        output.push(dest);
      }

      const result: Uint8Array = hash(input);

      for (const [i, out] of output.entries()) {
        const offset = i * 32;
        out.applyHash(byteArrayToHashObject(result.slice(offset, offset + 32)));
      }
    }
  },
};
