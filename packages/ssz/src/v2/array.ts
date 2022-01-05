import {
  BranchNode,
  LeafNode,
  Node,
  zeroNode,
  getNodesAtDepth,
  subtreeFillToContents,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../backings";
import {Type, BasicType, CompositeType} from "./abstract";

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

  // Vector + List length validation
  const length = (end - start) / elSize;
  assertValidArrayLength(length, arrayProps, true);

  for (let i = 0; i < length; i++) {
    // TODO: If faster, consider skipping size check for uint types
    values.push(elementType.struct_deserializeFromBytes(data, start + i * elSize, start + (i + 1) * elSize));
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
  chunkDepth: number,
  data: Uint8Array,
  start: number,
  end: number,
  arrayProps: ArrayProps
): Node {
  // Vector + List length validation
  const length = (end - start) / elementType.byteLength;
  assertValidArrayLength(length, arrayProps, true);

  // Abstract converting data to LeafNode to allow for custom data representation, such as the hashObject
  const chunksNode = packedRootsBytesToNode(chunkDepth, data, start, end);

  if (arrayProps.limit) {
    return addLengthNode(chunksNode, length);
  } else {
    return chunksNode;
  }
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

export function struct_serializedSizeArrayComposite<ElementType extends CompositeType<any, any, any>>(
  elementType: ElementType,
  value: ValueOf<ElementType>[],
  arrayProps: ArrayProps
): number {
  const length = arrayProps.length ? arrayProps.length : value.length;
  let totalSize = 0;
  for (let i = 0; i < length; i++) {
    totalSize += elementType.struct_serializedSize(value[i]);
  }
  return totalSize;
}

export function struct_deserializeFromBytesArrayComposite<ElementType extends CompositeType<any, any, any>>(
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
export function struct_serializeToBytesArrayComposite<ElementType extends CompositeType<any, any, any>>(
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

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function tree_serializedSizeArrayComposite<ElementType extends CompositeType<any, any, any>>(
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

export function tree_deserializeFromBytesArrayComposite<ElementType extends CompositeType<any, any, any>>(
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
export function tree_serializeToBytesArrayComposite<ElementType extends CompositeType<any, any, any>>(
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
export function struct_getRootsArrayComposite<ElementType extends CompositeType<any, any, any>>(
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

/**
 * @param length In List length = undefined, Vector length = fixed value
 */
export function struct_fromJsonArray<ElementType extends Type<any>>(
  elementType: ElementType,
  json: unknown,
  length?: number
): ValueOf<ElementType>[] {
  if (!Array.isArray(json)) {
    throw Error("JSON must be an array");
  }

  if (length === undefined) {
    length = json.length;
  }

  const value: ValueOf<ElementType>[] = [];
  for (let i = 0; i < length; i++) {
    value.push(elementType.fromJson(json[i]));
  }
  return value;
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

/**
 * @param checkNonDecimalLength Check that length is a multiple of element size.
 * Optional since it's not necessary in getOffsetsArrayComposite() fn.
 */
function assertValidArrayLength(length: number, arrayProps: ArrayProps, checkNonDecimalLength?: boolean): void {
  if (checkNonDecimalLength && length % 1 !== 0) {
    throw Error("size not multiple of element fixedLen");
  }

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
