import {LeafNode, Node, getNodeH, setNodeH} from "./node.ts";
import {subtreeFillToContents} from "./subtree.ts";

const NUMBER_2_POW_32 = 2 ** 32;

export function packedRootsBytesToNode(depth: number, dataView: DataView, start: number, end: number): Node {
  const leafNodes = packedRootsBytesToLeafNodes(dataView, start, end);
  return subtreeFillToContents(leafNodes, depth);
}

/**
 * Pack a list of uint64 numbers into a list of LeafNodes.
 * Each value is UintNum64, which is 8 bytes long, which is 2 h values.
 * Each 4 of them forms a LeafNode.
 *
 *      v0            v1           v2          v3
 * |-------------|-------------|-------------|-------------|
 *
 *    h0     h1     h2     h3     h4     h5     h6     h7
 * |------|------|------|------|------|------|------|------|
 */
export function packedUintNum64sToLeafNodes(values: number[]): LeafNode[] {
  const leafNodes = new Array<LeafNode>(Math.ceil(values.length / 4));
  for (let i = 0; i < values.length; i++) {
    const nodeIndex = Math.floor(i / 4);
    const leafNode = leafNodes[nodeIndex] ?? new LeafNode(0, 0, 0, 0, 0, 0, 0, 0);
    const vIndex = i % 4;
    const hIndex = 2 * vIndex;
    const value = values[i];
    // same logic to UintNumberType.value_serializeToBytes() for 8 bytes
    if (value === Infinity) {
      setNodeH(leafNode, hIndex, 0xffffffff);
      setNodeH(leafNode, hIndex + 1, 0xffffffff);
    } else {
      setNodeH(leafNode, hIndex, value & 0xffffffff);
      setNodeH(leafNode, hIndex + 1, (value / NUMBER_2_POW_32) & 0xffffffff);
    }
    leafNodes[nodeIndex] = leafNode;
  }
  return leafNodes;
}

/**
 * Optimized deserialization of linear bytes to consecutive leaf nodes
 */
export function packedRootsBytesToLeafNodes(dataView: DataView, start: number, end: number): Node[] {
  const size = end - start;
  const fullLeafBytes = 32;

  // If the offset in data is not a multiple of 4, Uint32Array can't be used
  // > start offset of Uint32Array should be a multiple of 4
  // NOTE: Performance tests show that using a DataView is as fast as Uint32Array

  const fullNodeCount = Math.floor(size / fullLeafBytes);
  const leafNodes = new Array<LeafNode>(Math.ceil(size / fullLeafBytes));

  // Efficiently construct the tree writing to hashObjects directly
  for (let i = 0; i < fullNodeCount; i++) {
    const offset = start + i * fullLeafBytes;
    leafNodes[i] = new LeafNode(
      dataView.getUint32(offset + 0, true),
      dataView.getUint32(offset + 4, true),
      dataView.getUint32(offset + 8, true),
      dataView.getUint32(offset + 12, true),
      dataView.getUint32(offset + 16, true),
      dataView.getUint32(offset + 20, true),
      dataView.getUint32(offset + 24, true),
      dataView.getUint32(offset + 28, true)
    );
  }


  // Instead of creating a LeafNode with zeros and then overwriting some properties, we do a
  // single write in the constructor: We pass all eight hValues to the LeafNode constructor.
  const remainderBytes = size % fullLeafBytes;
  if (remainderBytes > 0) {
    const offset = start + fullNodeCount * fullLeafBytes;
    // Precompute final h values once
    const hValues = [0, 0, 0, 0, 0, 0, 0, 0];

    // Whole 4-byte words we can take directly
    const fullWordCount = Math.floor(remainderBytes / 4);
    for (let i = 0; i < fullWordCount; i++) {
      hValues[i] = dataView.getUint32(offset + i * 4, true);
    }

    // Remaining bytes that form a partial word
    const remainderByteCount = remainderBytes % 4;
    if (remainderByteCount > 0) {
      let h = 0;
      const partialOffset = offset + fullWordCount * 4;
      for (let j = 0; j < remainderByteCount; j++) {
        h |= dataView.getUint8(partialOffset + j) << (j * 8);
      }
      hValues[fullWordCount] = h;
    }

    // Create the partial node with all h values set once
    leafNodes[fullNodeCount] = new LeafNode(
      hValues[0],
      hValues[1],
      hValues[2],
      hValues[3],
      hValues[4],
      hValues[5],
      hValues[6],
      hValues[7]
    );
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
