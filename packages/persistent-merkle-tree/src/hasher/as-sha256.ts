import {HashObject, AssemblyScriptSha256Hasher} from "@chainsafe/as-sha256";
import type {Hasher} from "./types.js";
import {Node} from "../node.js";
import type {HashComputationLevel} from "../hashComputation.js";
import {BLOCK_SIZE, doDigestNLevel, doMerkleizeBlockArray, doMerkleizeBlocksBytes} from "./util.js";

let sha256: undefined | AssemblyScriptSha256Hasher;
/**
 * hashInto() function of as-sha256 loop through every 256 bytes
 * This is the same to hashInto() function of as-sha256 https://github.com/ChainSafe/ssz/blob/cf3e1f038c8bf7cba1bb27c38540e50b0391d0e6/packages/as-sha256/src/index.ts#L270
 */
const buffer = new Uint8Array(4 * BLOCK_SIZE);

export const hasher: Hasher = {
  name: "as-sha256",
  async initialize() {
    sha256 = await AssemblyScriptSha256Hasher.initialize();
  },
  digest64(a32Bytes: Uint8Array, b32Bytes: Uint8Array): Uint8Array {
    if (!sha256) {
      throw new Error("Must initialize AssemblyScriptSha256Hasher before use");
    }
    return sha256.digest2Bytes32(a32Bytes, b32Bytes);
  },
  digest64HashObjects(left: HashObject, right: HashObject, parent: HashObject): void {
    if (!sha256) {
      throw new Error("Must initialize AssemblyScriptSha256Hasher before use");
    }
    return sha256.digest64HashObjectsInto(left, right, parent);
  },
  merkleizeBlocksBytes(blocksBytes: Uint8Array, padFor: number, output: Uint8Array, offset: number): void {
    if (!sha256) {
      throw new Error("Must initialize AssemblyScriptSha256Hasher before use");
    }
    return doMerkleizeBlocksBytes(blocksBytes, padFor, output, offset, sha256.hashInto.bind(sha256));
  },
  merkleizeBlockArray(blocks, blockLimit, padFor, output, offset) {
    if (!sha256) {
      throw new Error("Must initialize AssemblyScriptSha256Hasher before use");
    }
    return doMerkleizeBlockArray(blocks, blockLimit, padFor, output, offset, sha256.hashInto.bind(sha256), buffer);
  },
  digestNLevel(data: Uint8Array, nLevel: number): Uint8Array {
    if (!sha256) {
      throw new Error("Must initialize AssemblyScriptSha256Hasher before use");
    }
    return doDigestNLevel(data, nLevel, sha256.hashInto.bind(sha256));
  },
  executeHashComputations: (hashComputations: HashComputationLevel[]) => {
    if (!sha256) {
      throw new Error("Must initialize AssemblyScriptSha256Hasher before use");
    }
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
              const [o0, o1, o2, o3] = sha256.batchHash4HashObjectInputs([
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
        dest0.applyHash(sha256.digest64HashObjects(src0_0, src1_0));
      }
      if (src0_1 !== null && src1_1 !== null && dest1 !== null) {
        dest1.applyHash(sha256.digest64HashObjects(src0_1, src1_1));
      }
      if (src0_2 !== null && src1_2 !== null && dest2 !== null) {
        dest2.applyHash(sha256.digest64HashObjects(src0_2, src1_2));
      }
      if (src0_3 !== null && src1_3 !== null && dest3 !== null) {
        dest3.applyHash(sha256.digest64HashObjects(src0_3, src1_3));
      }
    }
  },
};
