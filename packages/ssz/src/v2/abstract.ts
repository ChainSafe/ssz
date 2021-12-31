import {GindexBitstring, LeafNode, Node, toGindexBitstring, Tree} from "@chainsafe/persistent-merkle-tree";
import {merkleizeSingleBuff} from "../util/merkleize";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

export type ValueOf<T extends Type<any>> = T["defaultValue"];
// type ElV<Type extends ListBasicType<any>> = Type extends ListBasicType<infer ElType> ? V<ElType> :never

export type ViewOfComposite<T extends CompositeType<any>> = ReturnType<T["getView"]>;

const symbolCachedPermanentRoot = Symbol("ssz_cached_permanent_root");

type ValueWithCachedPermanentRoot = {
  [symbolCachedPermanentRoot]?: Uint8Array;
};

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

  abstract struct_serializedSize(struct: V): number;
  abstract struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): V;
  abstract struct_serializeToBytes(output: Uint8Array, offset: number, struct: V): number;
  abstract tree_serializedSize(node: Node): number;
  abstract tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node;
  abstract tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number;

  // User-friendly API

  serialize(value: V): Uint8Array {
    const output = new Uint8Array(this.struct_serializedSize(value));
    this.struct_serializeToBytes(output, 0, value);
    return output;
  }

  deserialize(data: Uint8Array): V {
    return this.struct_deserializeFromBytes(data, 0, data.length);
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

  struct_serializedSize(): number {
    return this.byteLength;
  }

  tree_serializedSize(): number {
    return this.byteLength;
  }

  hashTreeRoot(value: V): Uint8Array {
    const output = new Uint8Array(32);
    this.struct_serializeToBytes(output, 0, value);
    return output;
  }

  abstract getValueFromNode(leafNode: LeafNode): V;
  abstract setValueToNode(leafNode: LeafNode, value: V): void;
  abstract getValueFromPackedNode(leafNode: LeafNode, index: number): V;
  abstract setValueToPackedNode(leafNode: LeafNode, index: number, value: V): void;
}

export abstract class CompositeType<V> extends Type<V> {
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

  abstract getView(tree: Tree, inMutableMode?: boolean): unknown;

  deserializeToTreeView(data: Uint8Array): ReturnType<this["getView"]> {
    const node = this.tree_deserializeFromBytes(data, 0, data.length);
    return this.getView(new Tree(node)) as ReturnType<this["getView"]>;
  }

  toTreeViewFromStruct(value: V): ReturnType<this["getView"]> {
    // Un-performant path but useful for testing and prototyping
    return this.deserializeToTreeView(this.serialize(value));
  }

  toStructFromTreeView(view: ReturnType<this["getView"]>): V {
    // Un-performant path but useful for testing and prototyping
    return this.deserialize((view as TreeView).serialize());
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
  abstract toMutable(): void;
  abstract commit(): void;
  abstract readonly node: Node;
  abstract readonly type: Type<any>;

  protected abstract serializedSize(): number;

  serialize(): Uint8Array {
    // Ensure all transient changes are commited to the root node
    this.commit();

    const output = new Uint8Array(this.serializedSize());
    this.type.tree_serializeToBytes(output, 0, this.node);
    return output;
  }

  hashTreeRoot(): Uint8Array {
    return this.node.root;
  }
}
