import {describe, expect, it} from "vitest";
import {toGindex} from "../../src/index.js";
import {LeafNode} from "../../src/node.js";
import {fromSnapshot, indexToFinalizedGindices, toSnapshot} from "../../src/snapshot.js";
import {subtreeFillToContents} from "../../src/subtree.js";
import {Tree, setNodesAtDepth} from "../../src/tree.js";

describe("toSnapshot and fromSnapshot", () => {
  const depth = 4;
  const maxItems = Math.pow(2, depth);

  for (let count = 0; count <= maxItems; count++) {
    it(`toSnapshot and fromSnapshot with count ${count}`, () => {
      const nodes = Array.from({length: count}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i)));
      const fullListRootNode = subtreeFillToContents(nodes, depth);
      const snapshot = toSnapshot(fullListRootNode, depth, count);
      const partialListRootNode = fromSnapshot(snapshot, depth);

      // 1st step - check if the restored root node is the same
      expect(partialListRootNode.root).toEqual(fullListRootNode.root);

      // 2nd step - make sure we can add more nodes to the restored tree
      const fullTree = new Tree(fullListRootNode);
      const partialTree = new Tree(partialListRootNode);
      for (let i = count; i < maxItems; i++) {
        const gindex = toGindex(depth, BigInt(i));
        fullTree.setNode(gindex, LeafNode.fromRoot(Buffer.alloc(32, i)));
        partialTree.setNode(gindex, LeafNode.fromRoot(Buffer.alloc(32, i)));
        expect(partialTree.root).toEqual(fullTree.root);

        // and snapshot created from 2 trees are the same
        const snapshot1 = toSnapshot(fullTree.rootNode, depth, i + 1);
        const snapshot2 = toSnapshot(partialTree.rootNode, depth, i + 1);
        expect(snapshot2).toEqual(snapshot1);
      }
    });

    // setNodesAtDepth() api is what ssz uses to grow the tree in its commit() phase
    it(`toSnapshot and fromSnapshot with count ${count} then grow with setNodeAtDepth`, () => {
      const nodes = Array.from({length: count}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i)));
      const fullListRootNode = subtreeFillToContents(nodes, depth);
      const snapshot = toSnapshot(fullListRootNode, depth, count);
      const partialListRootNode = fromSnapshot(snapshot, depth);

      // 1st step - check if the restored root node is the same
      expect(partialListRootNode.root).toEqual(fullListRootNode.root);

      // 2nd step - grow the tree with setNodesAtDepth
      for (let i = count; i < maxItems; i++) {
        const addedNodes = Array.from({length: i - count + 1}, (_, j) => LeafNode.fromRoot(Buffer.alloc(32, j)));
        const indices = Array.from({length: i - count + 1}, (_, j) => j + count);
        const root1 = setNodesAtDepth(fullListRootNode, depth, indices, addedNodes);
        const root2 = setNodesAtDepth(partialListRootNode, depth, indices, addedNodes);
        expect(root2.root).toEqual(root1.root);

        for (let j = count; j <= i; j++) {
          const snapshot1 = toSnapshot(root1, depth, j);
          const snapshot2 = toSnapshot(root2, depth, j);
          expect(snapshot2).toEqual(snapshot1);
        }
      }
    });

    it(`toSnapshot() multiple times with count ${count}`, () => {
      const nodes = Array.from({length: count}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i)));
      const fullListRootNode = subtreeFillToContents(nodes, depth);
      const snapshot = toSnapshot(fullListRootNode, depth, count);
      const partialListRootNode = fromSnapshot(snapshot, depth);

      // 1st step - check if the restored root node is the same
      expect(partialListRootNode.root).toEqual(fullListRootNode.root);

      const snapshot2 = toSnapshot(partialListRootNode, depth, count);
      const restoredRootNode2 = fromSnapshot(snapshot2, depth);

      // 2nd step - check if the restored root node is the same
      expect(restoredRootNode2.root).toEqual(partialListRootNode.root);
    });
  }
});

describe("indexToFinalizedGindices", () => {
  // given a tree with depth = 4
  //                                      1
  //                     2                                3
  //         4                   5                 6               7
  //    8        9         10       11        12       13       14      15
  // 16  17   18  19    20   21   22  23    24  25   26  27   28  29  30  31
  const testCases: [number, number, bigint[]][] = [
    [4, 0, [BigInt(16)]],
    [4, 1, [BigInt(8)]],
    [4, 2, [8, 18].map(BigInt)],
    [4, 3, [4].map(BigInt)],
    [4, 4, [4, 20].map(BigInt)],
    [4, 5, [4, 10].map(BigInt)],
    [4, 6, [4, 10, 22].map(BigInt)],
    [4, 7, [2].map(BigInt)],
    [4, 8, [2, 24].map(BigInt)],
    [4, 9, [2, 12].map(BigInt)],
    [4, 10, [2, 12, 26].map(BigInt)],
    [4, 11, [2, 6].map(BigInt)],
    [4, 12, [2, 6, 28].map(BigInt)],
    [4, 13, [2, 6, 14].map(BigInt)],
    [4, 14, [2, 6, 14, 30].map(BigInt)],
    [4, 15, [1].map(BigInt)],
  ];

  for (const [depth, index, finalizeGindices] of testCases) {
    it(`should correctly get finalized gindexes for index ${index} and depth ${depth}`, () => {
      const actual = indexToFinalizedGindices(depth, index);
      expect(actual).toEqual(finalizeGindices);
    });
  }
});
