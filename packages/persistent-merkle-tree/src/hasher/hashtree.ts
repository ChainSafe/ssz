import {hashInto} from "@chainsafe/hashtree";
import {Hasher, HashObject} from "./types";
import {HashComputation, Node} from "../node";
import { byteArrayToHashObject } from "@chainsafe/as-sha256";

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
// having this will cause more memory to extract uint32
// const uint32Output = new Uint32Array(uint8Output.buffer);
// convenient reusable Uint8Array for hash64
const hash64Input = uint8Input.subarray(0, 64);
const hash64Output = uint8Output.subarray(0, 32);

export const hasher: Hasher = {
  name: "hashtree",
  digest64(obj1: Uint8Array, obj2: Uint8Array): Uint8Array {
    if (obj1.length !== 32 || obj2.length !== 32) {
      throw new Error("Invalid input length");
    }
    hash64Input.set(obj1, 0);
    hash64Input.set(obj2, 32);
    hashInto(hash64Input, hash64Output);
    return hash64Output.slice();
  },
  digest64HashObjects(obj1: HashObject, obj2: HashObject): HashObject {
    hashObjectsToUint32Array(obj1, obj2, uint32Input);
    hashInto(hash64Input, hash64Output);
    return byteArrayToHashObject(hash64Output);
  },
  // given nLevel = 3
  // digest multiple of 8 chunks = 256 bytes
  // the result is multiple of 1 chunk = 32 bytes
  // this is the same to hashTreeRoot() of multiple validators
  // TODO - batch: data, offset, length to avoid subarray call
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

    uint8Input.set(data, 0);
    // hash into same buffer
    let bufferIn = uint8Input.subarray(0, inputLength);
    for (let i = nLevel; i > 0; i--) {
      const bufferOut = bufferIn.subarray(0, outputLength);
      hashInto(bufferIn, bufferOut);
      bufferIn = bufferOut;
      inputLength = outputLength;
      outputLength = Math.floor(inputLength / 2);
    }

    // the result is unsafe as it will be modified later, consumer should save the result if needed
    return bufferIn;
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
          outHashObjects.push(byteArrayToHashObject(uint8Output.subarray(j * 32, (j + 1) * 32)));
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
        outHashObjects.push(byteArrayToHashObject(remainingOutput.subarray(i * 32, (i + 1) * 32)));
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
            destNode.applyHash(byteArrayToHashObject(uint8Output.subarray(j * 32, (j + 1) * 32)));
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
          destNode.applyHash(byteArrayToHashObject(remainingOutput.subarray(i * 32, (i + 1) * 32)));
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

// note that uint32ArrayToHashObject will cause more memory
function hashObjectsToUint32Array(obj1: HashObject, obj2: HashObject, arr: Uint32Array): void {
  arr[0] = obj1.h0;
  arr[1] = obj1.h1;
  arr[2] = obj1.h2;
  arr[3] = obj1.h3;
  arr[4] = obj1.h4;
  arr[5] = obj1.h5;
  arr[6] = obj1.h6;
  arr[7] = obj1.h7;
  arr[8] = obj2.h0;
  arr[9] = obj2.h1;
  arr[10] = obj2.h2;
  arr[11] = obj2.h3;
  arr[12] = obj2.h4;
  arr[13] = obj2.h5;
  arr[14] = obj2.h6;
  arr[15] = obj2.h7;
}