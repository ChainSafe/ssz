import {
  Gindex,
  HashComputationLevel,
  Node,
  Proof,
  Tree,
  merkleizeBlockArray,
  merkleizeBlocksBytes,
} from "@chainsafe/persistent-merkle-tree";
import {byteArrayEquals, slice} from "../util/byteArray.ts";
import {ValueWithCachedPermanentRoot, cacheRoot, symbolCachedPermanentRoot} from "../util/merkleize.ts";
import {SerializedList} from "../value/serializedList.ts";
import {ListCompositeTreeView} from "../view/listComposite.ts";
import {ListCompositeTreeViewDU} from "../viewDU/listComposite.ts";
import {ByteViews, JsonPathProp, Type} from "./abstract.ts";
import {assertValidArrayLength, getLengthFromRootNode, value_fromJsonArray} from "./arrayBasic.ts";
import {readVariableOffsetsArrayComposite} from "./arrayComposite.ts";
import {ByteListType} from "./byteList.ts";
import {CompositeType} from "./composite.ts";
import {ListCompositeType} from "./listComposite.ts";
import {merkleizeProgressiveBytes} from "./progressive.ts";
import {ProgressiveByteListType} from "./progressiveByteList.ts";
import {
  ProgressiveListCompositeTreeView,
  ProgressiveListCompositeTreeViewDU,
  ProgressiveListCompositeType,
} from "./progressiveList.ts";

export interface SerializedListOpts {
  typeName?: string;
  cachePermanentRootStruct?: boolean;
}

export interface ProgressiveSerializedListOpts extends SerializedListOpts {
  /** Optional runtime limit on element count, 0 requires an empty list. Does not affect the progressive Merkle tree shape. */
  limit?: number;
}

/** Element types supported by SerializedList types, both have a `Uint8Array` value */
export type SerializedListElementType = ByteListType | ProgressiveByteListType;

/** The list type with `Uint8Array[]` values that a SerializedList type is equivalent to */
type InnerListType<TV, TVDU> = CompositeType<Uint8Array[], TV, TVDU> & {
  readonly limit: number;
  readonly elementType: SerializedListElementType;
};

/**
 * Same SSZ type as `inner` (a list of ByteList or ProgressiveByteList) but its value is a `SerializedList`: the canonical serialization in a
 * single Uint8Array plus element offsets, instead of one Uint8Array per element. Deserializing a list of many tiny
 * elements then allocates 2 objects instead of one per element.
 *
 * Serialization, merkleization, JSON and proofs are identical to `inner`. Tree-backed views are the views of `inner`,
 * only the value representation changes.
 */
