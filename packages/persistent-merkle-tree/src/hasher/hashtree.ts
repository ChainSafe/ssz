import {hashInto} from "@chainsafe/hashtree";
import {byteArrayToHashObject, hashObjectToByteArray} from "@chainsafe/as-sha256";
import {Hasher, HashObject} from "./types";
import {HashComputation, Node} from "../node";

/**
 * Best SIMD implementation is in 512 bits = 64 bytes
 * If not, hashtree will make a loop inside
 * Given sha256 operates on a block of 4 bytes, we can hash 16 inputs at once
 * Each input is 64 bytes
 */
const PARALLEL_FACTOR = 16;
const input = new Uint8Array(PARALLEL_FACTOR * 64);
const output = new Uint8Array(PARALLEL_FACTOR * 32);

export const hasher: Hasher = {
  name: "hashtree",
  digest64(obj1: Uint8Array, obj2: Uint8Array): Uint8Array {
    // return hash(Buffer.concat([obj1, obj2], 64));
    if (obj1.length !== 32 || obj2.length !== 32) {
      throw new Error("Invalid input length");
    }
    input.set(obj1, 0);
    input.set(obj2, 32);
    const hashInput = input.subarray(0, 64);
    const hashOutput = output.subarray(0, 32);
    hashInto(hashInput, hashOutput);
    return hashOutput.slice();
  },
  digest64HashObjects(obj1: HashObject, obj2: HashObject): HashObject {
    hashObjectToByteArray(obj1, input, 0);
    hashObjectToByteArray(obj2, input, 32);
    const hashInput = input.subarray(0, 64);
    const hashOutput = output.subarray(0, 32);
    hashInto(hashInput, hashOutput);
    return byteArrayToHashObject(hashOutput);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  batchHashObjects(inputs: HashObject[]): HashObject[] {
    if (inputs.length === 0) {
      return [];
    }
    if (inputs.length % 2 !== 0) {
      throw new Error("inputs length must be even");
    }

    const batch = PARALLEL_FACTOR * 2;
    const outHashObjects: HashObject[] = [];
    for (const [i, hashInput] of inputs.entries()) {
      const indexInBatch = i % batch;
      hashObjectToByteArray(hashInput, input, indexInBatch * 32);
      if (indexInBatch === batch - 1) {
        hashInto(input, output);
        for (let j = 0; j < batch / 2; j++) {
          outHashObjects.push(byteArrayToHashObject(output.subarray(j * 32, j * 32 + 32)));
        }
      }
    }

    // hash remaining
    const remaining = inputs.length % batch;
    if (remaining > 0) {
      const remainingInput = input.subarray(0, remaining * 32);
      const remainingOutput = output.subarray(0, remaining * 16);
      hashInto(remainingInput, remainingOutput);
      for (let i = 0; i < remaining / 2; i++) {
        outHashObjects.push(byteArrayToHashObject(remainingOutput.subarray(i * 32, i * 32 + 32)));
      }
    }

    return outHashObjects;
  },
  executeHashComputations(hashComputations: Array<HashComputation[]>): void {
    for (let level = hashComputations.length - 1; level >= 0; level--) {
      const hcArr = hashComputations[level];
      if (!hcArr) {
        // should not happen
        throw Error(`no hash computations for level ${level}`);
      }

      // size input array to 2 HashObject per computation * 32 bytes per object
      // const input: Uint8Array = Uint8Array.from(new Array(hcArr.length * 2 * 32));
      let destNodes: Node[] = [];

      // hash every 16 inputs at once to avoid memory allocation
      for (const [i, {src0, src1, dest}] of hcArr.entries()) {
        const indexInBatch = i % PARALLEL_FACTOR;
        const offset = indexInBatch * 64;
        hashObjectToByteArray(src0, input, offset);
        hashObjectToByteArray(src1, input, offset + 32);
        destNodes.push(dest);
        if (indexInBatch === PARALLEL_FACTOR - 1) {
          hashInto(input, output);
          for (const [j, destNode] of destNodes.entries()) {
            const outputOffset = j * 32;
            destNode.applyHash(byteArrayToHashObject(output.subarray(outputOffset, outputOffset + 32)));
          }
          destNodes = [];
        }
      }

      const remaining = hcArr.length % PARALLEL_FACTOR;
      // we prepared data in input, now hash the remaining
      if (remaining > 0) {
        const remainingInput = input.subarray(0, remaining * 64);
        const remainingOutput = output.subarray(0, remaining * 32);
        hashInto(remainingInput, remainingOutput);
        // destNodes was prepared above
        for (const [i, destNode] of destNodes.entries()) {
          const offset = i * 32;
          destNode.applyHash(byteArrayToHashObject(remainingOutput.subarray(offset, offset + 32)));
        }
      }
    }
  },
};
