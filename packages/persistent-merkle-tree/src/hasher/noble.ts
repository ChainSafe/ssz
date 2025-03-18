import {byteArrayIntoHashObject, digest64HashObjects} from "@chainsafe/as-sha256";
import {sha256} from "@noble/hashes/sha256";
import type {Hasher} from "./types.js";
import {
  BLOCK_SIZE,
  doDigestNLevel,
  doMerkleizeBlockArray,
  doMerkleizeBlocksBytes,
  hashObjectToUint8Array,
} from "./util.js";

const digest64 = (a: Uint8Array, b: Uint8Array): Uint8Array => sha256.create().update(a).update(b).digest();
const hashInto = (input: Uint8Array, output: Uint8Array): void => {
  if (input.length % 64 !== 0) {
    throw new Error(`Invalid input length ${input.length}`);
  }
  if (input.length !== output.length * 2) {
    throw new Error(`Invalid output length ${output.length}`);
  }

  const count = Math.floor(input.length / 64);
  for (let i = 0; i < count; i++) {
    const offset = i * 64;
    const in1 = input.subarray(offset, offset + 32);
    const in2 = input.subarray(offset + 32, offset + 64);
    const out = digest64(in1, in2);
    output.set(out, i * 32);
  }
};

/** should be multiple of 64, make it the same to as-sha256 */
const buffer = new Uint8Array(4 * BLOCK_SIZE);

export const hasher: Hasher = {
  name: "noble",
  digest64,
  digest64HashObjects: (left, right, parent) => {
    byteArrayIntoHashObject(digest64(hashObjectToUint8Array(left), hashObjectToUint8Array(right)), 0, parent);
  },
  merkleizeBlocksBytes(blocksBytes: Uint8Array, padFor: number, output: Uint8Array, offset: number): void {
    doMerkleizeBlocksBytes(blocksBytes, padFor, output, offset, hashInto);
  },
  merkleizeBlockArray(blocks, blockLimit, padFor, output, offset) {
    doMerkleizeBlockArray(blocks, blockLimit, padFor, output, offset, hashInto, buffer);
  },
  digestNLevel(data: Uint8Array, nLevel: number): Uint8Array {
    return doDigestNLevel(data, nLevel, hashInto);
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
