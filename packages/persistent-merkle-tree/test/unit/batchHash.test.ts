import {expect} from "chai";
import {countToDepth} from "../../src/gindex";
import {BranchNode, LeafNode, Node} from "../../src/node";
import {subtreeFillToContents} from "../../src/subtree";
import {zeroNode} from "../../src/zeroNode";

describe("batchHash", function () {
  // const numNodes = [200, 201, 202, 203];
  const numNodes = [32, 33, 64];
  for (const numNode of numNodes) {
    it(`${numNode} nodes`, () => {
      const rootNode = createList(numNode);
      const root1 = rootNode.batchHash();
      const rootNode2 = createList(numNode);
      const root2 = rootNode2.root;
      expect(root2).to.be.deep.equal(root1);

      const depth = countToDepth(BigInt(numNode)) + 1;
      resetNodes(rootNode, depth);
      resetNodes(rootNode2, depth);
      expect(rootNode.batchHash()).to.be.deep.equal(rootNode2.batchHash());
    });
  }
});

function resetNodes(node: Node, depth: number): void {
  if (node.isLeaf()) return;
  // do not reset zeroNode
  if (node === zeroNode(depth)) return;
  // this is to ask Node to calculate node again
  node.h0 = null as unknown as number;
  // in the old version, we should do
  // node._root = null;
  resetNodes(node.left, depth - 1);
  resetNodes(node.right, depth - 1);
}

function newLeafNodeFilled(i: number): LeafNode {
  return LeafNode.fromRoot(new Uint8Array(Array.from({length: 32}, () => i % 255)));
}

function createList(numNode: number): BranchNode {
  const nodes = Array.from({length: numNode}, (_, i) => newLeafNodeFilled(i));
  // add 1 to countToDepth for mix_in_length spec
  const depth = countToDepth(BigInt(numNode)) + 1;
  const node = subtreeFillToContents(nodes, depth);
  return node as BranchNode;
}
