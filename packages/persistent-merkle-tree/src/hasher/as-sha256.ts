import {digest2Bytes32, digest64HashObjects, HashObject, batchHash4HashObjectInputs} from "@chainsafe/as-sha256";
import type {Hasher} from "./types";

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
      const [out0, out1, out2, out3] = batchHash4HashObjectInputs(inputs.slice(i * 8, i * 8 + 8));
      outputs.push(out0, out1, out2, out3);
    }

    for (let i = batch * 8; i < inputs.length; i += 2) {
      const output = digest64HashObjects(inputs[i], inputs[i + 1]);
      outputs.push(output);
    }

    return outputs;
  },
};
