import {describe, expect, it} from "vitest";
import {createNodeFromTreeOffsetProof, createTreeOffsetProof} from "../../../src/proof/treeOffset.ts";
import {zeroNode} from "../../../src/zeroNode.ts";

describe("computeTreeOffsetProof", () => {
  it("should properly compute known testcases", () => {
    const testCases = [
      {
        input: {rootNode: zeroNode(3), gindices: [BigInt(8), BigInt(9), BigInt(14)]},
        output: [
          [3, 2, 1, 1, 1],
          [zeroNode(0).root, zeroNode(0).root, zeroNode(1).root, zeroNode(1).root, zeroNode(0).root, zeroNode(0).root],
        ],
      },
    ];
    for (const {input, output} of testCases) {
      const actual = createTreeOffsetProof(input.rootNode, input.gindices);
      expect(actual).toEqual(output);
    }
  });
});

describe("computeNodeFromTreeOffsetProof", () => {
  it("should properly compute known testcases", () => {
    const testCases = [
      {
        input: {
          offsets: [3, 2, 1, 1, 1],
          leaves: [
            zeroNode(0).root,
            zeroNode(0).root,
            zeroNode(1).root,
            zeroNode(1).root,
            zeroNode(0).root,
            zeroNode(0).root,
          ],
        },
        output: zeroNode(3),
      },
    ];
    for (const {input, output} of testCases) {
      const actual = createNodeFromTreeOffsetProof(input.offsets, input.leaves);
      expect(actual.root).toEqual(output.root);
    }
  });
});
