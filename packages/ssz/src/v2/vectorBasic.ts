import {LeafNode, Tree} from "@chainsafe/persistent-merkle-tree";
import {LENGTH_GINDEX} from "../types/composite";
import {BasicType, CompositeType, ValueOf} from "./abstract";
import {
  struct_deserializeFromBytesArrayBasic,
  struct_serializeToBytesArrayBasic,
  tree_deserializeFromBytesArrayBasic,
  tree_serializeToBytesArrayBasic,
} from "./array";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class VectorBasicType<ElementType extends BasicType<any>> extends CompositeType<ValueOf<ElementType>[]> {
  // Immutable characteristics
  readonly itemsPerChunk: number;
  readonly isBasic = false;
  readonly depth: number;
  readonly maxChunkCount: number;
  readonly fixedLen: number;

  constructor(readonly elementType: ElementType, readonly length: number) {
    super();

    if (!elementType.isBasic) {
      throw Error("VectorBasicType can only have a basic type as elementType");
    }

    // TODO Check that itemsPerChunk is an integer
    this.itemsPerChunk = 32 / elementType.byteLength;
    this.maxChunkCount = Math.ceil((this.length * elementType.byteLength) / 32);
    // TODO: Review math
    this.depth = 1 + Math.ceil(Math.log2(this.maxChunkCount));
    this.fixedLen = this.length * elementType.byteLength;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
  }

  // Serialization + deserialization

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOf<ElementType>[] {
    return struct_deserializeFromBytesArrayBasic(this.elementType, data, start, end, {vectorLength: this.length});
  }

  struct_serializeToBytes(output: Uint8Array, offset: number, value: ValueOf<ElementType>[]): number {
    return struct_serializeToBytesArrayBasic(this.elementType, value.length, output, offset, value);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    return tree_deserializeFromBytesArrayBasic(this.elementType, data, start, end, {vectorLength: this.length});
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, tree: Tree): number {
    const length = this.tree_getLength(tree);
    return tree_serializeToBytesArrayBasic(this.elementType, length, this.depth, output, offset, tree);
  }

  tree_getLength(tree: Tree): number {
    return (tree.getNode(LENGTH_GINDEX) as LeafNode).getUint(4, 0);
  }

  getView(tree: Tree): VectorBasicTreeView<ElementType> {
    return new VectorBasicTreeView(this, tree);
  }
}
