import {describe, it, expect, beforeEach} from "vitest";
import {byteArrayToHashObject} from "@chainsafe/as-sha256";

import {
  Tree,
  Node,
  zeroNode,
  LeafNode,
  subtreeFillToContents,
  uint8ArrayToHashObject,
  setNodesAtDepth,
  findDiffDepthi,
  getHashComputations,
  HashComputationLevel,
} from "../../src";
import {batchHash} from "../utils/batchHash";

describe("fixed-depth tree iteration", () => {
  it("should properly navigate the zero tree", () => {
    const depth = 4;
    const zero = zeroNode(0).root;
    const tree = new Tree(zeroNode(4));
    for (const n of tree.iterateNodesAtDepth(depth, 0, 4)) {
      expect(n.root).toEqual(zero);
    }
    const one = zeroNode(1).root;
    for (const n of tree.iterateNodesAtDepth(depth - 1, 0, 4)) {
      expect(n.root).toEqual(one);
    }
  });

  it("should properly navigate a custom tree", () => {
    const depth = 4;
    const length = 1 << depth;
    const leaves = Array.from({length: length}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i)));
    const expectedLeaves = [...leaves];
    const tree = new Tree(subtreeFillToContents(leaves, depth));
    // i = startIx
    // j = count
    // k = currentIx
    for (let i = 0; i < length; i++) {
      for (let j = length - i - 1; j > 1; j--) {
        let k = i;
        for (const n of tree.iterateNodesAtDepth(depth, i, j)) {
          expect(n.root).toEqual(expectedLeaves[k].root);
          k++;
        }
        expect(k - i, `startIx=${i} count=${j} currIx=${k}`).to.be.eql(j);
      }
    }
  });
});

describe("batchHash() vs root getter", () => {
  const lengths = [4, 5, 6, 7, 10, 100, 1000];
  for (const length of lengths) {
    it(`length=${length}`, () => {
      const leaves = Array.from({length: length}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i % 256)));
      const depth = Math.ceil(Math.log2(length));
      const tree = new Tree(subtreeFillToContents([...leaves], depth));
      const tree2 = new Tree(subtreeFillToContents([...leaves], depth));
      batchHash(tree.rootNode);
      expect(tree.root).toEqual(tree2.root);
    });
  }
});

describe("subtree mutation", () => {
  let tree: Tree;
  beforeEach(() => {
    const depth = 2;
    tree = new Tree(zeroNode(depth));
    // Get the subtree with "X"s
    //       0
    //      /  \
    //    0      X
    //   / \    / \
    //  0   0  X   X
  });

  it("changing a subtree should change the parent root", () => {
    const subtree = tree.getSubtree(BigInt(3));

    const rootBefore = tree.root;
    subtree.setRoot(BigInt(3), Buffer.alloc(32, 1));
    const rootAfter = tree.root;

    expect(toHex(rootBefore)).to.not.equal(rootAfter);
  });

  it("setRoot vs setHashObject", () => {
    const newRoot = new Uint8Array(Array.from({length: 32}, () => 1));
    const newHashObject = uint8ArrayToHashObject(newRoot);
    const tree1 = tree.clone();
    tree1.setRoot(BigInt(4), newRoot);
    const tree2 = tree.clone();
    tree2.setNode(BigInt(4), LeafNode.fromHashObject(newHashObject));
    expect(toHex(tree1.root)).to.be.equal(toHex(tree2.root));
  });
});

