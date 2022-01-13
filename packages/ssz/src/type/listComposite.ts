import {BranchNode, LeafNode, Node, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {LENGTH_GINDEX, maxChunksToDepth} from "../util/tree";
import {mixInLength} from "../util/merkleize";
import {ValueOf, JsonOptions} from "./abstract";
import {CompositeType, CompositeView, CompositeViewDU} from "./composite";
import {getLengthFromRootNode, value_fromJsonArray, value_toJsonArray} from "./arrayBasic";
import {
  value_deserializeFromBytesArrayComposite,
  value_serializedSizeArrayComposite,
  value_serializeToBytesArrayComposite,
  tree_serializedSizeArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
  value_getRootsArrayComposite,
} from "./arrayComposite";
import {ArrayCompositeType} from "../view/arrayComposite";
import {ListCompositeTreeView} from "../view/listComposite";
import {ListCompositeTreeViewDU} from "../viewDU/listComposite";

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class ListCompositeType<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>
  >
  extends CompositeType<
    ValueOf<ElementType>[],
    ListCompositeTreeView<ElementType>,
    ListCompositeTreeViewDU<ElementType>
  >
  implements ArrayCompositeType<ElementType>
{
  readonly typeName: string;
  // Immutable characteristics
  readonly itemsPerChunk = 1;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedLen = null;
  readonly minLen = 0;
  readonly maxLen: number;

  constructor(readonly elementType: ElementType, readonly limit: number) {
    super();

    if (elementType.isBasic) {
      throw Error("elementType must not be basic");
    }

    this.typeName = `List[${elementType.typeName}, ${limit}]`;
    this.maxChunkCount = this.limit;
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    // Depth includes the extra level for the length node
    this.depth = this.chunkDepth + 1;
    this.maxLen = this.limit * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
  }

  getView(tree: Tree): ListCompositeTreeView<ElementType> {
    return new ListCompositeTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ListCompositeTreeViewDU<ElementType> {
    // cache type should be validated (if applicate) in the view
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ListCompositeTreeViewDU(this, node, cache as any);
  }

  commitView(view: ListCompositeTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(view: ListCompositeTreeViewDU<ElementType>): Node {
    return view.commit();
  }

  cacheOfViewDU(view: ListCompositeTreeViewDU<ElementType>): unknown {
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
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    return tree_serializedSizeArrayComposite(this.elementType, length, this.chunkDepth, chunksNode);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayComposite(this.elementType, this.chunkDepth, data, start, end, this);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    return tree_serializeToBytesArrayComposite(this.elementType, length, this.chunkDepth, chunksNode, output, offset);
  }

  // Helpers for TreeView

  tree_getLength(node: Node): number {
    return getLengthFromRootNode(node);
  }

  tree_setLength(tree: Tree, length: number): void {
    // TODO: Add LeafNode.fromUint()
    const lengthNode = new LeafNode(zeroNode(0));
    lengthNode.setUint(4, 0, length);
    tree.setNode(LENGTH_GINDEX, lengthNode);
  }

  tree_getChunksNode(node: Node): Node {
    return node.left;
  }

  tree_setChunksNode(rootNode: Node, chunksNode: Node, newLength?: number): Node {
    let lengthNode: LeafNode;
    if (newLength !== undefined) {
      lengthNode = new LeafNode(zeroNode(0));
      lengthNode.setUint(4, 0, newLength);
    } else {
      lengthNode = rootNode.right as LeafNode;
    }
    return new BranchNode(chunksNode, lengthNode);
  }

  // Merkleization

  hashTreeRoot(value: ValueOf<ElementType>[]): Uint8Array {
    return mixInLength(super.hashTreeRoot(value), value.length);
  }

  protected getRoots(value: ValueOf<ElementType>[]): Uint8Array {
    return value_getRootsArrayComposite(this.elementType, value.length, value);
  }

  // JSON

  fromJson(json: unknown, opts?: JsonOptions): ValueOf<ElementType>[] {
    return value_fromJsonArray(this.elementType, json, undefined, opts);
  }

  toJson(value: ValueOf<ElementType>[], opts?: JsonOptions): unknown {
    return value_toJsonArray(this.elementType, value, undefined, opts);
  }
}