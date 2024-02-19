import {subtreeFillToContents} from "./subtree";
import {Node, LeafNode} from "./node";
import {getCache, getCacheOffset} from "@chainsafe/as-sha256";

export function packedRootsBytesToNode(depth: number, dataView: DataView, start: number, end: number): Node {
  const leafNodes = packedRootsBytesToLeafNodes(dataView, start, end);
  return subtreeFillToContents(leafNodes, depth);
}

/**
 * Optimized deserialization of linear bytes to consecutive leaf nodes
 */
export function packedRootsBytesToLeafNodes(dataView: DataView, start: number, end: number): Node[] {
  const size = end - start;

  // If the offset in data is not a multiple of 4, Uint32Array can't be used
  // > start offset of Uint32Array should be a multiple of 4
  // NOTE: Performance tests show that using a DataView is as fast as Uint32Array

  const fullNodeCount = Math.floor(size / 32);
  const leafNodes = new Array<LeafNode>(Math.ceil(size / 32));

  // Efficiently construct the tree writing to the hash cache directly

  // TODO: Optimize, with this approach each h property is written twice
  for (let i = 0; i < fullNodeCount; i++) {
    let offset = start + i * 32;
    const node = new LeafNode();
    leafNodes[i] = node;

    const {cache} = getCache(node.id);
    let cacheOffset = getCacheOffset(node.id);

    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
    cache[cacheOffset++] = dataView.getUint8(offset++);
  }

  // Consider that the last node may only include partial data
  const remainderBytes = size % 32;

  // Last node
  if (remainderBytes > 0) {
    let dataOffset = start + size - remainderBytes;

    const node = new LeafNode();
    leafNodes[fullNodeCount] = node;

    const {cache} = getCache(node.id);
    let cacheOffset = getCacheOffset(node.id);

    for (let i = 0; i < remainderBytes; i++) {
      cache[cacheOffset++] = dataView.getUint8(dataOffset++);
    }
  }

  return leafNodes;
}

/**
 * Optimized serialization of consecutive leave nodes to linear bytes
 */
export function packedNodeRootsToBytes(dataView: DataView, start: number, size: number, nodes: Node[]): void {
  // If the offset in data is not a multiple of 4, Uint32Array can't be used
  // > start offset of Uint32Array should be a multiple of 4
  // NOTE: Performance tests show that using a DataView is as fast as Uint32Array

  // Consider that the last node may only include partial data
  const remainderBytes = size % 32;

  // Full nodes
  // Efficiently get hashObjects data into data
  const fullNodeCount = Math.floor(size / 32);
  for (let i = 0; i < fullNodeCount; i++) {
    const node = nodes[i];
    let offset = start + i * 32;

    const {cache} = getCache(node.id);
    let cacheOffset = getCacheOffset(node.id);

    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
    dataView.setUint8(offset++, cache[cacheOffset++]);
  }

  // Last node
  if (remainderBytes > 0) {
    let dataOffset = start + size - remainderBytes;

    const node = nodes[fullNodeCount];

    const {cache} = getCache(node.id);
    let cacheOffset = getCacheOffset(node.id);

    for (let i = 0; i < remainderBytes; i++) {
      dataView.setUint8(dataOffset++, cache[cacheOffset++]);
    }
  }
}
