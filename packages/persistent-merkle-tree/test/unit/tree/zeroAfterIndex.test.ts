import {describe, it, expect} from "vitest";
import {LeafNode, Node, toGindex, Tree, zeroNode, treeZeroAfterIndex, getNodesAtDepth} from "../../../src/index.js";

describe("tree / zeroAfterIndex", () => {
  // Test all possible zeroAfterIndex operations for any tree with 0 <= depth < 6

  for (let depth = 0; depth < 6; depth++) {
    const maxLength = 2 ** depth;

    for (let length = 0; length < maxLength; length++) {
      it(`depth ${depth} length ${length}`, () => {
        const tree = new Tree(zeroNode(depth));

        const treeRootAtIndex = new Array<Uint8Array>(length);

        for (let i = 0; i < length; i++) {
          const root = Buffer.alloc(32, i + 16);
          tree.setNode(toGindex(depth, BigInt(i)), LeafNode.fromRoot(root));
          treeRootAtIndex[i] = tree.root;
        }

        for (let i = 0; i < length; i++) {
          const rootNodeNaive = treeZeroAfterIndexNaive(tree, depth, length, i);
          const rootHexNaive = toHex(rootNodeNaive.root);

          const rootNode = treeZeroAfterIndex(tree.rootNode, depth, i);
          const rootHex = toHex(rootNode.root);

          if (rootHexNaive !== rootHex) {
            printLeafTreeDiff(rootNodeNaive, rootNode, depth, 8);
          }

          expect(rootHexNaive).toEqualWithMessage(toHex(treeRootAtIndex[i]), `Wrong tree root at index ${i} - naive`);
          expect(rootHex).toEqualWithMessage(toHex(treeRootAtIndex[i]), `Wrong tree root at index ${i}`);
        }
      });
    }
  }
});

function printLeafTreeDiff(nodeA: Node, nodeB: Node, depth: number, length: number): void {
  for (let d = 0; d <= depth; d++) {
    const nodesA = getNodesAtDepth(nodeA, d, 0, length);
    const nodesB = getNodesAtDepth(nodeB, d, 0, length);
    const toIndex = Math.ceil(length / 2 ** (depth - d));
    
    console.log(`Depth ${d}`);
    for (let i = 0; i < toIndex; i++) {
      
      console.log(`${d} ${i} A ${toHex(nodesA[i].root)} B ${toHex(nodesB[i].root)}`);
    }
  }
}

function treeZeroAfterIndexNaive(treeOg: Tree, depth: number, length: number, index: number): Node {
  const tree = treeOg.clone();

  for (let i = index + 1; i < length; i++) {
    tree.setNode(toGindex(depth, BigInt(i)), zeroNode(0));
  }

  return tree.rootNode;
}

function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}