describe("Tree.setNode vs Tree.setHashObjectFn", () => {
  it("Should compute root correctly after setting a leaf", () => {
    const depth = 4;
    const tree = new Tree(zeroNode(depth));
    tree.setNode(BigInt(18), LeafNode.fromRoot(Buffer.alloc(32, 2)));
    expect(toHex(tree.root)).to.equal("3cfd85690fdd88abcf22ca7acf45bb47835326ff3166d3c953d5a23263fea2b2");
    // setHashObjectFn
    const getNewNodeFn = (): Node => LeafNode.fromHashObject(byteArrayToHashObject(Buffer.alloc(32, 2), 0));
    const tree2 = new Tree(zeroNode(depth));
    tree2.setNodeWithFn(BigInt(18), getNewNodeFn);
    expect(toHex(tree2.root)).to.equal("3cfd85690fdd88abcf22ca7acf45bb47835326ff3166d3c953d5a23263fea2b2");
  });

  it("Should compute root correctly after setting 3 leafs", () => {
    const depth = 5;
    const tree = new Tree(zeroNode(depth));
    tree.setNode(BigInt(18), LeafNode.fromRoot(Buffer.alloc(32, 2)));
    tree.setNode(BigInt(46), LeafNode.fromRoot(Buffer.alloc(32, 2)));
    tree.setNode(BigInt(60), LeafNode.fromRoot(Buffer.alloc(32, 2)));
    expect(toHex(tree.root)).to.equal("02607e58782c912e2f96f4ff9daf494d0d115e7c37e8c2b7ddce17213591151b");
    // setHashObjectFn
    const getNewNodeFn = (): Node => LeafNode.fromHashObject(byteArrayToHashObject(Buffer.alloc(32, 2), 0));
    const tree2 = new Tree(zeroNode(depth));
    tree2.setNodeWithFn(BigInt(18), getNewNodeFn);
    tree2.setNodeWithFn(BigInt(46), getNewNodeFn);
    tree2.setNodeWithFn(BigInt(60), getNewNodeFn);
    batchHash(tree2.rootNode);
    expect(toHex(tree2.root)).to.equal("02607e58782c912e2f96f4ff9daf494d0d115e7c37e8c2b7ddce17213591151b");
  });

  it("Should throw for gindex 0", () => {
    const tree = new Tree(zeroNode(2));
    expect(() => tree.setNode(BigInt(0), zeroNode(1))).to.throw("Invalid gindex");
  });
});

describe("Tree batch setNodes", () => {
  const testCases: {depth: number; gindexes: number[]}[] = [
    {depth: 1, gindexes: [2]},
    {depth: 1, gindexes: [2, 3]},
    {depth: 2, gindexes: [4]},
    {depth: 2, gindexes: [6]},
    {depth: 2, gindexes: [4, 6]},
    {depth: 3, gindexes: [9]},
    {depth: 3, gindexes: [12]},
    {depth: 3, gindexes: [9, 10]},
    {depth: 3, gindexes: [13, 14]},
    {depth: 3, gindexes: [9, 10, 13, 14]},
    {depth: 3, gindexes: [8, 9, 10, 11, 12, 13, 14, 15]},
    {depth: 4, gindexes: [16]},
    {depth: 4, gindexes: [16, 17]},
    {depth: 4, gindexes: [16, 20]},
    {depth: 4, gindexes: [16, 20, 30]},
    {depth: 4, gindexes: [16, 20, 30, 31]},
    {depth: 5, gindexes: [33]},
    {depth: 5, gindexes: [33, 34]},
    {depth: 10, gindexes: [1024, 1061, 1098, 1135, 1172, 1209, 1246, 1283]},
    {depth: 40, gindexes: [Math.pow(2, 40) + 1000, Math.pow(2, 40) + 1_000_000, Math.pow(2, 40) + 1_000_000_000]},
    {depth: 40, gindexes: [1157505940782, 1349082402477, 1759777921993]},
  ];

  for (const {depth, gindexes} of testCases) {
    const id = `depth ${depth} ${JSON.stringify(gindexes)}`;
    // Prepare tree
    const treeOk = new Tree(zeroNode(depth));
    // cache all roots
    treeOk.root;
    const hashComputationsOk: Array<HashComputationLevel> = Array.from(
      {length: depth},
      () => new HashComputationLevel()
    );
    const tree = new Tree(zeroNode(depth));
    tree.root;
    const gindexesBigint = gindexes.map((gindex) => BigInt(gindex));
    const index0 = 2 ** depth;
    const indexes = gindexes.map((gindex) => gindex - index0);

    // Run correct setNode() method for each and grab all tree roots
    for (let i = 0; i < gindexesBigint.length; i++) {
      treeOk.setNode(gindexesBigint[i], LeafNode.fromRoot(Buffer.alloc(32, gindexes[i])));
    }
    getHashComputations(treeOk.rootNode, 0, hashComputationsOk);

    // For the large test cases, only compare the rootNode root (gindex 1)
    const maxGindex = depth > 6 ? 1 : 2 ** (depth + 1);
    const rootsOk = getTreeRoots(treeOk, maxGindex);

    it(`${id} - setNodesAtDepth()`, () => {
      const chunksNode = tree.rootNode;
      const hcByLevel: HashComputationLevel[] = [];
      const newChunksNode = setNodesAtDepth(
        chunksNode,
        depth,
        indexes,
        gindexes.map((nodeValue) => LeafNode.fromRoot(Buffer.alloc(32, nodeValue))),
        // TODO: more test cases with positive offset?
        0,
        hcByLevel
      );
      tree.rootNode = newChunksNode;
      const roots = getTreeRoots(tree, maxGindex);

      // compute root to compare easiers
      treeOk.root;
      tree.root;
      // TODO: need sort?
      // TODO: confirm all nodes in HashComputation are populated with HashObjects, h0 !== null
      for (let i = depth - 1; i >= 0; i--) {
        const hcArr = hcByLevel[i].toArray();
        const hcOkArr = hashComputationsOk[i].toArray();
        expect(hcArr.length).to.be.equal(hcOkArr.length, `incorrect length at depth ${i}`);
        for (let j = 0; j < hcArr.length; j++) {
          const hcOk = hcOkArr[j];
          const hc = hcArr[j];
          expect(hc.src0.root).toEqual(hcOk.src0.root);
          expect(hc.src1.root).toEqual(hcOk.src1.root);
          expect(hc.dest.root).toEqual(hcOk.dest.root);
        }
      }
      try {
        expect(roots).to.deep.equal(rootsOk);
      } catch (e) {
        if (process.env.DEBUG) {
          /* eslint-disable no-console */
          // On error print all roots for easier debugging
          console.log(" ", " ", "rootsOk".padEnd(64), "roots");
          for (let i = 1; i < rootsOk.length; i++) {
            console.log(i, rootsOk[i] !== roots[i] ? "x" : " ", rootsOk[i], roots[i]);
          }
        }
        throw e;
      }
    });
  }
});

