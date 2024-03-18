import { expect } from "chai";
import {subtreeFillToContents, LeafNode, getNodesAtDepth} from "../../src";

describe("subtreeFillToContents", () => {
  it("Simple case", () => {
    function nodeNum(num: number): LeafNode {
      return LeafNode.fromUint32(num);
    }
    const nodes = [nodeNum(1), nodeNum(2), nodeNum(3), nodeNum(4)];
    subtreeFillToContents(nodes, 2);
  });

  it("should not error on contents length 1", () => {
    subtreeFillToContents([LeafNode.fromZero()], 1);
  });

  it("should not error on empty contents", () => {
    subtreeFillToContents([], 0);
    subtreeFillToContents([], 1);
  });

  it("should not error on depth 31", () => {
    subtreeFillToContents([], 31);
  });

  for (let depth = 1; depth <= 32; depth *= 2) {
    const maxIndex = Math.min(2 ** depth, 200_000);

    for (let count = 1; count <= maxIndex; count *= 2) {
      it(`subtreeFillToContents depth ${depth} count ${count}`, function () {
        this.timeout(6000);
        const nodes = new Array<LeafNode>(count);
        const expectedNodes = new Array<LeafNode>(count);
        for (let i = 0; i < count; i++) {
          const node = LeafNode.fromZero();
          nodes[i] = node;
          expectedNodes[i] = node;
        }

        const node = subtreeFillToContents(nodes, depth);
        const retrievedNodes = getNodesAtDepth(node, depth, 0, count);

        // Assert correct
        for (let i = 0; i < count; i++) {
          expect(retrievedNodes[i].root).to.deep.equal(expectedNodes[i].root, `Wrong node at index ${i}`);
          // if (retrievedNodes[i] !== expectedNodes[i]) {
          //   throw Error(`Wrong node at index ${i}`);
          // }
        }
      });
    }
  }
});
