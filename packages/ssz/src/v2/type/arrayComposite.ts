import {
  BranchNode,
  LeafNode,
  Node,
  zeroNode,
  getNodesAtDepth,
  subtreeFillToContents,
} from "@chainsafe/persistent-merkle-tree";
import {Type, CompositeType, ValueOf} from "../abstract";
import {assertValidArrayLength} from "./arrayBasic";

// There's a matrix of Array-ish types that require a combination of this functions.
// Regular class extends syntax doesn't work because it can only extend a single class.
//
// Type of array: List, Vector. Changes length property
// Type of element: Basic, Composite. Changes merkelization if packing or not.
// If Composite: Fixed len, Variable len. Changes the serialization requiring offsets.

/**
 * SSZ Lists (variable-length arrays) include the length of the list in the tree
 * This length is always in the same index in the tree
 * ```
 *   1
 *  / \
 * 2   3 // <-here
 * ```
 */
export function getLengthFromRootNode(node: Node): number {
  return (node.right as LeafNode).getUint(4, 0);
}
export function getChunksNodeFromRootNode(node: Node): Node {
  return node.left;
}

export function addLengthNode(chunksNode: Node, length: number): Node {
  // TODO: Add LeafNode.fromUint()
  const lengthNode = new LeafNode(zeroNode(0));
  lengthNode.setUint(4, 0, length);

  return new BranchNode(chunksNode, lengthNode);
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function defaultValueVector<ElementType extends Type<any>>(
  elementType: ElementType,
  length: number
): ValueOf<ElementType>[] {
  const values: ValueOf<ElementType>[] = [];
  for (let i = 0; i < length; i++) {
    values.push(elementType.defaultValue);
  }
  return values;
}

export type ArrayProps = {
  /** Vector length */
  length?: number;
  /** List limit */
  limit?: number;
};

export function value_serializedSizeArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  value: ValueOf<ElementType>[],
  arrayProps: ArrayProps
): number {
  const length = arrayProps.length ? arrayProps.length : value.length;
  let totalSize = 0;
  for (let i = 0; i < length; i++) {
    totalSize += elementType.value_serializedSize(value[i]);
  }
  return totalSize;
}

export function value_deserializeFromBytesArrayComposite<
  ElementType extends CompositeType<ValueOf<ElementType>, unknown, unknown>
>(
  elementType: ElementType,
  data: Uint8Array,
  start: number,
  end: number,
  arrayProps: ArrayProps
): ValueOf<ElementType>[] {
  const offsets = getOffsetsArrayComposite(elementType.fixedLen, data, start, end, arrayProps);

  const values: ValueOf<ElementType>[] = [];

  offsets.push(end);
  // offests include the last element end
  for (let i = 0; i < offsets.length - 1; i++) {
    const startEl = offsets[i];
    const endEl = offsets[i + 1];
    values.push(elementType.value_deserializeFromBytes(data, startEl, endEl));
  }

  return values;
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function value_serializeToBytesArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  length: number,
  output: Uint8Array,
  offset: number,
  value: ValueOf<ElementType>[]
): number {
  // Variable length
  if (elementType.fixedLen === null) {
    let variableIndex = offset + length * 4;
    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    for (let i = 0; i < length; i++) {
      // write offset
      fixedSection.setUint32(i * 4, variableIndex - offset, true);
      // write serialized element to variable section
      variableIndex = elementType.value_serializeToBytes(output, variableIndex, value[i]);
    }
    return variableIndex;
  }

  // Fixed length
  else {
    for (let i = 0; i < length; i++) {
      elementType.value_serializeToBytes(output, offset + i * elementType.fixedLen, value[i]);
    }
    return offset + length * elementType.fixedLen;
  }
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function tree_serializedSizeArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  length: number,
  depth: number,
  node: Node
): number {
  const nodes = getNodesAtDepth(node, depth, 0, length);

  // Variable Length
  if (elementType.fixedLen === null) {
    let size = 0;
    for (let i = 0; i < nodes.length; i++) {
      size += 4 + elementType.tree_serializedSize(nodes[i]);
    }
    return size;
  }

  // Fixed length
  else {
    return length * elementType.fixedLen;
  }
}

