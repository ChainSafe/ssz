import {BranchNode, LeafNode, Node} from "../../src/node";

export function createTree(depth: number, index = 0): Node {
  if (!depth) {
    return LeafNode.fromRoot(Buffer.alloc(32, index));
  }
  return new BranchNode(createTree(depth - 1, 2 ** depth + index), createTree(depth - 1, 2 ** depth + index + 1));
}
