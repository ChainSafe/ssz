import {GindexBitstring, LeafNode, Node, toGindexBitstring, Tree} from "@chainsafe/persistent-merkle-tree";
import {merkleizeSingleBuff} from "../util/merkleize";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

export type ValueOf<T extends Type<any>> = T["defaultValue"];
// type ElV<Type extends ListBasicType<any>> = Type extends ListBasicType<infer ElType> ? V<ElType> :never

export type CompositeView<T extends CompositeType<any, unknown, unknown>> = ReturnType<T["getView"]>;
export type CompositeViewDU<T extends CompositeType<any, unknown, unknown>> = ReturnType<T["getViewDU"]>;

const symbolCachedPermanentRoot = Symbol("ssz_cached_permanent_root");

type ValueWithCachedPermanentRoot = {
  [symbolCachedPermanentRoot]?: Uint8Array;
};

/**
 * # Serialization
 * - serialize
 * - deserialize
 * - deserializeToView
 * - deserializeToViewDU
 * Internal
 * - value_serializedSize
 * - value_deserializeFromBytes
 * - value_serializeToBytes
 * - tree_serializedSize
 * - tree_serializeToBytes
 * - tree_deserializeFromBytes
 * Internal - Basic types
 * - getValueFromNode
 * - setValueToNode
 * - getValueFromPackedNode
 * - setValueToPackedNode
 *
 * # Merkelization
 * - hashTreeRoot
 * Internal
 * - getRoots
 * - maxChunkCount
 *
 * # Views
 * - getView
 * - getViewDU
 * - toValueFromView
 * - toValueFromViewDU
 * - toViewFromValue
 * - toViewDUFromValue
 * Internal
 * - commitView
 * - commitViewDU
 * - getViewDUCache
 *
 * # Tree helpers
 * Internal - Arrays
 * - tree_getLength
 * - tree_setLength
 * - tree_getChunksNode
 * - tree_setChunksNode
 *
 * # Proofs
 * - tree_createFromProof
 * - tree_createProof
 * - getPathInfo
 * - tree_getLeafGindices
 * - getPropertyGindex
 * - getPropertyType
 *
 */
export abstract class Type<V> {
  abstract readonly defaultValue: V;
  abstract readonly isBasic: boolean;
  abstract readonly depth: number;
  /** if fixedLen === null has variable length. Otherwise is fixed len of value `fixedLen` */
  abstract readonly fixedLen: number | null;
  abstract readonly minLen: number;
  abstract readonly maxLen: number;

  getGindexBitStringAtChunkIndex(index: number): GindexBitstring {
    return toGindexBitstring(this.depth, index);
  }

  // Serialization + deserialization

  // TODO: From Cayman's chat
  // - Rename struct to value
  // - Type TreeView's Type and at methods to `toValue()` and things like this
  // - Add proofs
  // - Move to schema?
  abstract value_serializedSize(value: V): number;
  abstract value_serializeToBytes(output: Uint8Array, offset: number, value: V): number;
  abstract value_deserializeFromBytes(data: Uint8Array, start: number, end: number): V;
  abstract tree_serializedSize(node: Node): number;
  abstract tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number;
  abstract tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node;

  // Un-performant path but useful for testing and prototyping
  value_toTree(value: V): Node {
    const bytes = new Uint8Array(this.value_serializedSize(value));
    this.value_serializeToBytes(bytes, 0, value);
    return this.tree_deserializeFromBytes(bytes, 0, bytes.length);
  }

  // Un-performant path but useful for testing and prototyping
  tree_toValue(node: Node): V {
    const bytes = new Uint8Array(this.tree_serializedSize(node));
    this.tree_serializeToBytes(bytes, 0, node);
    return this.value_deserializeFromBytes(bytes, 0, bytes.length);
  }

  // User-friendly API

  serialize(value: V): Uint8Array {
    const output = new Uint8Array(this.value_serializedSize(value));
    this.value_serializeToBytes(output, 0, value);
    return output;
  }

  deserialize(data: Uint8Array): V {
    return this.value_deserializeFromBytes(data, 0, data.length);
  }

  // Merkleization

  abstract hashTreeRoot(value: V): Uint8Array;

  equals(value1: V, value2: V): boolean {
    value1;
    value2;
    throw Error("Not implemented");
  }

