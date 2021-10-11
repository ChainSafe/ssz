import {LeafNode, Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {LENGTH_GINDEX} from "../types/composite";
import {CompositeType, TreeView, ValueOf, ViewOf, ViewOfComposite} from "./abstract";
import {
  getLengthFromRootNode,
  struct_deserializeFromBytesArrayComposite,
  struct_serializeToBytesArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
} from "./array";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class ListCompositeType<ElementType extends CompositeType<any>> extends CompositeType<ValueOf<ElementType>[]> {
  // Immutable characteristics
  readonly itemsPerChunk = 1;
  readonly isBasic = false;
  readonly depth: number;
  readonly maxChunkCount: number;
  readonly fixedLen = null;
  readonly minLen = 0;
  readonly maxLen: number;

  constructor(readonly elementType: ElementType, readonly limit: number) {
    super();

    if (!elementType.isBasic) {
      throw Error("ListCompositeType can only have a basic type as elementType");
    }

    // TODO Check that itemsPerChunk is an integer
    this.maxChunkCount = Math.ceil((this.limit * 1) / 32);
    // Depth includes the extra level for the length node
    this.depth = 1 + Math.ceil(Math.log2(this.maxChunkCount));
    this.maxLen = this.limit * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
  }

  getView(node: Node): ListCompositeTreeView<ElementType> {
    return new ListCompositeTreeView(this, new Tree(node));
  }

  // Serialization + deserialization

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

  tree_getLength(tree: Tree): number {
    return (tree.getNode(LENGTH_GINDEX) as LeafNode).getUint(4, 0);
  }
}

export class ListCompositeTreeView<ElementType extends CompositeType<any>> implements TreeView {
  private readonly views: ViewOf<ElementType>[] = [];
  private readonly dirtyNodes = new Set<number>();
  private inMutableMode = false;
  private allLeafNodesPopulated = false;

  constructor(protected type: ListCompositeType<ElementType>, protected tree: Tree) {}

  get length(): number {
    return this.type.tree_getLength(this.tree);
  }

  get node(): Node {
    return this.tree.rootNode;
  }

  /**
   * Get element at index `i`. Returns the primitive element directly
   */
  get(index: number): ViewOfComposite<ElementType> {
    let view = this.views[index];
    if (view === undefined) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      const node = this.tree.getNode(gindex);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      view = this.type.elementType.getView(node, this.inMutableMode) as ViewOf<ElementType>;
      this.views[index] = view;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return view;
  }

  set(index: number, value: ViewOf<ElementType>): void {
    this.views[index] = value;

    // Commit immediately
    if (this.inMutableMode) {
      // Do not commit to the tree, but update the node in leafNodes
      this.dirtyNodes.add(index);
    } else {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      this.tree.setNode(gindex, value.node);
    }
  }

  toMutable(): void {
    this.inMutableMode = true;
  }

  commit(): void {
    if (this.dirtyNodes.size === 0) {
      return;
    }

    // TODO: Use fast setNodes() method
    for (const index of this.dirtyNodes) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      this.tree.setNode(gindex, this.views[index]);
    }

    this.dirtyNodes.clear();
    this.inMutableMode = false;
  }

  // push(value: T): void {
  //   this.type.tree_push(this.tree, value);
  // }

  // getAll(): T[] {
  //   if (this.allElementViewsPopulated) {
  //     return this.elementViews;
  //   } else {
  //     const values = this.type.tree_getValues(this.tree);
  //   }
  // }
}
