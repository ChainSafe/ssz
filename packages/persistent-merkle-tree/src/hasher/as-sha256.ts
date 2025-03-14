import {
  batchHash4HashObjectInputs,
  digest2Bytes32,
  digest64HashObjects,
  digest64HashObjectsInto,
  hashInto,
} from "@chainsafe/as-sha256";
import type {HashComputationLevel} from "../hashComputation.js";
import {Node} from "../node.js";
import type {Hasher} from "./types.js";
import {BLOCK_SIZE, doDigestNLevel, doMerkleizeBlockArray, doMerkleizeBlocksBytes} from "./util.js";

/**
 * hashInto() function of as-sha256 loop through every 256 bytes
 * This is the same to hashInto() function of as-sha256 https://github.com/ChainSafe/ssz/blob/cf3e1f038c8bf7cba1bb27c38540e50b0391d0e6/packages/as-sha256/src/index.ts#L270
 */
const buffer = new Uint8Array(4 * BLOCK_SIZE);

export const hasher: Hasher = {
  name: "as-sha256",
  digest64: digest2Bytes32,
  digest64HashObjects: digest64HashObjectsInto,
  merkleizeBlocksBytes(blocksBytes: Uint8Array, padFor: number, output: Uint8Array, offset: number): void {
    return doMerkleizeBlocksBytes(blocksBytes, padFor, output, offset, hashInto);
  },
  merkleizeBlockArray(blocks, blockLimit, padFor, output, offset) {
    return doMerkleizeBlockArray(blocks, blockLimit, padFor, output, offset, hashInto, buffer);
  },
  digestNLevel(data: Uint8Array, nLevel: number): Uint8Array {
    return doDigestNLevel(data, nLevel, hashInto);
  },
  executeHashComputations: (hashComputations: HashComputationLevel[]) => {
    for (let level = hashComputations.length - 1; level >= 0; level--) {
      const hcArr = hashComputations[level];
      if (!hcArr) {
        // should not happen
        throw Error(`no hash computations for level ${level}`);
      }

      if (hcArr.length === 0) {
        // nothing to hash
        continue;
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

      let i = 0;
      for (const hc of hcArr) {
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
        i++;
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
