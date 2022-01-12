import {
  BranchNode,
  LeafNode,
  Node,
  zeroNode,
  getNodesAtDepth,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
} from "@chainsafe/persistent-merkle-tree";
import {Type, BasicType, ValueOf} from "./abstract";

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

export function defaultValueVector<ElementType extends Type<unknown>>(
  elementType: ElementType,
  length: number
): ValueOf<ElementType>[] {
  const values: ValueOf<ElementType>[] = [];
  for (let i = 0; i < length; i++) {
    values.push(elementType.defaultValue as ValueOf<ElementType>);
  }
  return values;
}

export type ArrayProps = {
  /** Vector length */
  length?: number;
  /** List limit */
  limit?: number;
};

export function value_deserializeFromBytesArrayBasic<ElementType extends BasicType<unknown>>(
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
    values.push(
      elementType.value_deserializeFromBytes(data, start + i * elSize, start + (i + 1) * elSize) as ValueOf<ElementType>
    );
  }

  return values;
}

/**
 * @param length In List length = value.length, Vector length = fixed value
 */
export function value_serializeToBytesArrayBasic<ElementType extends BasicType<unknown>>(
  elementType: ElementType,
  length: number,
  output: Uint8Array,
  offset: number,
  value: ValueOf<ElementType>[]
): number {
  const elSize = elementType.byteLength;
  for (let i = 0; i < length; i++) {
    elementType.value_serializeToBytes(output, offset + i * elSize, value[i]);
  }
  return offset + length * elSize;
}

// List of basic elements will pack them in merkelized form
export function tree_deserializeFromBytesArrayBasic<ElementType extends BasicType<unknown>>(
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
export function tree_serializeToBytesArrayBasic<ElementType extends BasicType<unknown>>(
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

/**
 * @param length In List length = undefined, Vector length = fixed value
 */
export function value_fromJsonArray<ElementType extends Type<unknown>>(
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
    value.push(elementType.fromJson(json[i]) as ValueOf<ElementType>);
  }
  return value;
}

/**
 * @param length In List length = undefined, Vector length = fixed value
 */
export function value_toJsonArray<ElementType extends Type<unknown>>(
  elementType: ElementType,
  value: ValueOf<ElementType>[],
  length?: number
): unknown[] {
  if (length === undefined) {
    length = value.length;
  }

  const json: unknown[] = [];
  for (let i = 0; i < length; i++) {
    json.push(elementType.toJson(value[i]) as ValueOf<ElementType>);
  }
  return json;
}

/**
 * @param checkNonDecimalLength Check that length is a multiple of element size.
 * Optional since it's not necessary in getOffsetsArrayComposite() fn.
 */
export function assertValidArrayLength(length: number, arrayProps: ArrayProps, checkNonDecimalLength?: boolean): void {
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
