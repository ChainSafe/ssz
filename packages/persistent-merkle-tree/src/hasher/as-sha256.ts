import {digest2Bytes32, digest64HashObjects, HashObject, batchHash4HashObjectInputs} from "@chainsafe/as-sha256";
import type {Hasher} from "./types";
import {HashComputation} from "../node";

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
      const batch = Math.floor(hcArr.length / 4);
      for (let i = 0; i < batch; i++) {
        const index = i * 4;
        // access array once
        const {src0: src0_0, src1: src1_0, dest: dest_0} = hcArr[index];
        const {src0: src0_1, src1: src1_1, dest: dest_1} = hcArr[index + 1];
        const {src0: src0_2, src1: src1_2, dest: dest_2} = hcArr[index + 2];
        const {src0: src0_3, src1: src1_3, dest: dest_3} = hcArr[index + 3];

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
      }

      // remaining
      for (let i = batch * 4; i < hcArr.length; i++) {
        const {src0, src1, dest} = hcArr[i];
        const output = digest64HashObjects(src0, src1);
        dest.applyHash(output);
      }
    }
  },
};