abstract class SerializedListBaseType<TV, TVDU> extends CompositeType<SerializedList, TV, TVDU> {
  readonly typeName: string;
  readonly depth: number;
  readonly maxChunkCount: number;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = true;
  readonly isViewMutable = true;
  readonly limit: number;
  readonly mixInLengthBlockBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthBlockBytes.buffer,
    this.mixInLengthBlockBytes.byteOffset,
    this.mixInLengthBlockBytes.byteLength
  );

  constructor(
    readonly elementType: SerializedListElementType,
    /** Equivalent list type with `Uint8Array[]` values, used for tree operations and views */
    readonly inner: InnerListType<TV, TVDU>,
    cachePermanentRootStruct?: boolean
  ) {
    super(cachePermanentRootStruct);

    if (!(elementType instanceof ByteListType || elementType instanceof ProgressiveByteListType)) {
      throw Error("elementType must be ByteListType or ProgressiveByteListType");
    }

    this.typeName = inner.typeName;
    this.depth = inner.depth;
    this.maxChunkCount = inner.maxChunkCount;
    this.minSize = inner.minSize;
    this.maxSize = inner.maxSize;
    this.limit = inner.limit;
  }

  /** Merkleize the roots of all elements of `value` (without length mix in) into `output[0, 32)` */
  protected abstract merkleizeElements(value: SerializedList, output: Uint8Array): void;

  defaultValue(): SerializedList {
    return SerializedList.empty();
  }

  // Views: same as the inner type

  getView(tree: Tree): TV {
    return this.inner.getView(tree);
  }

  getViewDU(node: Node, cache?: unknown): TVDU {
    return this.inner.getViewDU(node, cache);
  }

  commitView(view: TV): Node {
    return this.inner.commitView(view);
  }

  commitViewDU(view: TVDU, hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): Node {
    return this.inner.commitViewDU(view, hcOffset, hcByLevel);
  }

  cacheOfViewDU(view: TVDU): unknown {
    return this.inner.cacheOfViewDU(view);
  }

  createFromProof(proof: Proof, root?: Uint8Array): TV {
    return this.inner.createFromProof(proof, root);
  }

  // Serialization + deserialization

  value_serializedSize(value: SerializedList): number {
    return value.bytes.length;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: SerializedList): number {
    output.uint8Array.set(value.bytes, offset);
    return offset + value.bytes.length;
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number, reuseBytes?: boolean): SerializedList {
    // Same offsets validation as value_deserializeFromBytesArrayComposite(), used by both inner types for values
    const offsets = readVariableOffsetsArrayComposite(data.dataView, start, end - start);
    const length = offsets.length - 1;
    assertValidArrayLength(length, this);

    // Same validation as elementType.value_deserializeFromBytes() for each element
    for (let i = 0; i < length; i++) {
      this.elementType.assertValidByteLength(offsets[i + 1] - offsets[i]);
    }

    return new SerializedList(slice(data.uint8Array, start, end, reuseBytes), offsets);
  }

  tree_serializedSize(node: Node): number {
    return this.inner.tree_serializedSize(node);
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    return this.inner.tree_serializeToBytes(output, offset, node);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    return this.inner.tree_deserializeFromBytes(data, start, end);
  }

  value_toTree(value: SerializedList): Node {
    const {bytes} = value;
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return this.inner.tree_deserializeFromBytes({uint8Array: bytes, dataView}, 0, bytes.length);
  }

  tree_toValue(node: Node): SerializedList {
    const uint8Array = new Uint8Array(this.inner.tree_serializedSize(node));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.inner.tree_serializeToBytes({uint8Array, dataView}, 0, node);
    return this.value_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length, true);
  }

  tree_getLength(node: Node): number {
    return getLengthFromRootNode(node);
  }

  // Merkleization

  hashTreeRootInto(value: SerializedList, output: Uint8Array, offset: number, safeCache = false): void {
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        output.set(cachedRoot, offset);
        return;
      }
    }

    this.merkleizeElements(value, this.mixInLengthBlockBytes);
    // mixInLength
    this.mixInLengthBuffer.writeUIntLE(value.length, 32, 6);
    // one for hashTreeRoot(value), one for length
    merkleizeBlocksBytes(this.mixInLengthBlockBytes, 2, output, offset);

    if (this.cachePermanentRootStruct) {
      cacheRoot(value as ValueWithCachedPermanentRoot, output, offset, safeCache);
    }
  }

  /** Write hashTreeRoot of element `index` of `value` into `output[offset, offset + 32)` without allocating it */
  protected hashElementInto(value: SerializedList, index: number, output: Uint8Array, offset: number): void {
    this.elementType.hashTreeRootFromBytesInto(
      value.bytes,
      value.offsets[index],
      value.offsets[index + 1],
      output,
      offset
    );
  }

  protected getBlocksBytes(): Uint8Array {
    // we merkleize elements with merkleizeElements() instead
    throw Error("getBlockBytes should not be called for SerializedListType");
  }

  // Proofs: same as the inner type

  getPropertyGindex(prop: JsonPathProp): Gindex | null {
    return this.inner.getPropertyGindex(prop);
  }

  getPropertyType(prop: JsonPathProp): Type<unknown> {
    return this.inner.getPropertyType(prop);
  }

  getIndexProperty(index: number): JsonPathProp | null {
    return this.inner.getIndexProperty(index);
  }

  tree_getLeafGindices(rootGindex: Gindex, rootNode?: Node): Gindex[] {
    return this.inner.tree_getLeafGindices(rootGindex, rootNode);
  }

  tree_fromProofNode(node: Node): {node: Node; done: boolean} {
    return this.inner.tree_fromProofNode(node);
  }

  // JSON: same format as the inner type, an array of hex strings

  fromJson(json: unknown): SerializedList {
    return SerializedList.fromArray(value_fromJsonArray(this.elementType, json, this));
  }

  toJson(value: SerializedList): unknown {
    const length = value.length;
    const json = new Array<unknown>(length);
    for (let i = 0; i < length; i++) {
      json[i] = this.elementType.toJson(value.get(i));
    }
    return json;
  }

  clone(value: SerializedList): SerializedList {
    return value.clone();
  }

  equals(a: SerializedList, b: SerializedList): boolean {
    // bytes are always canonical, offsets are derived from them
    return byteArrayEquals(a.bytes, b.bytes);
  }
}

