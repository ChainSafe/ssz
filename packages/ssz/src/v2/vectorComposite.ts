import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeType, ValueOf} from "./abstract";
import {
  getLengthFromRootNode,
  struct_deserializeFromBytesArrayComposite,
  struct_serializedSizeArrayComposite,
  struct_serializeToBytesArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
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

    if (!elementType.isBasic) {
      throw Error("VectorCompositeType can only have a basic type as elementType");
    }

    // TODO Check that itemsPerChunk is an integer
    this.maxChunkCount = Math.ceil((length * 1) / 32);
    this.depth = Math.ceil(Math.log2(this.maxChunkCount));
    this.fixedLen = elementType.fixedLen === null ? null : length * elementType.fixedLen;
    this.minLen = length * elementType.minLen;
    this.maxLen = length * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
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

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayComposite(this.elementType, this.depth, data, start, end, this);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const length = getLengthFromRootNode(node);
    return tree_serializeToBytesArrayComposite(this.elementType, length, this.depth, node, output, offset);
  }

  tree_getLength(): number {
    return this.length;
  }
}
