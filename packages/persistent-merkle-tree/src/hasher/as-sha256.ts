import {digest2Bytes32, digest64HashObjects, HashObject, batchHash4HashObjectInputs} from "@chainsafe/as-sha256";
import type {Hasher} from "./types";
import {HashComputation, Node} from "../node";

export const hasher: Hasher = {
  digest64: digest2Bytes32,
  digest64HashObjects,
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
      let dest_0: Node | null = null;
      let src0_1: Node | null = null;
      let src1_1: Node | null = null;
      let dest_1: Node | null = null;
      let src0_2: Node | null = null;
      let src1_2: Node | null = null;
      let dest_2: Node | null = null;
      let src0_3: Node | null = null;
      let src1_3: Node | null = null;
      let dest_3: Node | null = null;

      for (const [i, hc] of hcArr.entries()) {
        const indexInBatch = i % 4;
        switch (indexInBatch) {
          case 0:
            src0_0 = hc.src0;
            src1_0 = hc.src1;
            dest_0 = hc.dest;
            break;
          case 1:
            src0_1 = hc.src0;
            src1_1 = hc.src1;
            dest_1 = hc.dest;
            break;
          case 2:
            src0_2 = hc.src0;
            src1_2 = hc.src1;
            dest_2 = hc.dest;
            break;
          case 3:
            src0_3 = hc.src0;
            src1_3 = hc.src1;
            dest_3 = hc.dest;
            break;
          default:
            throw Error(`Unexpected indexInBatch ${indexInBatch}`);
        }

        if (
          indexInBatch === 3 &&
          src0_0 !== null &&
          src1_0 !== null &&
          dest_0 !== null &&
          src0_1 !== null &&
          src1_1 !== null &&
          dest_1 !== null &&
          src0_2 !== null &&
          src1_2 !== null &&
          dest_2 !== null &&
          src0_3 !== null &&
          src1_3 !== null &&
          dest_3 !== null
        ) {
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
            throw Error(`batchHash4HashObjectInputs return null at batch ${i} level ${level}`);
          }
          dest_0.applyHash(o0);
          dest_1.applyHash(o1);
          dest_2.applyHash(o2);
          dest_3.applyHash(o3);

          src0_0 = null;
          src1_0 = null;
          dest_0 = null;
          src0_1 = null;
          src1_1 = null;
          dest_1 = null;
          src0_2 = null;
          src1_2 = null;
          dest_2 = null;
          src0_3 = null;
          src1_3 = null;
          dest_3 = null;
        }
      }

      // remaining
      if (src0_0 !== null && src1_0 !== null && dest_0 !== null) {
        dest_0.applyHash(digest64HashObjects(src0_0, src1_0));
      }
      if (src0_1 !== null && src1_1 !== null && dest_1 !== null) {
        dest_1.applyHash(digest64HashObjects(src0_1, src1_1));
      }
      if (src0_2 !== null && src1_2 !== null && dest_2 !== null) {
        dest_2.applyHash(digest64HashObjects(src0_2, src1_2));
      }
      if (src0_3 !== null && src1_3 !== null && dest_3 !== null) {
        dest_3.applyHash(digest64HashObjects(src0_3, src1_3));
      }
    }
  },
};
