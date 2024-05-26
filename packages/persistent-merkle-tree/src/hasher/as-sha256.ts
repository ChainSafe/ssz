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
        const outs = batchHash4HashObjectInputs([
          hcArr[index].src0,
          hcArr[index].src1,
          hcArr[index + 1].src0,
          hcArr[index + 1].src1,
          hcArr[index + 2].src0,
          hcArr[index + 2].src1,
          hcArr[index + 3].src0,
          hcArr[index + 3].src1,
        ]);
        if (outs.length !== 4) {
          throw Error(`batchHash4HashObjectInputs returned ${outs.length} outputs, expected 4`);
        }
        hcArr[index].dest.applyHash(outs[0]);
        hcArr[index + 1].dest.applyHash(outs[1]);
        hcArr[index + 2].dest.applyHash(outs[2]);
        hcArr[index + 3].dest.applyHash(outs[3]);
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
