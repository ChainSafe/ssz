import {BranchNode, Node} from "./node";
import {zeroNode} from "./zeroNode";

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
  if (length > maxLength) throw new Error("ERR_TOO_MANY_NODES");
  if (length === maxLength) return subtreeFillToDepth(bottom, depth);

  if (depth === 0) {
    if (length === 1) return bottom;
    else throw new Error("ERR_NAVIGATION");
  }

  if (depth === 1) {
    return new BranchNode(bottom, length > 1 ? bottom : zeroNode(0));
  }

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

/**
 * WARNING: Mutates the provided nodes array.
 * TODO: Don't mutate the nodes array.
 */
export function subtreeFillToContents(nodes: Node[], depth: number): Node {
  const maxLength = 2 ** depth;
  if (nodes.length > maxLength) {
    throw new Error(`nodes.length ${nodes.length} over maxIndex at depth ${depth}`);
  }

  if (nodes.length === 0) {
    return zeroNode(depth);
  }

  if (depth === 0) {
    return nodes[0];
  }

  if (depth === 1) {
    return nodes.length > 1
      ? // All nodes at depth 1 available
        new BranchNode(nodes[0], nodes[1])
      : // Pad with zero node
        new BranchNode(nodes[0], zeroNode(0));
  }

  let count = nodes.length;

  for (let d = depth; d > 0; d--) {
    const countRemainder = count % 2;
    const countEven = count - countRemainder;

    // For each depth level compute the new BranchNodes and overwrite the nodes array
    for (let i = 0; i < countEven; i += 2) {
      nodes[i / 2] = new BranchNode(nodes[i], nodes[i + 1]);
    }

    if (countRemainder > 0) {
      nodes[countEven / 2] = new BranchNode(nodes[countEven], zeroNode(depth - d));
    }

    // If there was remainer, 2 nodes are added to the count
    count = countEven / 2 + countRemainder;
  }

  return nodes[0];
}
