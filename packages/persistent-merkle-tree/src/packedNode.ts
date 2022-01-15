import {subtreeFillToContents} from "./subtree";
import {Node, LeafNode, getNodeH, setNodeH} from "./node";

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
  const leafNodes: LeafNode[] = [];

  // Efficiently construct the tree writing to hashObjects directly

  // TODO: Optimize, with this approach each h property is written twice
  for (let i = 0; i < fullNodeCount; i++) {
    const offset = start + i * 32;
    leafNodes.push(
      new LeafNode({
        h0: dataView.getInt32(offset + 0, true),
        h1: dataView.getInt32(offset + 4, true),
        h2: dataView.getInt32(offset + 8, true),
        h3: dataView.getInt32(offset + 12, true),
        h4: dataView.getInt32(offset + 16, true),
        h5: dataView.getInt32(offset + 20, true),
        h6: dataView.getInt32(offset + 24, true),
        h7: dataView.getInt32(offset + 28, true),
      })
    );
  }

  // Consider that the last node may only include partial data
  const remainderBytes = size % 32;

  // Last node
  if (remainderBytes > 0) {
    const node = new LeafNode({
      h0: 0,
      h1: 0,
      h2: 0,
      h3: 0,
      h4: 0,
      h5: 0,
      h6: 0,
      h7: 0,
    });
    leafNodes.push(node);

    // Loop to dynamically copy the full h values
    const fullHCount = Math.floor(remainderBytes / 4);
    for (let h = 0; h < fullHCount; h++) {
      setNodeH(node, h, dataView.getInt32(start + fullNodeCount * 32 + h * 4, true));
    }

    const remainderUint32 = size % 4;
    if (remainderUint32 > 0) {
      let h = 0;
      for (let i = 0; i < remainderUint32; i++) {
        h |= dataView.getUint8(start + size - remainderUint32 + i) << (i * 8);
      }
      setNodeH(node, fullHCount, h);
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
    const offset = start + i * 32;
    dataView.setInt32(offset + 0, node.h0, true);
    dataView.setInt32(offset + 4, node.h1, true);
    dataView.setInt32(offset + 8, node.h2, true);
    dataView.setInt32(offset + 12, node.h3, true);
    dataView.setInt32(offset + 16, node.h4, true);
    dataView.setInt32(offset + 20, node.h5, true);
    dataView.setInt32(offset + 24, node.h6, true);
    dataView.setInt32(offset + 28, node.h7, true);
  }

  // Last node
  if (remainderBytes > 0) {
    const node = nodes[fullNodeCount];

    // Loop to dynamically copy the full h values
    const fullHCount = Math.floor(remainderBytes / 4);
    for (let h = 0; h < fullHCount; h++) {
      dataView.setInt32(start + fullNodeCount * 32 + h * 4, getNodeH(node, h), true);
    }

    const remainderUint32 = size % 4;
    if (remainderUint32 > 0) {
      const h = getNodeH(node, fullHCount);
      for (let i = 0; i < remainderUint32; i++) {
        dataView.setUint8(start + size - remainderUint32 + i, (h >> (i * 8)) & 0xff);
      }
    }
  }
}