export function tree_deserializeFromBytesArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  depth: number,
  data: Uint8Array,
  start: number,
  end: number,
  arrayProps: ArrayProps
): Node {
  const offsets = getOffsetsArrayComposite(elementType.fixedLen, data, start, end, arrayProps);

  const nodes: Node[] = [];

  offsets.push(end);
  // offests include the last element end
  for (let i = 0; i < offsets.length - 1; i++) {
    const startEl = offsets[i];
    const endEl = offsets[i + 1];
    nodes.push(elementType.tree_deserializeFromBytes(data, startEl, endEl));
  }

  // Abstract converting data to LeafNode to allow for custom data representation, such as the hashObject
  const chunkDepth = arrayProps.limit ? depth - 1 : depth;
  const chunksNode = subtreeFillToContents(nodes, chunkDepth);

  // TODO: Add LeafNode.fromUint()
  if (arrayProps.limit) {
    return addLengthNode(chunksNode, offsets.length);
  } else {
    return chunksNode;
  }
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function tree_serializeToBytesArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  length: number,
  depth: number,
  node: Node,
  output: Uint8Array,
  offset: number
): number {
  const nodes = getNodesAtDepth(node, depth, 0, length);

  // Variable Length
  // Indices contain offsets, which are indices deeper in the byte array
  if (elementType.fixedLen === null) {
    let variableIndex = offset + length * 4;
    const fixedSection = new DataView(output.buffer, output.byteOffset + offset, length * 4);
    for (let i = 0; i < nodes.length; i++) {
      // write offset
      fixedSection.setUint32(i * 4, variableIndex - offset, true);
      // write serialized element to variable section
      variableIndex = elementType.tree_serializeToBytes(output, variableIndex, nodes[i]);
    }
    return variableIndex;
  }

  // Fixed length
  else {
    let index = offset;
    for (let i = 0; i < nodes.length; i++) {
      index = elementType.tree_serializeToBytes(output, index, nodes[i]);
    }
    return index;
  }
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function value_getRootsArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  length: number,
  value: ValueOf<ElementType>[]
): Uint8Array {
  const roots = new Uint8Array(32 * length);

  for (let i = 0; i < length; i++) {
    const root = elementType.hashTreeRoot(value[i]);
    roots.set(root, 32 * i);
  }

  return roots;
}

function getOffsetsArrayComposite(
  fixedLen: null | number,
  data: Uint8Array,
  start: number,
  end: number,
  arrayProps: ArrayProps
): number[] {
  const size = end - start;
  let offsets: number[] = [];

  // Variable Length
  // Indices contain offsets, which are indices deeper in the byte array
  if (fixedLen === null) {
    offsets = getVariableOffsetsArrayComposite(data.buffer, data.byteOffset + start, end - start);
  }

  // Fixed length
  else {
    if (fixedLen === 0) {
      throw Error("element fixed length is 0");
    }
    if (size % fixedLen !== 0) {
      throw Error(`size ${size} is not multiple of element fixedLen ${fixedLen}`);
    }

    const length = size / fixedLen;
    for (let i = 0; i < length; i++) {
      offsets.push(i * fixedLen);
    }
  }

  // Vector + List length validation
  assertValidArrayLength(offsets.length, arrayProps);

  return offsets;
}

function getVariableOffsetsArrayComposite(buffer: ArrayBufferLike, byteOffset: number, length: number): number[] {
  if (length === 0) {
    return [];
  }
  const offsets: number[] = [];
  // all elements are variable-sized
  // indices contain offsets, which are indices deeper in the byte array
  const fixedSection = new DataView(buffer, byteOffset, length);
  const firstOffset = fixedSection.getUint32(0, true);
  let currentOffset = firstOffset;
  let nextOffset;
  let currentIndex = 0;
  let nextIndex = 0;
  while (currentIndex < firstOffset) {
    if (currentOffset > length) {
      throw new Error("Offset out of bounds");
    }
    nextIndex = currentIndex + 4;
    nextOffset = nextIndex === firstOffset ? length : fixedSection.getUint32(nextIndex, true);
    if (currentOffset > nextOffset) {
      throw new Error("Offsets must be increasing");
    }
    offsets.push(currentOffset);
    currentIndex = nextIndex;
    currentOffset = nextOffset;
  }
  if (firstOffset !== currentIndex) {
    throw new Error("First offset skips variable data");
  }
  return offsets;
}
