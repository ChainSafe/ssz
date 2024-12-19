import {subtreeFillToContents} from "../../src/index.js";
import {BranchNode, LeafNode, Node} from "../../src/node.js";
import {linspace} from "./misc.js";

export function createTree(depth: number, index = 0): Node {
  if (!depth) {
    return LeafNode.fromRoot(Buffer.alloc(32, index));
  }
  return new BranchNode(createTree(depth - 1, 2 ** depth + index), createTree(depth - 1, 2 ** depth + index + 1));
}

export function buildComparisonTrees(depth: number): [BranchNode, BranchNode] {
  const width = 2 ** (depth - 1);
  const nodes = linspace(width).map((num) => LeafNode.fromRoot(Uint8Array.from(Buffer.alloc(32, num))));
  const copy = nodes.map((node) => node.clone());
  const branch1 = subtreeFillToContents(nodes, depth) as BranchNode;
  const branch2 = subtreeFillToContents(copy, depth) as BranchNode;
  return [branch1, branch2];
}