/**
 * `List[ByteList[N], LIMIT]` (or of ProgressiveByteList) with a `SerializedList` value, equivalent to
 * `ListCompositeType(elementType, LIMIT)`.
 * @see SerializedListBaseType
 */
export class SerializedListType extends SerializedListBaseType<
  ListCompositeTreeView<SerializedListElementType>,
  ListCompositeTreeViewDU<SerializedListElementType>
> {
  private readonly blockArray: Uint8Array[] = [];

  constructor(elementType: SerializedListElementType, limit: number, opts?: SerializedListOpts) {
    super(
      elementType,
      new ListCompositeType(elementType, limit, {typeName: opts?.typeName}),
      opts?.cachePermanentRootStruct
    );
  }

  protected merkleizeElements(value: SerializedList, output: Uint8Array): void {
    const length = value.length;
    // 2 element roots per block
    const blockLimit = Math.ceil(length / 2);

    // use merkleizeBlockArray() instead of merkleizeBlocksBytes() to avoid big memory allocation
    // reallocate this.blockArray if needed
    if (blockLimit > this.blockArray.length) {
      const blockDiff = blockLimit - this.blockArray.length;
      const newBlocksBytes = new Uint8Array(blockDiff * 64);
      for (let i = 0; i < blockDiff; i++) {
        this.blockArray.push(newBlocksBytes.subarray(i * 64, (i + 1) * 64));
      }
    }

    for (let i = 0; i < length; i++) {
      this.hashElementInto(value, i, this.blockArray[Math.floor(i / 2)], i % 2 === 0 ? 0 : 32);
    }

    // zero out the last block if needed
    if (length % 2 === 1) {
      this.blockArray[blockLimit - 1].fill(0, 32);
    }

    merkleizeBlockArray(this.blockArray, blockLimit, this.maxChunkCount, output, 0);
  }
}

/**
 * `ProgressiveList[ProgressiveByteList]` with a `SerializedList` value, equivalent to
 * `ProgressiveListCompositeType(elementType, opts)`.
 * @see SerializedListBaseType
 */
export class ProgressiveSerializedListType extends SerializedListBaseType<
  ProgressiveListCompositeTreeView<SerializedListElementType>,
  ProgressiveListCompositeTreeViewDU<SerializedListElementType>
> {
  constructor(elementType: SerializedListElementType, opts?: ProgressiveSerializedListOpts) {
    super(
      elementType,
      new ProgressiveListCompositeType(elementType, {typeName: opts?.typeName, limit: opts?.limit}),
      opts?.cachePermanentRootStruct
    );
  }

  protected merkleizeElements(value: SerializedList, output: Uint8Array): void {
    const length = value.length;
    const blockBytesLen = Math.ceil(length / 2) * 64;
    if (blockBytesLen > this.blocksBuffer.length) {
      this.blocksBuffer = new Uint8Array(blockBytesLen);
    }
    const blockBytes = this.blocksBuffer.subarray(0, blockBytesLen);

    for (let i = 0; i < length; i++) {
      this.hashElementInto(value, i, blockBytes, i * 32);
    }
    if (length % 2 === 1) {
      blockBytes.fill(0, length * 32, length * 32 + 32);
    }

    merkleizeProgressiveBytes(blockBytes, length, output, 0);
  }
}
