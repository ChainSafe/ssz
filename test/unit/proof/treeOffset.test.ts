import {expect} from "chai";
import {describe, it} from "mocha";
import {createNodeFromTreeOffsetProof, createTreeOffsetProof} from "../../../src/proof/treeOffset";
import {zeroNode} from "../../../src/zeroNode";

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
      expect(actual).to.deep.equal(output);
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
      expect(actual.root).to.deep.equal(output.root);
    }
  });
});
