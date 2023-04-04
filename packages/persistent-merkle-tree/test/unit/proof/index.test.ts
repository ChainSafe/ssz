import {expect} from "chai";
import {describe, it} from "mocha";
import {
  computeDescriptor,
  createNodeFromProof,
  createProof,
  deserializeProof,
  ProofType,
  serializeProof,
} from "../../../src/proof";
import {createTree} from "../../utils/tree";

describe("proof equivalence", () => {
  it("should compute the same root from different proof types - single leaf", () => {
    const node = createTree(6);
    const allProofTestCases = Array.from({length: 62}, (_, i) => BigInt(i + 2));
    for (const gindex of allProofTestCases) {
      const singleProof = createProof(node, {type: ProofType.single, gindex});
      const treeOffsetProof = createProof(node, {type: ProofType.treeOffset, gindices: [gindex]});
      const multiProof = createProof(node, {type: ProofType.multi, gindices: [gindex]});
      const compactMultiProof = createProof(node, {
        type: ProofType.compactMulti,
        descriptor: computeDescriptor([gindex]),
      });
      expect(node.root).to.deep.equal(createNodeFromProof(singleProof).root);
      expect(node.root).to.deep.equal(createNodeFromProof(treeOffsetProof).root);
      expect(node.root).to.deep.equal(createNodeFromProof(multiProof).root);
      expect(node.root).to.deep.equal(createNodeFromProof(compactMultiProof).root);
    }
  });
  it("should compute the same root from different proof types - multiple leaves", function () {
    this.timeout(10_000);
    const depth = 6;
    const maxIndex = 2 ** depth;
    const node = createTree(depth);
    const allGindices = Array.from({length: maxIndex}, (_, i) => BigInt(i));
    // Try many combinations of up to 4 leaves
    // For speed, don't try _every_ combination and only test with leaves in the bottom layer
    for (let i = 2 ** (depth - 1); i < maxIndex; i++) {
      for (let j = i + 1; j < maxIndex; j += 2) {
        for (let k = j + 1; k < maxIndex; k += 3) {
          for (let l = k + 1; l < maxIndex; l += 4) {
            const selectedGindices = [allGindices[i], allGindices[j], allGindices[k], allGindices[l]];
            // try 2, 3, 4 leaves
            for (let m = 2; m <= 4; m++) {
              const gindices = selectedGindices.slice(0, m);

              const treeOffsetProof = createProof(node, {type: ProofType.treeOffset, gindices});
              const multiProof = createProof(node, {type: ProofType.multi, gindices});
              const compactMultiProof = createProof(node, {
                type: ProofType.compactMulti,
                descriptor: computeDescriptor(gindices),
              });

              expect(node.root).to.deep.equal(createNodeFromProof(treeOffsetProof).root);
              expect(node.root).to.deep.equal(createNodeFromProof(multiProof).root);
              expect(node.root).to.deep.equal(createNodeFromProof(compactMultiProof).root);
            }
          }
        }
      }
    }
  });
});

describe("proof serialize/deserialize", () => {
  it("should round trip", () => {
    const node = createTree(6);
    const expected = createProof(node, {type: ProofType.treeOffset, gindices: [BigInt(7), BigInt(8), BigInt(15)]});
    const actual = deserializeProof(serializeProof(expected));
    expect(actual).to.deep.equal(expected);
  });
});
