import {expect} from "chai";

import {Tree, zeroNode, LeafNode, subtreeFillToContents} from "../src";

describe("fixed-depth tree iteration", () => {
  it("should properly navigate the zero tree", () => {
    const depth = 4;
    const zero = zeroNode(0).root;
    const tree = new Tree(zeroNode(4));
    for (const n of tree.iterateNodesAtDepth(depth, 0, 4)) {
      expect(n.root).to.be.deep.equal(zero);
    }
    const one = zeroNode(1).root;
    for (const n of tree.iterateNodesAtDepth(depth - 1, 0, 4)) {
      expect(n.root).to.be.deep.equal(one);
    }
  });

  it("should properly navigate a custom tree", () => {
    const depth = 4;
    const length = 1 << depth;
    const leaves = Array.from({length: length}, (_, i) => new LeafNode(Buffer.alloc(32, i)));
    const tree = new Tree(subtreeFillToContents(leaves, depth));
    // i = startIx
    // j = count
    // k = currentIx
    for (let i = 0; i < length; i++) {
      for (let j = length - i - 1; j > 1; j--) {
        let k = i;
        for (const n of tree.iterateNodesAtDepth(depth, i, j)) {
          expect(n.root).to.be.deep.equal(leaves[k].root);
          k++;
        }
        expect(k - i, `startIx=${i} count=${j} currIx=${k}`).to.be.eql(j);
      }
    }
  });
});
