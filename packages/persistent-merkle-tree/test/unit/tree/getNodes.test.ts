import {beforeAll, describe, expect, it} from "vitest";
import {LeafNode, Node, Tree, getNodesAtDepth, subtreeFillToContents} from "../../../src/index.ts";

describe("tree / getNodes", () => {
  const depth = 40;
  const vc = 250_000; // Multiple of 32
  const length = vc;

  let tree: Tree;
  const expectedNodes = new Array<Node>(length);
  const initialNode = LeafNode.fromRoot(Buffer.alloc(32, 0xaa));

  beforeAll(() => {
    // Create a second array since subtreeFillToContents mutates the array
    const nodes = new Array<Node>(length);
    for (let i = 0; i < length; i++) {
      expectedNodes[i] = initialNode;
      nodes[i] = initialNode;
    }

    tree = new Tree(subtreeFillToContents(nodes, depth));
  });

  it("getNodesAtDepth", () => {
    const nodes = getNodesAtDepth(tree.rootNode, depth, 0, length);
    assertValidNodes(nodes, expectedNodes);
  });

  function assertValidNodes(nodes: Node[], expectedNodes: Node[]): void {
    for (let i = 0; i < expectedNodes.length; i++) {
      expect(nodes[i]).toEqualWithMessage(expectedNodes[i], `Wrong node index ${i}`);
    }
  }
});
