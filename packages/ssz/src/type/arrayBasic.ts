import type {Node, HashComputationLevel} from "@chainsafe/persistent-merkle-tree";
import {
  BranchNode,
  LeafNode,
  getNodesAtDepth,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  levelAtIndex,
} from "@chainsafe/persistent-merkle-tree";
import type {Type, ValueOf} from "./abstract";
import type {ByteViews} from "./abstract";
import type {BasicType} from "./basic";

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
  // Length is represented as a Uint32 at the start of the chunk:
  // 4 = 4 bytes in Uint32
  // 0 = 0 offset bytes in Node's data
  return (node.right as LeafNode).getUint(4, 0);
}
export function getChunksNodeFromRootNode(node: Node): Node {
  return node.left;
}

export function addLengthNode(chunksNode: Node, length: number): Node {
  return new BranchNode(chunksNode, LeafNode.fromUint32(length));
}

export function setChunksNode(
  rootNode: Node,
  chunksNode: Node,
  newLength: number | null,
  hcOffset = 0,
  hcByLevel: HashComputationLevel[] | null = null
): Node {
  const lengthNode =
    newLength !== null
      ? // If newLength is set, create a new node for length
        LeafNode.fromUint32(newLength)
      : // else re-use existing node
        (rootNode.right as LeafNode);
  const branchNode = new BranchNode(chunksNode, lengthNode);
  if (hcByLevel !== null) {
    levelAtIndex(hcByLevel, hcOffset).push(chunksNode, lengthNode, branchNode);
  }
  return branchNode;
}

export type ArrayProps = {isList: true; limit: number} | {isList: false; length: number};

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function value_serializeToBytesArrayBasic<ElementType extends BasicType<unknown>>(
  elementType: ElementType,
  length: number,
  output: ByteViews,
  offset: number,
  value: ArrayLike<ValueOf<ElementType>>
): number {
  const elSize = elementType.byteLength;
  for (let i = 0; i < length; i++) {
    elementType.value_serializeToBytes(output, offset + i * elSize, value[i]);
  }
  return offset + length * elSize;
}

export function value_deserializeFromBytesArrayBasic<ElementType extends BasicType<unknown>>(
  elementType: ElementType,
  data: ByteViews,
  start: number,
  end: number,
  arrayProps: ArrayProps
): ValueOf<ElementType>[] {
  const elSize = elementType.byteLength;

  // Vector + List length validation
  const length = (end - start) / elSize;
  assertValidArrayLength(length, arrayProps, true);

  const values = new Array<ValueOf<ElementType>>(length);

  for (let i = 0; i < length; i++) {
    // TODO: If faster, consider skipping size check for uint types
    values[i] = elementType.value_deserializeFromBytes(
      data,
      start + i * elSize,
      start + (i + 1) * elSize
    ) as ValueOf<ElementType>;
  }

  return values;
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function tree_serializeToBytesArrayBasic<ElementType extends BasicType<unknown>>(
  elementType: ElementType,
  length: number,
  depth: number,
  output: ByteViews,
  offset: number,
  node: Node,
  cachedNodes: Node[] | null = null
): number {
  const size = elementType.byteLength * length;
  const chunkCount = Math.ceil(size / 32);

  const nodes = cachedNodes ?? getNodesAtDepth(node, depth, 0, chunkCount);
  packedNodeRootsToBytes(output.dataView, offset, size, nodes);

  return offset + size;
}

// List of basic elements will pack them in merkelized form
export function tree_deserializeFromBytesArrayBasic<ElementType extends BasicType<unknown>>(
  elementType: ElementType,
  chunkDepth: number,
  data: ByteViews,
  start: number,
  end: number,
  arrayProps: ArrayProps
): Node {
  // Vector + List length validation
  const length = (end - start) / elementType.byteLength;
  assertValidArrayLength(length, arrayProps, true);

  // Abstract converting data to LeafNode to allow for custom data representation, such as the hashObject
  const chunksNode = packedRootsBytesToNode(chunkDepth, data.dataView, start, end);

  if (arrayProps.isList) {
    return addLengthNode(chunksNode, length);
  } else {
    return chunksNode;
  }
}

/**
 * @param length In List length = undefined, Vector length = fixed value
 */
export function value_fromJsonArray<ElementType extends Type<unknown>>(
  elementType: ElementType,
  json: unknown,
  arrayProps: ArrayProps
): ValueOf<ElementType>[] {
  if (!Array.isArray(json)) {
    throw Error("JSON is not an array");
  }

  assertValidArrayLength(json.length, arrayProps);

  const value = new Array<ValueOf<ElementType>>(json.length);
  for (let i = 0; i < json.length; i++) {
    value[i] = elementType.fromJson(json[i]) as ValueOf<ElementType>;
  }
  return value;
}

/**
 * @param length In List length = undefined, Vector length = fixed value
 */
export function value_toJsonArray<ElementType extends Type<unknown>>(
  elementType: ElementType,
  value: ValueOf<ElementType>[],
  arrayProps: ArrayProps
): unknown[] {
  const length = arrayProps.isList ? value.length : arrayProps.length;

  const json = new Array<unknown>(length);
  for (let i = 0; i < length; i++) {
    json[i] = elementType.toJson(value[i]) as ValueOf<ElementType>;
  }
  return json;
}

/**
 * Clone recursively an array of basic or composite types
 */
export function value_cloneArray<ElementType extends Type<unknown>>(
  elementType: ElementType,
  value: ValueOf<ElementType>[]
): ValueOf<ElementType>[] {
  const newValue = new Array<ValueOf<ElementType>>(value.length);

  for (let i = 0; i < value.length; i++) {
    newValue[i] = elementType.clone(value[i]) as ValueOf<ElementType>;
  }

  return newValue;
}

/**
 * Check recursively if a type is structuraly equal. Returns early
 */
export function value_equals<ElementType extends Type<unknown>>(
  elementType: ElementType,
  a: ValueOf<ElementType>[],
  b: ValueOf<ElementType>[]
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!elementType.equals(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

export function value_defaultValueArray<ElementType extends Type<unknown>>(
  elementType: ElementType,
  length: number
): ValueOf<ElementType>[] {
  const values = new Array<ValueOf<ElementType>>(length);
  for (let i = 0; i < length; i++) {
    values[i] = elementType.defaultValue() as ValueOf<ElementType>;
  }
  return values;
}

/**
 * @param checkNonDecimalLength Check that length is a multiple of element size.
 * Optional since it's not necessary in getOffsetsArrayComposite() fn.
 */
export function assertValidArrayLength(length: number, arrayProps: ArrayProps, checkNonDecimalLength?: boolean): void {
  if (checkNonDecimalLength && length % 1 !== 0) {
    throw Error("size not multiple of element fixedSize");
  }

  // Vector + List length validation
  if (arrayProps.isList) {
    if (length > arrayProps.limit) {
      throw new Error(`Invalid list length ${length} over limit ${arrayProps.limit}`);
    }
  } else {
    if (length !== arrayProps.length) {
      throw new Error(`Incorrect vector length ${length} expected ${arrayProps.length}`);
    }
  }
}
