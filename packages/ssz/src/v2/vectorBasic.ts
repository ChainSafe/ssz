import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/tree";
import {BasicType, CompositeType, ValueOf} from "./abstract";
import {
  defaultValueVector,
  value_deserializeFromBytesArrayBasic,
  value_fromJsonArray,
  value_serializeToBytesArrayBasic,
  tree_deserializeFromBytesArrayBasic,
  tree_serializeToBytesArrayBasic,
} from "./array";
import {ArrayBasicTreeView, ArrayBasicTreeViewDU, ArrayBasicType} from "./arrayTreeView";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class VectorBasicType<ElementType extends BasicType<any>>
  extends CompositeType<ValueOf<ElementType>[], ArrayBasicTreeView<ElementType>, ArrayBasicTreeViewDU<ElementType>>
  implements ArrayBasicType<ElementType>
{
  // Immutable characteristics
  readonly itemsPerChunk: number;
  readonly isBasic = false;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedLen: number;
  readonly minLen: number;
  readonly maxLen: number;

  constructor(readonly elementType: ElementType, readonly length: number) {
    super();

    if (!elementType.isBasic) {
      throw Error("elementType must be basic");
    }
    if (length === 0) {
      throw Error("Vector types must not be empty");
    }

    // TODO Check that itemsPerChunk is an integer
    this.itemsPerChunk = 32 / elementType.byteLength;
    this.maxChunkCount = Math.ceil((this.length * elementType.byteLength) / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = this.chunkDepth;
    this.fixedLen = this.length * elementType.byteLength;
    this.minLen = this.fixedLen;
    this.maxLen = this.fixedLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return defaultValueVector(this.elementType, this.length);
  }

  getView(tree: Tree): ArrayBasicTreeView<ElementType> {
    return new ArrayBasicTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ArrayBasicTreeViewDU<ElementType> {
    return new ArrayBasicTreeViewDU(this, node, cache as any);
  }

  commitView(view: ArrayBasicTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(view: ArrayBasicTreeViewDU<ElementType>): Node {
    return view.commit();
  }

  getViewDUCache(view: ArrayBasicTreeViewDU<ElementType>): unknown {
    return view.cache;
  }

  // Serialization + deserialization

  value_serializedSize(): number {
    return this.fixedLen;
  }

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayBasic(this.elementType, data, start, end, this);
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayBasic(this.elementType, value.length, output, offset, value);
  }

  tree_serializedSize(): number {
    return this.fixedLen;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayBasic(this.elementType, this.depth, data, start, end, this);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    return tree_serializeToBytesArrayBasic(this.elementType, this.length, this.depth, output, offset, node);
  }

  // Helpers for TreeView

  tree_getLength(): number {
    return this.length;
  }

  tree_setLength(): void {
    //
  }

  tree_getChunksNode(node: Node): Node {
    return node;
  }

  tree_setChunksNode(rootNode: Node, chunksNode: Node): Node {
    return chunksNode;
  }

  // Merkleization

  protected getRoots(value: ValueOf<ElementType>[]): Uint8Array {
    const roots = new Uint8Array(this.fixedLen);
    value_serializeToBytesArrayBasic(this.elementType, this.length, roots, 0, value);
    return roots;
  }

  // JSON

  fromJson(data: unknown): ValueOf<ElementType>[] {
    return value_fromJsonArray(this.elementType, data, this.length);
  }
}
