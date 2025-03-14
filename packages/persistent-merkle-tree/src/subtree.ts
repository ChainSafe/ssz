import {HashComputationLevel, getHashComputations, levelAtIndex} from "./hashComputation.js";
import {BranchNode, Node} from "./node.js";
import {zeroNode} from "./zeroNode.js";

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
    throw new Error("ERR_NAVIGATION");
  }

  if (depth === 1) {
    return new BranchNode(bottom, length > 1 ? bottom : zeroNode(0));
  }

  const pivot = maxLength >> 1;
  if (length <= pivot) {
    return new BranchNode(subtreeFillToLength(bottom, depth - 1, length), zeroNode(depth - 1));
  }

  return new BranchNode(subtreeFillToDepth(bottom, depth - 1), subtreeFillToLength(bottom, depth - 1, length - pivot));
}

/**
 * WARNING: Mutates the provided nodes array.
 * TODO: Don't mutate the nodes array.
 * hcByLevel is an output parameter that will be filled with the hash computations if exists.
 */
export function subtreeFillToContents(
  nodes: Node[],
  depth: number,
  hcOffset = 0,
  hcByLevel: HashComputationLevel[] | null = null
): Node {
  const maxLength = 2 ** depth;
  if (nodes.length > maxLength) {
    throw new Error(`nodes.length ${nodes.length} over maxIndex at depth ${depth}`);
  }

  if (nodes.length === 0) {
    return zeroNode(depth);
  }

  if (depth === 0) {
    const node = nodes[0];
    if (hcByLevel !== null) {
      getHashComputations(node, hcOffset, hcByLevel);
    }
    return node;
  }

  if (depth === 1) {
    // All nodes at depth 1 available
    // If there is only one node, pad with zero node
    const leftNode = nodes[0];
    const rightNode = nodes.length > 1 ? nodes[1] : zeroNode(0);
    const rootNode = new BranchNode(leftNode, rightNode);

    if (hcByLevel !== null) {
      getHashComputations(leftNode, hcOffset + 1, hcByLevel);
      getHashComputations(rightNode, hcOffset + 1, hcByLevel);
      levelAtIndex(hcByLevel, hcOffset).push(leftNode, rightNode, rootNode);
    }

    return rootNode;
  }

  let count = nodes.length;

  for (let d = depth; d > 0; d--) {
    const countRemainder = count % 2;
    const countEven = count - countRemainder;
    const offset = hcByLevel ? hcOffset + d - 1 : null;

    // For each depth level compute the new BranchNodes and overwrite the nodes array
    for (let i = 0; i < countEven; i += 2) {
      const left = nodes[i];
      const right = nodes[i + 1];
      const node = new BranchNode(left, right);
      nodes[i / 2] = node;
      if (offset !== null && hcByLevel !== null) {
        levelAtIndex(hcByLevel, offset).push(left, right, node);
        if (d === depth) {
          // bottom up strategy so we don't need to go down the tree except for the last level
          getHashComputations(left, offset + 1, hcByLevel);
          getHashComputations(right, offset + 1, hcByLevel);
        }
      }
    }

    if (countRemainder > 0) {
      const left = nodes[countEven];
      const right = zeroNode(depth - d);
      const node = new BranchNode(left, right);
      nodes[countEven / 2] = node;
      if (offset !== null && hcByLevel !== null) {
        if (d === depth) {
          // only go down on the last level
          getHashComputations(left, offset + 1, hcByLevel);
        }
        // no need to getHashComputations for zero node
        levelAtIndex(hcByLevel, offset).push(left, right, node);
      }
    }

    // If there was remainer, 2 nodes are added to the count
    count = countEven / 2 + countRemainder;
  }

  return nodes[0];
}
