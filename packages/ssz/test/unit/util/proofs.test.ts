import {describe, expect, it} from "vitest";
import {BitListType, BitVectorType, ContainerType} from "../../../src/index.ts";

/** Pick bitLen to fill 2 nodes */
const bitLen2Nodes = 8 * 32 * 2;

describe("Proofs / Stop navigating into some types", () => {
  for (const bitArrayType of [new BitVectorType(bitLen2Nodes), new BitListType(bitLen2Nodes)])
    it(`${bitArrayType.typeName} - should return proof of all`, () => {
      const bitVectorContainerType = new ContainerType({a: bitArrayType});
      const bitVectorContainerView = bitVectorContainerType.defaultViewDU();

      const proofAll = bitVectorContainerView.createProof([["a"]]);
      const proofOneBit = bitVectorContainerView.createProof([["a", 1]]);
      expect(proofAll).deep.equals(proofOneBit);
    });
});

describe("Proofs / pass rootNode parameter for variable size", () => {
  it("BitListType", () => {
    const bitArrayType = new BitListType(bitLen2Nodes);
    expect(() => bitArrayType.tree_getLeafGindices(0n), "Variable size types require rootNode").toThrow();
  });
});