  // JSON support

  abstract fromJson(data: unknown): V;
}

export abstract class BasicType<V> extends Type<V> {
  readonly isBasic = true;
  readonly depth = 0;
  readonly chunkCount = 1;
  abstract readonly byteLength: number;

  // TODO: Consider just returning `Type<V>`, to make the API consistent in Container ViewOfFields
  getView(): unknown {
    throw Error("Basic types do not return views");
  }

  value_serializedSize(): number {
    return this.byteLength;
  }

  tree_serializedSize(): number {
    return this.byteLength;
  }

  hashTreeRoot(value: V): Uint8Array {
    const output = new Uint8Array(32);
    this.value_serializeToBytes(output, 0, value);
    return output;
  }

  abstract getValueFromNode(leafNode: LeafNode): V;
  abstract setValueToNode(leafNode: LeafNode, value: V): void;
  abstract getValueFromPackedNode(leafNode: LeafNode, index: number): V;
  abstract setValueToPackedNode(leafNode: LeafNode, index: number, value: V): void;
}

export abstract class CompositeType<V, TV, TVDU> extends Type<V> {
  readonly isBasic = false;

  constructor(
    /**
     * Caches hashTreeRoot() result for struct values.
     * WARNING: Must only be used with value that never mutate. The cached root is never discarded
     */
    private readonly cachePermanentRootStruct?: boolean
  ) {
    super();
  }

  abstract getView(tree: Tree): TV;
  /**
   * ViewDU = View Deferred Update
   */
  abstract getViewDU(node: Node, cache?: unknown): TVDU;
  /**
   * Sample implementation
   * ```ts
   * // Commit must drop the invalidateParent() reference
   * view.commit();
   * return view.node;
   * ```
   * @param view
   * @returns
   */
  abstract commitView(view: TV): Node;
  abstract commitViewDU(view: TVDU): Node;
  abstract getViewDUCache(view: TVDU): unknown;

  deserializeToView(data: Uint8Array): TV {
    const node = this.tree_deserializeFromBytes(data, 0, data.length);
    return this.getView(new Tree(node));
  }

  deserializeToViewDU(data: Uint8Array): TVDU {
    const node = this.tree_deserializeFromBytes(data, 0, data.length);
    return this.getViewDU(node);
  }

  toView(value: V): TV {
    const node = this.value_toTree(value);
    return this.getView(new Tree(node));
  }

  toViewDU(value: V): TVDU {
    const node = this.value_toTree(value);
    return this.getViewDU(node);
  }

  toValueFromView(view: TV): V {
    return this.tree_toValue(this.commitView(view));
  }

  toValueFromViewDU(view: TVDU): V {
    return this.tree_toValue(this.commitViewDU(view));
  }

  toStructFromView(view: TV): V {
    // Un-performant path but useful for testing and prototyping
    const node = this.commitView(view);
    const output = new Uint8Array(this.tree_serializedSize(node));
    return this.deserialize(output);
  }

  hashTreeRoot(value: V): Uint8Array {
    // Return cached mutable root if any
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        return cachedRoot;
      }
    }

    const root = merkleizeSingleBuff(this.getRoots(value), this.maxChunkCount);

    if (this.cachePermanentRootStruct) {
      (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot] = root;
    }

    return root;
  }

  protected abstract readonly maxChunkCount: number;
  protected abstract getRoots(value: V): Uint8Array;
}

export abstract class TreeView {
  abstract readonly node: Node;
  abstract readonly type: Type<any>;

  serialize(): Uint8Array {
    const output = new Uint8Array(this.type.tree_serializedSize(this.node));
    this.type.tree_serializeToBytes(output, 0, this.node);
    return output;
  }

  hashTreeRoot(): Uint8Array {
    return this.node.root;
  }
}

export abstract class TreeViewDU {
  abstract commit(): Node;
  abstract readonly node: Node;
  abstract readonly cache: unknown;
  abstract readonly type: Type<any>;

  serialize(): Uint8Array {
    // Ensure all transient changes are commited to the root node
    const node = this.commit();

    const output = new Uint8Array(this.type.tree_serializedSize(node));
    this.type.tree_serializeToBytes(output, 0, node);
    return output;
  }

  hashTreeRoot(): Uint8Array {
    return this.node.root;
  }
}
