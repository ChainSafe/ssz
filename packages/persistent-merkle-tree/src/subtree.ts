import {BranchNode, Node} from "./node";
import {zeroNode} from "./zeroNode";

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