/**
 * These tests passed/fixed the old version of findDiffDepthi
 * To validate it manually, use `Number(index).toString(2)` and compare bits
 */
describe("findDiffDepthi", () => {
  it("validate inputs", () => {
    expect(() => findDiffDepthi(-1, 100)).to.throw("Expect different positive inputs, from=-1 to=100");
    expect(() => findDiffDepthi(101, 101)).to.throw("Expect different positive inputs, from=101 to=101");
  });

  const testCases: {index0: number; index1: number; result: number}[] = [
    {index0: 0, index1: 1, result: 0},
    // 2 sides of a 4-width tree
    {index0: 1, index1: 3, result: 1},
    // 2 sides of a 8-width tree
    {index0: 3, index1: 4, result: 2},
    // 16 bits
    {index0: 0, index1: 0xffff, result: 15},
    // 31 bits, different number of bits
    {index0: 5, index1: (0xffffffff >>> 1) - 5, result: 30},
    // 31 bits, same number of bits
    {index0: 0x7fffffff, index1: 0x70000000, result: 27},
    // 32 bits tree, different number of bits
    {index0: 0, index1: 0xffffffff, result: 31},
    {index0: 0, index1: (0xffffffff >>> 1) + 1, result: 31},
    {index0: 0xffffffff >>> 1, index1: (0xffffffff >>> 1) + 1, result: 31},
    // 32 bits tree, same number of bits
    {index0: 0xf0000000, index1: 0xffffffff, result: 27},
    // below tests are same to first tests but go from right to left
    // similar to {0, 1}
    {index0: 0xffffffff - 1, index1: 0xffffffff, result: 0},
    // similar to {1, 3}
    {index0: 0xffffffff - 3, index1: 0xffffffff - 1, result: 1},
    // similar to {3, 4}
    {index0: 0xffffffff - 4, index1: 0xffffffff - 3, result: 2},
    // more than 32 bits, same number of bits
    {index0: 1153210973487, index1: 1344787435182, result: 37},
    // more than 32 bits, different number of bits
    {index0: 1153210973487, index1: 1344787435182 >>> 2, result: 40},
  ];

  for (const {index0, index1, result} of testCases) {
    it(`expect diffi between ${index0} and ${index1} to be ${result}`, () => {
      expect(findDiffDepthi(index0, index1)).to.be.equal(result);
    });
  }
});

function getTreeRoots(tree: Tree, maxGindex: number): string[] {
  const roots = new Array<string>(maxGindex);
  for (let i = 1; i < maxGindex; i++) {
    roots[i] = toHex(tree.getNode(BigInt(i)).root);
  }
  return roots;
}

function toHex(bytes: Buffer | Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}
