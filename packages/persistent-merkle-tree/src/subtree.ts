import {BranchNode, Node, LeafNode, getNodeH} from "./node";
import {zeroNode} from "./zeroNode";

const ERR_NAVIGATION = "Navigation error";
const ERR_TOO_MANY_NODES = "Too many nodes";

/** Cached values to mask an h value */
const uint32Masks = [0x00000000, 0xff000000, 0xffff0000, 0xffffff00];

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
  if (length === maxLength) return subtreeFillToDepth(bottom, depth);

  if (depth === 0) {
    if (length === 1) return bottom;
    else throw new Error(ERR_NAVIGATION);
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

export function subtreeFillToContents(nodes: Node[], depth: number): Node {
  const maxLength = 2 ** depth;
  if (nodes.length > maxLength) throw new Error(ERR_TOO_MANY_NODES);

  if (depth === 0) {
    if (!nodes.length) return zeroNode(0);
    return nodes[0];
  }

  if (depth === 1) {
    if (!nodes.length) return zeroNode(1);
    return new BranchNode(nodes[0], nodes[1] || zeroNode(0));
  }

  const pivot = Math.floor(maxLength / 2);
  if (nodes.length <= pivot) {
    return new BranchNode(subtreeFillToContents(nodes, depth - 1), zeroNode(depth - 1));
  } else {
    return new BranchNode(
      subtreeFillToContents(nodes.slice(0, Number(pivot)), depth - 1),
      subtreeFillToContents(nodes.slice(Number(pivot)), depth - 1)
    );
  }
}

/**
 * Optimized deserialization of linear bytes to consecutive leaf nodes
 */
export function packedRootsBytesToNode(depth: number, data: Uint8Array, start: number, end: number): Node {
  const size = end - start;
  const size32 = Math.ceil(size / 4);
  const nodeCount = Math.ceil(size / 32);
  const leafNodes: LeafNode[] = [];

  // Efficiently construct the tree writing to hashObjects directly
  const uint32Arr = new Uint32Array(data.buffer, start, size32);

  // TODO: Optimize, with this approach each h property is written twice
  for (let i = 0; i < nodeCount; i++) {
    leafNodes.push(
      new LeafNode({
        h0: uint32Arr[i * 8 + 0],
        h1: uint32Arr[i * 8 + 1] ?? 0,
        h2: uint32Arr[i * 8 + 2] ?? 0,
        h3: uint32Arr[i * 8 + 3] ?? 0,
        h4: uint32Arr[i * 8 + 4] ?? 0,
        h5: uint32Arr[i * 8 + 5] ?? 0,
        h6: uint32Arr[i * 8 + 6] ?? 0,
        h7: uint32Arr[i * 8 + 7] ?? 0,
      })
    );
  }

  return subtreeFillToContents(leafNodes, depth);
}

/**
 * Optimized serialization of consecutive leave nodes to linear bytes
 */
export function packedNodeRootsToBytes(data: Uint8Array, start: number, size: number, nodes: Node[]): void {
  const sizeUint32 = Math.ceil(size / 4);
  const uint32Arr = new Uint32Array(data.buffer, start, sizeUint32);
  // Efficiently get hashObjects data into data

  // Consider that the last node may only include partial data
  const remainderBytes = size % 32;

  // Full nodes
  const fullNodeCount = Math.floor(size / 32);
  for (let i = 0; i < fullNodeCount; i++) {
    const node = nodes[i];
    uint32Arr[i * 8 + 0] = node.h0;
    uint32Arr[i * 8 + 1] = node.h1;
    uint32Arr[i * 8 + 2] = node.h2;
    uint32Arr[i * 8 + 3] = node.h3;
    uint32Arr[i * 8 + 4] = node.h4;
    uint32Arr[i * 8 + 5] = node.h5;
    uint32Arr[i * 8 + 6] = node.h6;
    uint32Arr[i * 8 + 7] = node.h7;
  }

  // Last node
  if (remainderBytes > 0) {
    const remainderUint32 = size % 4;
    const node = nodes[fullNodeCount];

    // Loop to dynamically copy the full h values
    const fullHCount = Math.floor(remainderBytes / 4);
    for (let h = 0; h < fullHCount; h++) {
      uint32Arr[fullNodeCount * 8 + h] = getNodeH(node, h);
    }

    if (remainderUint32 > 0) {
      const mask = uint32Masks[remainderUint32];
      uint32Arr[fullNodeCount * 8 + fullHCount] = getNodeH(node, fullHCount) & mask;
    }
  }
}
