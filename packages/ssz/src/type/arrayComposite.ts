import {Node, getNodesAtDepth, subtreeFillToContents} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "./abstract";
import {CompositeType} from "./composite";
import {addLengthNode, assertValidArrayLength} from "./arrayBasic";

// There's a matrix of Array-ish types that require a combination of this functions.
// Regular class extends syntax doesn't work because it can only extend a single class.
//
// Type of array: List, Vector. Changes length property
// Type of element: Basic, Composite. Changes merkelization if packing or not.
// If Composite: Fixed len, Variable len. Changes the serialization requiring offsets.

export type ArrayProps = {
  /** Vector length */
  length?: number;
  /** List limit */
  limit?: number;
};

export function value_serializedSizeArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  length: number,
  value: ValueOf<ElementType>[]
): number {
  // Variable Length
  if (elementType.fixedSize === null) {
    let size = 0;
    for (let i = 0; i < length; i++) {
      size += 4 + elementType.value_serializedSize(value[i]);
    }
    return size;
  }

  // Fixed length
  else {
    return length * elementType.fixedSize;
  }
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
  if (elementType.fixedSize === null) {
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
      elementType.value_serializeToBytes(output, offset + i * elementType.fixedSize, value[i]);
    }
    return offset + length * elementType.fixedSize;
  }
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
  const offsets = readOffsetsArrayComposite(elementType.fixedSize, data, start, end, arrayProps);
  const length = offsets.length; // Capture length before pushing end offset
  offsets.push(end);

  const values: ValueOf<ElementType>[] = [];

  // offests include the last element end
  for (let i = 0; i < length; i++) {
    const startEl = offsets[i];
    const endEl = offsets[i + 1];
    values.push(elementType.value_deserializeFromBytes(data, startEl, endEl));
  }

  return values;
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
  // Variable Length
  if (elementType.fixedSize === null) {
    const nodes = getNodesAtDepth(node, depth, 0, length);

    let size = 0;
    for (let i = 0; i < nodes.length; i++) {
      size += 4 + elementType.tree_serializedSize(nodes[i]);
    }
    return size;
  }

  // Fixed length
  else {
    return length * elementType.fixedSize;
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
  if (elementType.fixedSize === null) {
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
    for (let i = 0; i < nodes.length; i++) {
      offset = elementType.tree_serializeToBytes(output, offset, nodes[i]);
    }
    return offset;
  }
}

export function tree_deserializeFromBytesArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  chunkDepth: number,
  data: Uint8Array,
  start: number,
  end: number,
  arrayProps: ArrayProps
): Node {
  const offsets = readOffsetsArrayComposite(elementType.fixedSize, data, start, end, arrayProps);
  const length = offsets.length; // Capture length before pushing end offset
  offsets.push(end);

  const nodes: Node[] = [];

  // offests include the last element end
  for (let i = 0; i < length; i++) {
    const startEl = offsets[i];
    const endEl = offsets[i + 1];
    nodes.push(elementType.tree_deserializeFromBytes(data, startEl, endEl));
  }

  // Abstract converting data to LeafNode to allow for custom data representation, such as the hashObject
  const chunksNode = subtreeFillToContents(nodes, chunkDepth);

  // TODO: Add LeafNode.fromUint()
  if (arrayProps.limit) {
    return addLengthNode(chunksNode, length);
  } else {
    return chunksNode;
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

function readOffsetsArrayComposite(
  elementFixedSize: null | number,
  data: Uint8Array,
  start: number,
  end: number,
  arrayProps: ArrayProps
): number[] {
  const size = end - start;
  let offsets: number[] = [];

  // Variable Length
  // Indices contain offsets, which are indices deeper in the byte array
  if (elementFixedSize === null) {
    offsets = readVariableOffsetsArrayComposite(data.buffer, data.byteOffset + start, size);
  }

  // Fixed length
  else {
    if (elementFixedSize === 0) {
      throw Error("element fixed length is 0");
    }
    if (size % elementFixedSize !== 0) {
      throw Error(`size ${size} is not multiple of element fixedSize ${elementFixedSize}`);
    }

    const length = size / elementFixedSize;
    for (let i = 0; i < length; i++) {
      offsets.push(i * elementFixedSize);
    }
  }

  // Vector + List length validation
  assertValidArrayLength(offsets.length, arrayProps);

  return offsets;
}

/**
 * Reads the values of contiguous variable offsets. Provided buffer includes offsets that point to position
 * within `size`. This function also validates that all offsets are in range.
 */
function readVariableOffsetsArrayComposite(buffer: ArrayBufferLike, byteOffset: number, size: number): number[] {
  if (size === 0) {
    return [];
  }
  const offsets: number[] = [];
  // all elements are variable-sized
  // indices contain offsets, which are indices deeper in the byte array
  const fixedSection = new DataView(buffer, byteOffset, size);
  const firstOffset = fixedSection.getUint32(0, true);
  let currentOffset = firstOffset;
  let nextOffset;
  let currentIndex = 0;
  let nextIndex = 0;
  while (currentIndex < firstOffset) {
    if (currentOffset > size) {
      throw new Error("Offset out of bounds");
    }
    nextIndex = currentIndex + 4;
    nextOffset = nextIndex === firstOffset ? size : fixedSection.getUint32(nextIndex, true);
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
