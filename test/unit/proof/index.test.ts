import {expect} from "chai";
import {describe, it} from "mocha";
import {createNodeFromProof, createProof, deserializeProof, ProofType, serializeProof} from "../../../src/proof";
import {Node, LeafNode, BranchNode} from "../../../src/node";

// Create a tree with leaves of different values
function createTree(depth: number, index = 0): Node {
  if (!depth) {
    return new LeafNode(Buffer.alloc(32, index));
  }
  return new BranchNode(createTree(depth - 1, 2 ** depth + index), createTree(depth - 1, 2 ** depth + index + 1));
}

describe("proof equivalence", () => {
  it("should compute the same root from different proof types", () => {
    const node = createTree(6);
    const allProofTestCases = Array.from({length: 62}, (_, i) => BigInt(i + 2));
    for (const gindex of allProofTestCases) {
      const singleProof = createProof(node, {type: ProofType.single, gindex});
      const treeOffsetProof = createProof(node, {type: ProofType.treeOffset, gindices: [gindex]});
      expect(createNodeFromProof(singleProof).root).to.deep.equal(createNodeFromProof(treeOffsetProof).root);
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
