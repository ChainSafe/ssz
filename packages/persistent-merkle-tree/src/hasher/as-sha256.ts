import {
  digest2Bytes32,
  digest64HashObjectsInto,
  digest64HashObjects,
  HashObject,
  batchHash4HashObjectInputs,
  hashInto,
} from "@chainsafe/as-sha256";
import type {Hasher} from "./types";
import {HashComputation, Node} from "../node";
import {merkleize} from "./util";

// each validator needs to digest 8 chunks of 32 bytes = 4 hashes
// support up to 4 validators
const MAX_HASH = 16;
const MAX_INPUT_SIZE = MAX_HASH * 64;
const buffer = new Uint8Array(MAX_INPUT_SIZE);

export const hasher: Hasher = {
  name: "as-sha256",
  digest64: digest2Bytes32,
  digest64HashObjects: digest64HashObjectsInto,
  // TODO - batch: deduplicate with hashtree
  merkleizeInto(data: Uint8Array, padFor: number, output: Uint8Array, offset: number): void {
    return merkleize(data, padFor, output, offset, hashInto);
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
      throw new Error(
        `Invalid input length, expect to be multiple of ${bytesInBatch} for nLevel ${nLevel}, got ${inputLength}`
      );
    }
    if (inputLength > MAX_INPUT_SIZE) {
      throw new Error(`Invalid input length, expect to be less than ${MAX_INPUT_SIZE}, got ${inputLength}`);
    }

    buffer.set(data, 0);
    for (let i = nLevel; i > 0; i--) {
      const outputLength = Math.floor(inputLength / 2);
      const hashInput = buffer.subarray(0, inputLength);
      const hashOutput = buffer.subarray(0, outputLength);
      hashInto(hashInput, hashOutput);
      inputLength = outputLength;
    }

    // the result is unsafe as it will be modified later, consumer should save the result if needed
    return buffer.subarray(0, inputLength);
  },
  batchHashObjects: (inputs: HashObject[]) => {
    // as-sha256 uses SIMD for batch hash
    if (inputs.length === 0) {
      return [];
    } else if (inputs.length % 2 !== 0) {
      throw new Error(`Expect inputs.length to be even, got ${inputs.length}`);
    }

    const batch = Math.floor(inputs.length / 8);
    const outputs = new Array<HashObject>();
    for (let i = 0; i < batch; i++) {
      const outs = batchHash4HashObjectInputs(inputs.slice(i * 8, i * 8 + 8));
      outputs.push(...outs);
    }

    for (let i = batch * 8; i < inputs.length; i += 2) {
      const output = digest64HashObjects(inputs[i], inputs[i + 1]);
      outputs.push(output);
    }

    return outputs;
  },
  executeHashComputations: (hashComputations: Array<HashComputation[]>) => {
    for (let level = hashComputations.length - 1; level >= 0; level--) {
      const hcArr = hashComputations[level];
      if (!hcArr) {
        // should not happen
        throw Error(`no hash computations for level ${level}`);
      }

      // HashComputations of the same level are safe to batch
      let src0_0: Node | null = null;
      let src1_0: Node | null = null;
      let dest0: Node | null = null;
      let src0_1: Node | null = null;
      let src1_1: Node | null = null;
      let dest1: Node | null = null;
      let src0_2: Node | null = null;
      let src1_2: Node | null = null;
      let dest2: Node | null = null;
      let src0_3: Node | null = null;
      let src1_3: Node | null = null;
      let dest3: Node | null = null;

      for (const [i, hc] of hcArr.entries()) {
        const indexInBatch = i % 4;

        switch (indexInBatch) {
          case 0:
            src0_0 = hc.src0;
            src1_0 = hc.src1;
            dest0 = hc.dest;
            break;
          case 1:
            src0_1 = hc.src0;
            src1_1 = hc.src1;
            dest1 = hc.dest;
            break;
          case 2:
            src0_2 = hc.src0;
            src1_2 = hc.src1;
            dest2 = hc.dest;
            break;
          case 3:
            src0_3 = hc.src0;
            src1_3 = hc.src1;
            dest3 = hc.dest;

            if (
              src0_0 !== null &&
              src1_0 !== null &&
              dest0 !== null &&
              src0_1 !== null &&
              src1_1 !== null &&
              dest1 !== null &&
              src0_2 !== null &&
              src1_2 !== null &&
              dest2 !== null &&
              src0_3 !== null &&
              src1_3 !== null &&
              dest3 !== null
            ) {
              // TODO - batch: find a way not allocate here
              const [o0, o1, o2, o3] = batchHash4HashObjectInputs([
                src0_0,
                src1_0,
                src0_1,
                src1_1,
                src0_2,
                src1_2,
                src0_3,
                src1_3,
              ]);
              if (o0 == null || o1 == null || o2 == null || o3 == null) {
                throw Error(`batchHash4HashObjectInputs return null or undefined at batch ${i} level ${level}`);
              }
              dest0.applyHash(o0);
              dest1.applyHash(o1);
              dest2.applyHash(o2);
              dest3.applyHash(o3);

              // reset for next batch
              src0_0 = null;
              src1_0 = null;
              dest0 = null;
              src0_1 = null;
              src1_1 = null;
              dest1 = null;
              src0_2 = null;
              src1_2 = null;
              dest2 = null;
              src0_3 = null;
              src1_3 = null;
              dest3 = null;
            }
            break;
          default:
            throw Error(`Unexpected indexInBatch ${indexInBatch}`);
        }
      }

      // remaining
      if (src0_0 !== null && src1_0 !== null && dest0 !== null) {
        dest0.applyHash(digest64HashObjects(src0_0, src1_0));
      }
      if (src0_1 !== null && src1_1 !== null && dest1 !== null) {
        dest1.applyHash(digest64HashObjects(src0_1, src1_1));
      }
      if (src0_2 !== null && src1_2 !== null && dest2 !== null) {
        dest2.applyHash(digest64HashObjects(src0_2, src1_2));
      }
      if (src0_3 !== null && src1_3 !== null && dest3 !== null) {
        dest3.applyHash(digest64HashObjects(src0_3, src1_3));
      }
    }
  },
};
