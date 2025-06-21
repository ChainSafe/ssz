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
  const fullNodeCount = Math.floor(values.length / 4);
  const leafNodes = new Array<LeafNode>(Math.ceil(values.length / 4));
  for (let i = 0; i < fullNodeCount; i++) {
    const start = i * 4;
    const v0 = values[start];
    const v1 = values[start + 1];
    const v2 = values[start + 2];
    const v3 = values[start + 3];

    // write values directly into the constructor
    leafNodes[i] = new LeafNode(
      v0 === Infinity ? 0xffffffff : v0 & 0xffffffff,
      v0 === Infinity ? 0xffffffff : (v0 / NUMBER_2_POW_32) & 0xffffffff,
      v1 === Infinity ? 0xffffffff : v1 & 0xffffffff,
      v1 === Infinity ? 0xffffffff : (v1 / NUMBER_2_POW_32) & 0xffffffff,
      v2 === Infinity ? 0xffffffff : v2 & 0xffffffff,
      v2 === Infinity ? 0xffffffff : (v2 / NUMBER_2_POW_32) & 0xffffffff,
      v3 === Infinity ? 0xffffffff : v3 & 0xffffffff,
      v3 === Infinity ? 0xffffffff : (v3 / NUMBER_2_POW_32) & 0xffffffff
    );
  }

  // If there are remaining values, create a partial LeafNode to store them
  const remainderValues = values.length % 4;
  if (remainderValues > 0) {
    // Calculate the starting index in the values array for the remaining values
    // fullNodeCount is the number of full nodes, each handling 4 values
    const start = fullNodeCount * 4;
    const hValues = new Array(8).fill(0);

    for (let j = 0; j < remainderValues; j++) {
      const value = values[start + j];
      const hIndex = 2 * j;

      if (value === Infinity) {
        hValues[hIndex] = 0xffffffff;
        hValues[hIndex + 1] = 0xffffffff;
      } else {
        hValues[hIndex] = value & 0xffffffff;
        hValues[hIndex + 1] = (value / NUMBER_2_POW_32) & 0xffffffff;
      }
    }
    leafNodes[fullNodeCount] = new LeafNode(
      hValues[0], hValues[1], hValues[2], hValues[3],
      hValues[4], hValues[5], hValues[6], hValues[7]
    );
  }
  return leafNodes;
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

 // Efficiently construct the tree writing to hashObjects directly
  for (let i = 0; i < fullNodeCount; i++) {
    const offset = start + i * 32;
    leafNodes[i] = new LeafNode(
      dataView.getInt32(offset + 0, true),
      dataView.getInt32(offset + 4, true),
      dataView.getInt32(offset + 8, true),
      dataView.getInt32(offset + 12, true),
      dataView.getInt32(offset + 16, true),
      dataView.getInt32(offset + 20, true),
      dataView.getInt32(offset + 24, true),
      dataView.getInt32(offset + 28, true)
    );
  }

// Consider that the last node may only include partial data
  const remainderBytes = size % 32;

  // Instead of creating a LeafNode with zeros and then overwriting some properties, we do a
  // single write in the constructor: We pass all eight hValues to the LeafNode constructor.
  if (remainderBytes > 0) {
    const offset = start + fullNodeCount * 32;
    const fullHCount = Math.floor(remainderBytes / 4);
    const remainderUint32 = remainderBytes % 4;
    const hValues = new Array(8).fill(0); // Temporary array initialized to zeros

    // Set fully available h values
    for (let i = 0; i < fullHCount; i++) {
      hValues[i] = dataView.getInt32(offset + i * 4, true);
    }

    // Set partial h value if there are remaining bytes
    if (remainderUint32 > 0) {
      let h = 0;
      const partialOffset = offset + fullHCount * 4;
      for (let j = 0; j < remainderUint32; j++) {
        h |= dataView.getUint8(partialOffset + j) << (j * 8);
      }
      hValues[fullHCount] = h;
    }

    // Create the partial node with all h values set once
    leafNodes[fullNodeCount] = new LeafNode(
      hValues[0], hValues[1], hValues[2], hValues[3],
      hValues[4], hValues[5], hValues[6], hValues[7]
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
