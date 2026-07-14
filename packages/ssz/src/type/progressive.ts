import {
  BranchNode,
  Gindex,
  Node,
  concatGindices,
  digest64Into,
  getNodesAtDepth,
  merkleizeBlocksBytes,
  subtreeFillToContents,
  toGindex,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";

export const PROGRESSIVE_LIST_MAX_SIZE = 0xffffffff;

const BASE_CHUNK_COUNT = 1;
const SCALING_FACTOR = 4;
const ZERO_ROOT = new Uint8Array(32);

/**
 * Return the generalized index of a chunk inside a progressive Merkle tree.
 *
 * The progressive tree is a right-recursive, zero-terminated sequence of
 * subtrees with capacities 1, 4, 16, ...
 */
export function progressiveChunkGindex(chunkIndex: number): Gindex {
  if (chunkIndex < 0 || !Number.isSafeInteger(chunkIndex)) {
    throw Error(`Invalid progressive chunk index ${chunkIndex}`);
  }

  let subtreeIndex = 0;
  let subtreeStart = 0;
  let subtreeLength = BASE_CHUNK_COUNT;
  while (chunkIndex >= subtreeStart + subtreeLength) {
    subtreeStart += subtreeLength;
    subtreeLength *= SCALING_FACTOR;
    subtreeIndex++;
  }

  const parts: Gindex[] = [];
  for (let i = 0; i < subtreeIndex; i++) {
    // Navigate to the successor subtree.
    parts.push(BigInt(3));
  }
  // Navigate to the subtree containing this chunk.
  parts.push(BigInt(2));

  const subtreeDepth = progressiveSubtreeDepth(subtreeIndex);
  if (subtreeDepth > 0) {
    parts.push(toGindex(subtreeDepth, BigInt(chunkIndex - subtreeStart)));
  }

  return concatGindices(parts);
}

export function progressiveChunkGindexFromRoot(rootGindex: Gindex, chunkIndex: number): Gindex {
  return concatGindices([rootGindex, progressiveChunkGindex(chunkIndex)]);
}

export function progressiveSubtreeCount(chunkCount: number): number {
  let remaining = chunkCount;
  let subtreeLength = BASE_CHUNK_COUNT;
  let count = 0;
  while (remaining > 0) {
    remaining -= Math.min(remaining, subtreeLength);
    subtreeLength *= SCALING_FACTOR;
    count++;
  }
  return count;
}

export function progressiveSubtreeDepth(subtreeIndex: number): number {
  return subtreeIndex * 2;
}

export function merkleizeProgressiveBytes(
  chunksBytes: Uint8Array,
  chunkCount: number,
  output: Uint8Array,
  offset: number
): void {
  if (chunkCount === 0) {
    output.set(ZERO_ROOT, offset);
    return;
  }
  if (chunksBytes.length < chunkCount * 32) {
    throw Error(`chunksBytes length ${chunksBytes.length} is less than chunkCount ${chunkCount}`);
  }

  const subtreeRoots = new Array<Uint8Array>(progressiveSubtreeCount(chunkCount));
  let chunkOffset = 0;
  let subtreeLength = BASE_CHUNK_COUNT;

  for (let subtreeIndex = 0; chunkOffset < chunkCount; subtreeIndex++) {
    const subtreeChunkCount = Math.min(subtreeLength, chunkCount - chunkOffset);
    const subtreeRoot = new Uint8Array(32);
    const start = chunkOffset * 32;
    const end = start + subtreeChunkCount * 32;

    let subtreeBytes: Uint8Array;
    if (subtreeChunkCount === subtreeLength && (subtreeLength === 1 || subtreeChunkCount % 2 === 0)) {
      subtreeBytes = chunksBytes.subarray(start, end);
    } else {
      subtreeBytes = new Uint8Array(Math.max(32, Math.ceil(subtreeChunkCount / 2) * 64));
      subtreeBytes.set(chunksBytes.subarray(start, end));
    }

    merkleizeBlocksBytes(subtreeBytes, subtreeLength, subtreeRoot, 0);
    subtreeRoots[subtreeIndex] = subtreeRoot;

    chunkOffset += subtreeChunkCount;
    subtreeLength *= SCALING_FACTOR;
  }

  const root = new Uint8Array(32);
  for (let i = subtreeRoots.length - 1; i >= 0; i--) {
    digest64Into(subtreeRoots[i], root, root);
  }
  output.set(root, offset);
}

export function progressiveSubtreeFillToContents(nodes: Node[]): Node {
  if (nodes.length === 0) {
    return zeroNode(0);
  }

  const subtreeRoots: Node[] = [];
  let nodeOffset = 0;
  let subtreeLength = BASE_CHUNK_COUNT;

  for (let subtreeIndex = 0; nodeOffset < nodes.length; subtreeIndex++) {
    const subtreeNodeCount = Math.min(subtreeLength, nodes.length - nodeOffset);
    const subtreeDepth = progressiveSubtreeDepth(subtreeIndex);
    subtreeRoots.push(subtreeFillToContents(nodes.slice(nodeOffset, nodeOffset + subtreeNodeCount), subtreeDepth));
    nodeOffset += subtreeNodeCount;
    subtreeLength *= SCALING_FACTOR;
  }

  let root = zeroNode(0);
  for (let i = subtreeRoots.length - 1; i >= 0; i--) {
    root = new BranchNode(subtreeRoots[i], root);
  }
  return root;
}

export function getNodesAtProgressiveDepth(rootNode: Node, count: number): Node[] {
  // Fill by offset: spreading a large subtree into `push(...)` exceeds V8's argument limit.
  const nodes = new Array<Node>(count);
  let node = rootNode;
  let remaining = count;
  let offset = 0;
  let subtreeLength = BASE_CHUNK_COUNT;

  for (let subtreeIndex = 0; remaining > 0; subtreeIndex++) {
    if (node.isLeaf()) {
      throw Error("Invalid progressive tree: missing subtree branch");
    }

    const subtreeNodeCount = Math.min(subtreeLength, remaining);
    const subtreeDepth = progressiveSubtreeDepth(subtreeIndex);
    const subtreeNodes = getNodesAtDepth(node.left, subtreeDepth, 0, subtreeNodeCount);
    for (let i = 0; i < subtreeNodes.length; i++) {
      nodes[offset + i] = subtreeNodes[i];
    }
    offset += subtreeNodeCount;
    node = node.right;
    remaining -= subtreeNodeCount;
    subtreeLength *= SCALING_FACTOR;
  }

  return nodes;
}
