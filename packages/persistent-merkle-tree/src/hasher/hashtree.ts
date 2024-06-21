import {hash, hashInto} from "@chainsafe/hashtree";
import {Hasher, HashObject} from "./types";
import {HashComputation, Node} from "../node";
import { byteArrayToHashObject, hashObjectToByteArray } from "@chainsafe/as-sha256";

/**
 * Best SIMD implementation is in 512 bits = 64 bytes
 * If not, hashtree will make a loop inside
 * Given sha256 operates on a block of 4 bytes, we can hash 16 inputs at once
 * Each input is 64 bytes
 */
const PARALLEL_FACTOR = 16;
const MAX_INPUT_SIZE = PARALLEL_FACTOR * 64;
const uint8Input = new Uint8Array(MAX_INPUT_SIZE);
const uint32Input = new Uint32Array(uint8Input.buffer);
const uint8Output = new Uint8Array(PARALLEL_FACTOR * 32);
const uint32Output = new Uint32Array(uint8Output.buffer);


export const hasher: Hasher = {
  name: "hashtree",
  digest64(obj1: Uint8Array, obj2: Uint8Array): Uint8Array {
    if (obj1.length !== 32 || obj2.length !== 32) {
      throw new Error("Invalid input length");
    }
    uint8Input.set(obj1, 0);
    uint8Input.set(obj2, 32);
    const hashInput = uint8Input.subarray(0, 64);
    const hashOutput = uint8Output.subarray(0, 32);
    hashInto(hashInput, hashOutput);
    return hashOutput.slice();
  },
  digest64HashObjects(obj1: HashObject, obj2: HashObject): HashObject {
    hashObjectToUint32Array(obj1, uint32Input, 0);
    hashObjectToUint32Array(obj2, uint32Input, 8);
    const hashInput = uint8Input.subarray(0, 64);
    const hashOutput = uint8Output.subarray(0, 32);
    hashInto(hashInput, hashOutput);
    return uint32ArrayToHashObject(uint32Output, 0);
  },
  // given nLevel = 3
  // digest multiple of 8 chunks = 256 bytes
  // the result is multiple of 1 chunk = 32 bytes
  // this is the same to hashTreeRoot() of multiple validators
  digestNLevelUnsafe(data: Uint8Array, nLevel: number): Uint8Array {
    let inputLength = data.length;
    const bytesInBatch = Math.pow(2, nLevel) * 32;
    if (nLevel < 1) {
      throw new Error(`Invalid nLevel, expect to be greater than 0, got ${nLevel}`);
    }
    if (inputLength % bytesInBatch !== 0) {
      throw new Error(`Invalid input length, expect to be multiple of ${bytesInBatch} for nLevel ${nLevel}, got ${inputLength}`);
    }
    if (inputLength > MAX_INPUT_SIZE) {
      throw new Error(`Invalid input length, expect to be less than ${MAX_INPUT_SIZE}, got ${inputLength}`);
    }

    let outputLength = Math.floor(inputLength / 2);
    let hashOutput: Uint8Array | null = null;
    for (let i = nLevel; i > 0; i--) {
      uint8Input.set(hashOutput ?? data, 0);
      const hashInput = uint8Input.subarray(0, inputLength);
      hashOutput = uint8Output.subarray(0, outputLength);
      hashInto(hashInput, hashOutput);
      inputLength = outputLength;
      outputLength = Math.floor(inputLength / 2);
    }

    if (hashOutput === null) {
      throw new Error("hashOutput is null");
    }
    // the result is unsafe as it will be modified later, consumer should save the result if needed
    return hashOutput;
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
      hashObjectToUint32Array(hashInput, uint32Input, indexInBatch * 8);
      if (indexInBatch === batch - 1) {
        hashInto(uint8Input, uint8Output);
        for (let j = 0; j < batch / 2; j++) {
          outHashObjects.push(uint32ArrayToHashObject(uint32Output, j * 8));
        }
      }
    }

    // hash remaining
    const remaining = inputs.length % batch;
    if (remaining > 0) {
      const remainingInput = uint8Input.subarray(0, remaining * 32);
      const remainingOutput = uint8Output.subarray(0, remaining * 16);
      hashInto(remainingInput, remainingOutput);
      for (let i = 0; i < remaining / 2; i++) {
        outHashObjects.push(uint32ArrayToHashObject(uint32Output, i * 8));
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
        const offset = indexInBatch * 16;

        hashObjectToUint32Array(src0, uint32Input, offset);
        hashObjectToUint32Array(src1, uint32Input, offset + 8);
        destNodes.push(dest);
        if (indexInBatch === PARALLEL_FACTOR - 1) {
          hashInto(uint8Input, uint8Output);
          for (const [j, destNode] of destNodes.entries()) {
            const outputOffset = j * 8;
            destNode.applyHash(uint32ArrayToHashObject(uint32Output, outputOffset));
          }
          destNodes = [];
        }
      }

      const remaining = hcArr.length % PARALLEL_FACTOR;
      // we prepared data in input, now hash the remaining
      if (remaining > 0) {
        const remainingInput = uint8Input.subarray(0, remaining * 64);
        const remainingOutput = uint8Output.subarray(0, remaining * 32);
        hashInto(remainingInput, remainingOutput);
        // destNodes was prepared above
        for (const [i, destNode] of destNodes.entries()) {
          const offset = i * 8;
          destNode.applyHash(uint32ArrayToHashObject(uint32Output, offset));
        }
      }
    }
  },
};

function hashObjectToUint32Array(obj: HashObject, arr: Uint32Array, offset: number): void {
  arr[offset] = obj.h0;
  arr[offset + 1] = obj.h1;
  arr[offset + 2] = obj.h2;
  arr[offset + 3] = obj.h3;
  arr[offset + 4] = obj.h4;
  arr[offset + 5] = obj.h5;
  arr[offset + 6] = obj.h6;
  arr[offset + 7] = obj.h7;
}

function uint32ArrayToHashObject(arr: Uint32Array, offset: number): HashObject {
  return {
    h0: arr[offset],
    h1: arr[offset + 1],
    h2: arr[offset + 2],
    h3: arr[offset + 3],
    h4: arr[offset + 4],
    h5: arr[offset + 5],
    h6: arr[offset + 6],
    h7: arr[offset + 7],
  };
}
