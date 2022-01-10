import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/tree";
import {CompositeType, CompositeView, CompositeViewDU, ValueOf} from "./abstract";
import {
  value_deserializeFromBytesArrayComposite,
  value_serializedSizeArrayComposite,
  value_serializeToBytesArrayComposite,
  tree_serializedSizeArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
  defaultValueVector,
  value_getRootsArrayComposite,
  value_fromJsonArray,
} from "./array";
import {ArrayCompositeTreeView, ArrayCompositeTreeViewDU, ArrayCompositeType} from "./arrayTreeView";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class VectorCompositeType<
    ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>
  >
  extends CompositeType<
    ValueOf<ElementType>[],
    ArrayCompositeTreeView<ElementType>,
    ArrayCompositeTreeViewDU<ElementType>
  >
  implements ArrayCompositeType<ElementType>
{
  // Immutable characteristics
  readonly itemsPerChunk = 1;
  readonly isBasic = false;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedLen: number | null;
  readonly minLen: number;
  readonly maxLen: number;

  constructor(readonly elementType: ElementType, readonly length: number) {
    super();

    if (elementType.isBasic) {
      throw Error("elementType must not be basic");
    }
    if (length === 0) {
      throw Error("Vector types must not be empty");
    }

    // TODO Check that itemsPerChunk is an integer
    this.maxChunkCount = Math.ceil((length * 1) / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = this.chunkDepth;
    this.fixedLen = elementType.fixedLen === null ? null : length * elementType.fixedLen;
    this.minLen = length * elementType.minLen;
    this.maxLen = length * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return defaultValueVector(this.elementType, this.length);
  }

  getView(tree: Tree): ArrayCompositeTreeView<ElementType> {
    return new ArrayCompositeTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ArrayCompositeTreeViewDU<ElementType> {
    return new ArrayCompositeTreeViewDU(this, node, cache as any);
  }

  commitView(view: ArrayCompositeTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(view: ArrayCompositeTreeViewDU<ElementType>): Node {
    return view.commit();
  }

  cacheOfViewDU(view: ArrayCompositeTreeViewDU<ElementType>): unknown {
    return view.cache;
  }

  // Serialization + deserialization

  value_serializedSize(value: ValueOf<ElementType>[]): number {
    return value_serializedSizeArrayComposite(this.elementType, value, this);
  }

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayComposite(this.elementType, data, start, end, this);
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayComposite(this.elementType, value.length, output, offset, value);
  }

  tree_serializedSize(node: Node): number {
    return tree_serializedSizeArrayComposite(this.elementType, this.length, this.depth, node);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayComposite(this.elementType, this.depth, data, start, end, this);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    return tree_serializeToBytesArrayComposite(this.elementType, this.length, this.depth, node, output, offset);
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
    return value_getRootsArrayComposite(this.elementType, this.length, value);
  }

  // JSON

  fromJson(data: unknown): ValueOf<ElementType>[] {
    return value_fromJsonArray(this.elementType, data, this.length);
  }
}
