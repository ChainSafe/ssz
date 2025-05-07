import {bench, describe} from "@chainsafe/benchmark";
import {ProofType, computeDescriptor, createProof} from "../../src/proof/index.ts";
import {createTree} from "../utils/tree.ts";

describe("Proofs", () => {
  const depth = 15;
  const tree = createTree(depth);
  const maxNumLeaves = 10;
  const allLeafIndices = Array.from(
    {length: maxNumLeaves},
    (_, i) => BigInt(2) ** BigInt(depth) + BigInt(i) ** BigInt(2)
  );
  for (let numLeaves = 1; numLeaves < 5; numLeaves++) {
    const leafIndices = allLeafIndices.slice(0, numLeaves);

    bench({
      id: `multiproof - depth ${depth}, ${numLeaves} requested leaves`,
      fn: () => {
        createProof(tree, {type: ProofType.multi, gindices: leafIndices});
      },
    });

    bench({
      id: `tree offset multiproof - depth ${depth}, ${numLeaves} requested leaves`,
      fn: () => {
        createProof(tree, {type: ProofType.treeOffset, gindices: leafIndices});
      },
    });

    bench({
      id: `compact multiproof - depth ${depth}, ${numLeaves} requested leaves`,
      beforeEach: () => {
        return computeDescriptor(leafIndices);
      },
      fn: (descriptor) => {
        createProof(tree, {type: ProofType.compactMulti, descriptor});
      },
    });
  }
});
