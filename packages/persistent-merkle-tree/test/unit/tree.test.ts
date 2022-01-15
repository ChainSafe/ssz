import {byteArrayToHashObject} from "@chainsafe/as-sha256";
import {expect} from "chai";

import {
  Tree,
  Node,
  zeroNode,
  LeafNode,
  subtreeFillToContents,
  uint8ArrayToHashObject,
  setNodesAtDepth,
} from "../../src";

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
    tree2.setNode(BigInt(4), new LeafNode(newHashObject));
    expect(toHex(tree1.root)).to.be.equal(toHex(tree2.root));
  });
});

describe("Tree.setNode vs Tree.setHashObjectFn", () => {
  it("Should compute root correctly after setting a leaf", () => {
    const depth = 4;
    const tree = new Tree(zeroNode(depth));
    tree.setNode(BigInt(18), new LeafNode(Buffer.alloc(32, 2)));
    expect(toHex(tree.root)).to.equal("3cfd85690fdd88abcf22ca7acf45bb47835326ff3166d3c953d5a23263fea2b2");
    // setHashObjectFn
    const getNewNodeFn = (): Node => new LeafNode(byteArrayToHashObject(Buffer.alloc(32, 2)));
    const tree2 = new Tree(zeroNode(depth));
    tree2.setNodeWithFn(BigInt(18), getNewNodeFn);
    expect(toHex(tree2.root)).to.equal("3cfd85690fdd88abcf22ca7acf45bb47835326ff3166d3c953d5a23263fea2b2");
  });

  it("Should compute root correctly after setting 3 leafs", () => {
    const depth = 5;
    const tree = new Tree(zeroNode(depth));
    tree.setNode(BigInt(18), new LeafNode(Buffer.alloc(32, 2)));
    tree.setNode(BigInt(46), new LeafNode(Buffer.alloc(32, 2)));
    tree.setNode(BigInt(60), new LeafNode(Buffer.alloc(32, 2)));
    expect(toHex(tree.root)).to.equal("02607e58782c912e2f96f4ff9daf494d0d115e7c37e8c2b7ddce17213591151b");
    // setHashObjectFn
    const getNewNodeFn = (): Node => new LeafNode(byteArrayToHashObject(Buffer.alloc(32, 2)));
    const tree2 = new Tree(zeroNode(depth));
    tree2.setNodeWithFn(BigInt(18), getNewNodeFn);
    tree2.setNodeWithFn(BigInt(46), getNewNodeFn);
    tree2.setNodeWithFn(BigInt(60), getNewNodeFn);
    expect(toHex(tree2.root)).to.equal("02607e58782c912e2f96f4ff9daf494d0d115e7c37e8c2b7ddce17213591151b");
  });

  it("Should throw for gindex 0", () => {
    const tree = new Tree(zeroNode(2));
    expect(() => tree.setNode(BigInt(0), zeroNode(1))).to.throw("Invalid gindex");
  });

  it.skip("Should expand a subtree", () => {
    const depth = 2;
    const tree = new Tree(zeroNode(depth));
    tree.setNode(BigInt(15), zeroNode(0));
    expect(tree.getRoot(BigInt(14))).to.deep.equal(zeroNode(0));
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
    {depth: 40, gindexes: [1157505940782, 1349082402477, 1759777921993]},
  ];

  for (const {depth, gindexes} of testCases) {
    const id = `depth ${depth} ${JSON.stringify(gindexes)}`;
    // Prepare tree
    const treeOk = new Tree(zeroNode(depth));
    const tree = new Tree(zeroNode(depth));
    const gindexesBigint = gindexes.map((gindex) => BigInt(gindex));
    const index0 = 2 ** depth;
    const indexes = gindexes.map((gindex) => gindex - index0);

    // Run correct setNode() method for each and grab all tree roots
    for (let i = 0; i < gindexesBigint.length; i++) {
      treeOk.setNode(gindexesBigint[i], new LeafNode(Buffer.alloc(32, gindexes[i])));
    }

    // For the large test cases, only compare the rootNode root (gindex 1)
    const maxGindex = depth > 6 ? 1 : 2 ** (depth + 1);
    const rootsOk = getTreeRoots(treeOk, maxGindex);

    it(`${id} - setNodesAtDepth()`, () => {
      const chunksNode = tree.rootNode;
      const newChunksNode = setNodesAtDepth(
        chunksNode,
        depth,
        indexes,
        gindexes.map((nodeValue) => new LeafNode(Buffer.alloc(32, nodeValue)))
      );
      tree.rootNode = newChunksNode;
      const roots = getTreeRoots(tree, maxGindex);

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

function getTreeRoots(tree: Tree, maxGindex: number): string[] {
  const roots: string[] = [];
  for (let i = 1; i < maxGindex; i++) {
    roots[i] = toHex(tree.getNode(BigInt(i)).root);
  }
  return roots;
}

function toHex(bytes: Buffer | Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}
