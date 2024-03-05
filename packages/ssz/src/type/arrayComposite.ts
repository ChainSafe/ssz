import {Node, getNodesAtDepth, subtreeFillToContents} from "@chainsafe/persistent-merkle-tree";
import {ValueOf, ByteViews} from "./abstract";
import {CompositeType} from "./composite";
import {addLengthNode, assertValidArrayLength} from "./arrayBasic";

// There's a matrix of Array-ish types that require a combination of this functions.
// Regular class extends syntax doesn't work because it can only extend a single class.
//
// Type of array: List, Vector. Changes length property
// Type of element: Basic, Composite. Changes merkelization if packing or not.
// If Composite: Fixed len, Variable len. Changes the serialization requiring offsets.

export type ArrayProps = {isList: true; limit: number} | {isList: false; length: number};

export function minSizeArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  minCount: number
): number {
  // Variable Length
  if (elementType.fixedSize === null) {
    return minCount * (4 + elementType.minSize);
  }
  // Fixed length
  else {
    return minCount * elementType.minSize;
  }
}

export function maxSizeArrayComposite<ElementType extends CompositeType<unknown, unknown, unknown>>(
  elementType: ElementType,
  maxCount: number
): number {
  // Variable Length
  if (elementType.fixedSize === null) {
    return maxCount * (4 + elementType.maxSize);
  }
  // Fixed length
  else {
    return maxCount * elementType.maxSize;
  }
}

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
  output: ByteViews,
  offset: number,
  value: ValueOf<ElementType>[]
): number {
  // Variable length
  if (elementType.fixedSize === null) {
    let variableIndex = offset + length * 4;
    for (let i = 0; i < length; i++) {
      // write offset
      output.dataView.setUint32(offset + i * 4, variableIndex - offset, true);
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
  data: ByteViews,
  start: number,
  end: number,
  arrayProps: ArrayProps
): ValueOf<ElementType>[] {
  const offsets = readOffsetsArrayComposite(elementType.fixedSize, data.dataView, start, end, arrayProps);
  const length = offsets.length; // Capture length before pushing end offset

  const values = new Array<ValueOf<ElementType>>(length);

  // offests include the last element end
  for (let i = 0; i < length; i++) {
    // The offsets are relative to the start
    const startEl = start + offsets[i];
    const endEl = i === length - 1 ? end : start + offsets[i + 1];
    values[i] = elementType.value_deserializeFromBytes(data, startEl, endEl);
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
  output: ByteViews,
  offset: number,
  cachedNodes: Node[] | null = null
): number {
  const nodes = cachedNodes ?? getNodesAtDepth(node, depth, 0, length);

  // Variable Length
  // Indices contain offsets, which are indices deeper in the byte array
  if (elementType.fixedSize === null) {
    let variableIndex = offset + length * 4;
    const {dataView} = output;
    for (let i = 0; i < nodes.length; i++) {
      // write offset
      dataView.setUint32(offset + i * 4, variableIndex - offset, true);
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
  data: ByteViews,
  start: number,
  end: number,
  arrayProps: ArrayProps
): Node {
  const offsets = readOffsetsArrayComposite(elementType.fixedSize, data.dataView, start, end, arrayProps);
  const length = offsets.length; // Capture length before pushing end offset

  const nodes = new Array<Node>(length);

  // offests include the last element end
  for (let i = 0; i < length; i++) {
    // The offsets are relative to the start
    const startEl = start + offsets[i];
    const endEl = i === length - 1 ? end : start + offsets[i + 1];
    nodes[i] = elementType.tree_deserializeFromBytes(data, startEl, endEl);
  }

  // Abstract converting data to LeafNode to allow for custom data representation, such as the hashObject
  const chunksNode = subtreeFillToContents(nodes, chunkDepth);

  // TODO: Add LeafNode.fromUint()
  if (arrayProps.isList) {
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
): Uint8Array[] {
  const roots = new Array<Uint8Array>(length);

  for (let i = 0; i < length; i++) {
    roots[i] = elementType.hashTreeRoot(value[i]);
  }

  return roots;
}

function readOffsetsArrayComposite(
  elementFixedSize: null | number,
  data: DataView,
  start: number,
  end: number,
  arrayProps: ArrayProps
): Uint32Array {
  const size = end - start;
  let offsets: Uint32Array;

  // Variable Length
  // Indices contain offsets, which are indices deeper in the byte array
  if (elementFixedSize === null) {
    offsets = readVariableOffsetsArrayComposite(data, start, size);
  }

  // Fixed length
  else {
    // There's no valid CompositeType with fixed size 0, it's un-rechable code. But prevents diving by zero
    /* istanbul ignore if */
    if (elementFixedSize === 0) {
      throw Error("element fixed length is 0");
    }
    if (size % elementFixedSize !== 0) {
      throw Error(`size ${size} is not multiple of element fixedSize ${elementFixedSize}`);
    }

    const length = size / elementFixedSize;
    offsets = new Uint32Array(length);

    for (let i = 0; i < length; i++) {
      offsets[i] = i * elementFixedSize;
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
function readVariableOffsetsArrayComposite(dataView: DataView, start: number, size: number): Uint32Array {
  if (size === 0) {
    return new Uint32Array(0);
  }

  // all elements are variable-sized
  // indices contain offsets, which are indices deeper in the byte array

  // The serialized data will start with offsets of all the serialized objects (BYTES_PER_LENGTH_OFFSET bytes each)
  const firstOffset = dataView.getUint32(start, true);

  // Using the first offset, we can compute the length of the list (divide by BYTES_PER_LENGTH_OFFSET), as it gives
  // us the total number of bytes in the offset data
  const offsetDataLength = firstOffset;

  if (firstOffset === 0) {
    throw Error("First offset must be > 0");
  }

  if (offsetDataLength % 4 !== 0) {
    throw Error("Offset data length not multiple of 4");
  }

  const offsetCount = offsetDataLength / 4;
  const offsets = new Uint32Array(offsetCount);
  offsets[0] = firstOffset;

  // ArrayComposite has a contiguous section of offsets, then the data
  //
  //    [offset 1] [offset 2] [data 1 ..........] [data 2 ..]
  // 0x 08000000   0e000000   010002000300        01000200
  //
  // Ensure that:
  // - Offsets point to regions of > 0 bytes, i.e. are increasing
  // - Offsets don't point to bytes outside of the array's size
  //
  // In the example above the first offset is 8, so 8 / 4 = 2 offsets.
  // Then, read the rest of offsets to get offsets = [8, 14]

  for (let offsetIdx = 1; offsetIdx < offsetCount; offsetIdx++) {
    const offset = dataView.getUint32(start + offsetIdx * 4, true);
    offsets[offsetIdx] = offset;

    // Offsets must point to data within the Array bytes section
    if (offset > size) {
      throw new Error(`Offset out of bounds ${offset} > ${size}`);
    }

    if (offset < offsets[offsetIdx - 1]) {
      throw new Error(`Offsets must be increasing ${offset} < ${offsets[offsetIdx - 1]}`);
    }
  }

  return offsets;
}
