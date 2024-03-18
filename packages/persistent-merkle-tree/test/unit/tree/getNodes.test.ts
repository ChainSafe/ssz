import {expect} from "chai";
import {getNodesAtDepth, LeafNode, Node, subtreeFillToContents, Tree} from "../../../src";

describe("tree / getNodes", () => {
  const depth = 40;
  const vc = 250_000; // Multiple of 32
  const length = vc;

  let tree: Tree;
  const expectedNodes = new Array<Node>(length);
  const initialNode = LeafNode.fromRoot(Buffer.alloc(32, 0xaa));

  before("Get base tree and data", () => {
    // Create a second array since subtreeFillToContents mutates the array
    const nodes = new Array<Node>(length);
    for (let i = 0; i < length; i++) {
      expectedNodes[i] = initialNode;
      nodes[i] = initialNode;
    }

    tree = new Tree(subtreeFillToContents(nodes, depth));
  });

  it("getNodesAtDepth", function () {
    this.timeout(5000);
    const nodes = getNodesAtDepth(tree.rootNode, depth, 0, length);

    assertValidNodes(nodes, expectedNodes);
  });

  function assertValidNodes(nodes: Node[], expectedNodes: Node[]): void {
    for (let i = 0; i < expectedNodes.length; i++) {
      expect(nodes[i].root).to.deep.equal(expectedNodes[i].root, `Wrong node index ${i}`);
    }
  }
});

describe.skip("tree / getNodes2", () => {
  const depth = 4;
  const length = 8;

  let rootNode: Node;
  const expectedNodes = new Array<Node>(length);

  before("Get base tree and data", () => {
    // Create a second array since subtreeFillToContents mutates the array
    const nodes = new Array<Node>(length);
    for (let i = 0; i < length; i++) {
      expectedNodes[i] = nodes[i] = LeafNode.fromUint32(i);
    }

    rootNode = subtreeFillToContents(nodes, depth);
  });

  it("getNodesAtDepth", () => {
    for (let i = 0; i < length; i++) {
      const nodes = getNodesAtDepth(rootNode, depth, i, length - i);
      assertValidNodes(nodes, expectedNodes.slice(i));
    }
  });

  function assertValidNodes(nodes: Node[], expectedNodes: Node[]): void {
    for (let i = 0; i < expectedNodes.length; i++) {
      expect(nodes[i]).to.equal(expectedNodes[i], `Wrong node index ${i}`);
    }
  }
});
