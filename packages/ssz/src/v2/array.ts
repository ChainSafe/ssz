import {
  LeafNode,
  Node,
  Tree,
  zeroNode,
  getNodesAtDepth,
  subtreeFillToContents,
  BranchNode,
} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../backings";
import {BasicType, CompositeType} from "./abstract";

/**
 * SSZ Lists (variable-length arrays) include the length of the list in the tree
 * This length is always in the same index in the tree
 * ```
 *   1
 *  / \
 * 2   3 // <-here
 * ```
 */
export const LENGTH_GINDEX = BigInt(3);

export function getLengthFromRootNode(node: Node): number {
  return (node.right as LeafNode).getUint(4, 0);
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ArrayProps = {
  /** Vector length */
  length?: number;
  /** List limit */
  limit?: number;
};

// There's a matrix of Array-ish types that require a combination of this functions.
// Regular class extends syntax doesn't work because it can only extend a single class.
//
// Type of array: List, Vector. Changes length property
// Type of element: Basic, Composite. Changes merkelization if packing or not.
// If Composite: Fixed len, Variable len. Changes the serialization requiring offsets.

// Basic
////////

export function struct_deserializeFromBytesArrayBasic<ElementType extends BasicType<any>>(
  elementType: ElementType,
  data: Uint8Array,
  start: number,
  end: number,
  arrayProps: ArrayProps
): ValueOf<ElementType>[] {
  const values: ValueOf<ElementType>[] = [];
  const elSize = elementType.byteLength;
  // TODO: Check length is non-decimal
  const length = (end - start) / elSize;

  // Vector + List length validation
  assertValidArrayLength(length, arrayProps);

  for (let i = 0; i < length; i++) {
    // Last arguemnt is 0 because basic types don't need and `end` param
    values.push(elementType.struct_deserializeFromBytes(data, start + i * elSize, 0));
  }

  return values;
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function struct_serializeToBytesArrayBasic<ElementType extends BasicType<any>>(
  elementType: ElementType,
  length: number,
  output: Uint8Array,
  offset: number,
  value: ValueOf<ElementType>[]
): number {
  const elSize = elementType.byteLength;
  for (let i = 0; i < length; i++) {
    elementType.struct_serializeToBytes(output, offset + i * elSize, value[i]);
  }
  return offset + length * elSize;
}

// List of basic elements will pack them in merkelized form
export function tree_deserializeFromBytesArrayBasic<ElementType extends BasicType<any>>(
  elementType: ElementType,
  depth: number,
  data: Uint8Array,
  start: number,
  end: number,
  arrayProps: ArrayProps
): Node {
  // TODO: Check length is non-decimal
  const length = (end - start) / elementType.byteLength;

  // Vector + List length validation
  assertValidArrayLength(length, arrayProps);

  // Abstract converting data to LeafNode to allow for custom data representation, such as the hashObject
  const tree = packedRootsBytesToTree(depth, data, start, end);

  // TODO: Add LeafNode.fromUint()
  const lengthNode = zeroNode(0);
  lengthNode.h0 = length;
  tree.setNode(LENGTH_GINDEX, lengthNode);

  return tree.rootNode;
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function tree_serializeToBytesArrayBasic<ElementType extends BasicType<any>>(
  elementType: ElementType,
  length: number,
  depth: number,
  output: Uint8Array,
  offset: number,
  node: Node
): number {
  const size = elementType.byteLength * length;
  const chunkCount = Math.ceil(size / 32);

  const nodes = getNodesAtDepth(node, depth, 0, chunkCount);
  packedNodeRootsToBytes(output, offset, size, nodes);

  return offset + size;
}

// Composite
////////////

export function struct_deserializeFromBytesArrayComposite<ElementType extends CompositeType<any>>(
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
    values.push(elementType.struct_deserializeFromBytes(data, startEl, endEl));
  }

  return values;
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function struct_serializeToBytesArrayComposite<ElementType extends CompositeType<any>>(
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
      variableIndex = elementType.struct_serializeToBytes(output, variableIndex, value[i]);
    }
    return variableIndex;
  }

  // Fixed length
  else {
    for (let i = 0; i < length; i++) {
      elementType.struct_serializeToBytes(output, offset + i * elementType.fixedLen, value[i]);
    }
    return offset + length * elementType.fixedLen;
  }
}

export function tree_deserializeFromBytesArrayComposite<ElementType extends CompositeType<any>>(
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
  const rootNodeItems = subtreeFillToContents(nodes, depth);

  // TODO: Add LeafNode.fromUint()
  const lengthNode = new LeafNode(zeroNode(0));
  lengthNode.setUint(4, 0, length);

  return new BranchNode(rootNodeItems, lengthNode);
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function tree_serializeToBytesArrayComposite<ElementType extends CompositeType<any>>(
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

function assertValidArrayLength(length: number, arrayProps: ArrayProps): void {
  // Vector + List length validation
  if (arrayProps.length !== undefined) {
    if (length !== arrayProps.length) {
      throw new Error(`Incorrect vector length ${length} expected ${arrayProps.length}`);
    }
  } else if (arrayProps.limit !== undefined) {
    if (length > arrayProps.limit) {
      throw new Error(`List length too big ${length} limit ${arrayProps.limit}`);
    }
  } else {
    throw Error("Must set either length or limit");
  }
}

/**
 * TODO: Move to persistent-merkle-tree
 */
export function packedRootsBytesToTree(depth: number, data: Uint8Array, start: number, end: number): Tree {
  const uint32Arr = new Uint32Array(data.buffer, start, end - start);
  // Efficiently construct the tree writing to hashObjects directly
}

/**
 * TODO: Move to persistent-merkle-tree
 */
export function packedNodeRootsToBytes(data: Uint8Array, start: number, size: number, nodes: Node[]): void {
  const uint32Arr = new Uint32Array(data.buffer, start, size);
  // Efficiently get hashObjects data into data

  // Consider that the last node may only include partial data
  const remainder = size % 32;
}
