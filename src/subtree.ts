import { BranchNode, Node } from "./node";
import { zeroNode } from "./zeroNode";
import { TreeBacking } from "./backing";

const ERR_NAVIGATION = "Navigation error";
const ERR_TOO_MANY_NODES = "Too many nodes";

// subtree filling

export function subtreeFillToDepth(bottom: Node, depth: number): Node {
  let node = bottom;
  while (depth > 0) {
    node = new BranchNode(node, node);
    depth--;
  }
  return node;
}

export function subtreeFillToLength(bottom: Node, depth: number, length: number): Node {
  const maxLength = 1 << depth;
  if (length > maxLength) throw new Error(ERR_TOO_MANY_NODES);
  else if (length === maxLength) return subtreeFillToDepth(bottom, depth);
  else if (depth === 0) {
    if (length === 1) return bottom;
    else throw new Error(ERR_NAVIGATION);
  } else if (depth === 1) {
    return new BranchNode(bottom, (length > 1) ? bottom : zeroNode(0));
  } else {
    const pivot = maxLength >> 1;
    if (length <= pivot) {
      return new BranchNode(subtreeFillToLength(bottom, depth - 1, length), zeroNode(depth - 1));
    } else {
      return new BranchNode(
        subtreeFillToDepth(bottom, depth - 1),
        subtreeFillToLength(bottom, depth - 1, length - pivot)
      );
    }
  }
}

export function subtreeFillToContents(nodes: Node[], depth: number): Node {
  const maxLength = 1 << depth;
  if (nodes.length > maxLength) throw new Error(ERR_TOO_MANY_NODES);
  else if (depth === 0) {
    if (nodes.length === 1) return nodes[0];
    else throw new Error(ERR_NAVIGATION);
  } else if (depth === 1) {
    return new BranchNode(nodes[0], (nodes.length > 1) ? nodes[1] : zeroNode(0));
  } else {
    const pivot = maxLength >> 1;
    if (nodes.length <= pivot) {
      return new BranchNode(subtreeFillToContents(nodes, depth - 1), zeroNode(depth - 1));
    } else {
      return new BranchNode(
        subtreeFillToContents(nodes.slice(0, Number(pivot)), depth - 1),
        subtreeFillToContents(nodes.slice(Number(pivot)), depth - 1),
      );
    }
  }
}

// Same functions as above, with TreeBacking input/output

export function subtreeBackingFillToDepth(bottom: TreeBacking, depth: number): TreeBacking {
  return new TreeBacking(subtreeFillToDepth(bottom.node, depth));
}

export function subtreeBackingFillToLength(bottom: TreeBacking, depth: number, length: number): TreeBacking {
  return new TreeBacking(subtreeFillToLength(bottom.node, depth, length));
}

export function subtreeBackingFillToContents(backings: TreeBacking[], depth: number): TreeBacking {
  return new TreeBacking(subtreeFillToContents(backings.map(b => b.node), depth));
}
