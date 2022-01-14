import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/tree";
import {BasicType, ValueOf} from "./abstract";
import {CompositeType} from "./composite";
import {
  defaultValueVector,
  value_deserializeFromBytesArrayBasic,
  value_fromJsonArray,
  value_toJsonArray,
  value_serializeToBytesArrayBasic,
  tree_deserializeFromBytesArrayBasic,
  tree_serializeToBytesArrayBasic,
} from "./arrayBasic";
import {ArrayBasicType, ArrayBasicTreeView} from "../view/arrayBasic";
import {ArrayBasicTreeViewDU} from "../viewDU/arrayBasic";

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class VectorBasicType<ElementType extends BasicType<unknown>>
  extends CompositeType<ValueOf<ElementType>[], ArrayBasicTreeView<ElementType>, ArrayBasicTreeViewDU<ElementType>>
  implements ArrayBasicType<ElementType>
{
  readonly typeName: string;
  // Immutable characteristics
  readonly itemsPerChunk: number;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedSize: number;
  readonly minSize: number;
  readonly maxSize: number;

  constructor(readonly elementType: ElementType, readonly length: number) {
    super();

    if (!elementType.isBasic) {
      throw Error("elementType must be basic");
    }
    if (length === 0) {
      throw Error("Vector types must not be empty");
    }

    this.typeName = `Vector[${elementType.typeName}, ${length}]`;
    // TODO Check that itemsPerChunk is an integer
    this.itemsPerChunk = 32 / elementType.byteLength;
    this.maxChunkCount = Math.ceil((this.length * elementType.byteLength) / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = this.chunkDepth;
    this.fixedSize = this.length * elementType.byteLength;
    this.minSize = this.fixedSize;
    this.maxSize = this.fixedSize;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return defaultValueVector(this.elementType, this.length);
  }

  getView(tree: Tree): ArrayBasicTreeView<ElementType> {
    return new ArrayBasicTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ArrayBasicTreeViewDU<ElementType> {
    // cache type should be validated (if applicate) in the view
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ArrayBasicTreeViewDU(this, node, cache as any);
  }

  commitView(view: ArrayBasicTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(view: ArrayBasicTreeViewDU<ElementType>): Node {
    return view.commit();
  }

  cacheOfViewDU(view: ArrayBasicTreeViewDU<ElementType>): unknown {
    return view.cache;
  }

  // Serialization + deserialization

  value_serializedSize(): number {
    return this.fixedSize;
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayBasic(this.elementType, value.length, output, offset, value);
  }

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayBasic(this.elementType, data, start, end, this);
  }

  tree_serializedSize(): number {
    return this.fixedSize;
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    return tree_serializeToBytesArrayBasic(this.elementType, this.length, this.depth, output, offset, node);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayBasic(this.elementType, this.depth, data, start, end, this);
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
    const roots = new Uint8Array(this.fixedSize);
    value_serializeToBytesArrayBasic(this.elementType, this.length, roots, 0, value);
    return roots;
  }

  // JSON

  fromJson(json: unknown): ValueOf<ElementType>[] {
    return value_fromJsonArray(this.elementType, json, this.length);
  }

  toJson(value: ValueOf<ElementType>[]): unknown {
    return value_toJsonArray(this.elementType, value, this.length);
  }
}
