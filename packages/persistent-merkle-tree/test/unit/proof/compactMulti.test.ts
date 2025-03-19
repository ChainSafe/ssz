import {describe, expect, it} from "vitest";
import {
  computeDescriptor,
  createCompactMultiProof,
  createNodeFromCompactMultiProof,
  descriptorToBitlist,
} from "../../../src/proof/compactMulti.js";
import {createTree} from "../../utils/tree.js";

describe("CompactMultiProof", () => {
  const descriptorTestCases = [
    {
      input: Uint8Array.from([0b1000_0000]),
      output: [1].map(Boolean),
    },
    {
      input: Uint8Array.from([0b0010_0101, 0b1110_0000]),
      output: [0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1].map(Boolean),
    },
    {
      input: Uint8Array.from([0b0101_0101, 0b1000_0000]),
      output: [0, 1, 0, 1, 0, 1, 0, 1, 1].map(Boolean),
    },
    {
      input: Uint8Array.from([0b0101_0110]),
      output: [0, 1, 0, 1, 0, 1, 1].map(Boolean),
    },
  ];
  describe("descriptorToBitlist", () => {
    it("should convert valid descriptor to a bitlist", () => {
      for (const {input, output} of descriptorTestCases) {
        expect(descriptorToBitlist(input)).toEqual(output);
      }
    });
    it("should throw on invalid descriptors", () => {
      const errorCases = [
        Uint8Array.from([0b1000_0000, 0]),
        Uint8Array.from([0b0000_0001, 0]),
        Uint8Array.from([0b0101_0111]),
        Uint8Array.from([0b0101_0110, 0]),
      ];
      for (const input of errorCases) {
        expect(() => descriptorToBitlist(input)).to.throw();
      }
    });
  });
  describe("computeDescriptor", () => {
    it("should convert gindices to a descriptor", () => {
      const index = 42n;
      const expected = Uint8Array.from([0x25, 0xe0]);
      expect(computeDescriptor([index])).toEqual(expected);
    });
  });

  const tree = createTree(5);
  it("should roundtrip node -> proof -> node", () => {
    for (const {input} of descriptorTestCases) {
      const proof = createCompactMultiProof(tree, input);
      const newNode = createNodeFromCompactMultiProof(proof, input);
      expect(newNode.root).toEqual(tree.root);
    }
  });
});
