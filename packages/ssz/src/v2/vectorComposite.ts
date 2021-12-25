import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeType, ValueOf} from "./abstract";
import {
  struct_deserializeFromBytesArrayComposite,
  struct_serializedSizeArrayComposite,
  struct_serializeToBytesArrayComposite,
  tree_serializedSizeArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
  defaultValueVector,
  struct_getRootsArrayComposite,
  struct_fromJsonArray,
} from "./array";
import {ArrayCompositeTreeView, ArrayCompositeType} from "./arrayTreeView";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class VectorCompositeType<ElementType extends CompositeType<any>>
  extends CompositeType<ValueOf<ElementType>[]>
  implements ArrayCompositeType<ElementType>
{
  // Immutable characteristics
  readonly itemsPerChunk = 1;
  readonly isBasic = false;
  readonly depth: number;
  readonly maxChunkCount: number;
  readonly fixedLen: number | null;
  readonly minLen: number;
  readonly maxLen: number;

  constructor(readonly elementType: ElementType, readonly length: number) {
    super();

    if (elementType.isBasic) {
      throw Error("elementType must not be basic");
    }

    // TODO Check that itemsPerChunk is an integer
    this.maxChunkCount = Math.ceil((length * 1) / 32);
    this.depth = Math.ceil(Math.log2(this.maxChunkCount));
    this.fixedLen = elementType.fixedLen === null ? null : length * elementType.fixedLen;
    this.minLen = length * elementType.minLen;
    this.maxLen = length * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return defaultValueVector(this.elementType, this.length);
  }

  getView(tree: Tree, inMutableMode?: boolean): ArrayCompositeTreeView<ElementType> {
    return new ArrayCompositeTreeView(this, tree, inMutableMode);
  }

  // Serialization + deserialization

  struct_serializedSize(value: ValueOf<ElementType>[]): number {
    return struct_serializedSizeArrayComposite(this.elementType, value, this);
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOf<ElementType>[] {
    return struct_deserializeFromBytesArrayComposite(this.elementType, data, start, end, this);
  }

  struct_serializeToBytes(output: Uint8Array, offset: number, value: ValueOf<ElementType>[]): number {
    return struct_serializeToBytesArrayComposite(this.elementType, value.length, output, offset, value);
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

  // Merkleization

  protected getRoots(value: ValueOf<ElementType>[]): Uint8Array {
    return struct_getRootsArrayComposite(this.elementType, this.length, value);
  }

  // JSON

  fromJson(data: unknown): ValueOf<ElementType>[] {
    return struct_fromJsonArray(this.elementType, data, this.length);
  }
}