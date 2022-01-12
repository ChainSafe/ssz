import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract";
import {CompositeType, TreeView, CompositeView, CompositeViewDU} from "../type/composite";

export type ArrayCompositeType<
  ElementType extends CompositeType<unknown, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> = CompositeType<ValueOf<ElementType>[], unknown, unknown> & {
  readonly elementType: ElementType;
  readonly chunkDepth: number;
  tree_getLength(node: Node): number;
  tree_setLength(tree: Tree, length: number): void;

  // TEMP
  tree_getChunksNode(rootNode: Node): Node;
  tree_setChunksNode(rootNode: Node, chunksNode: Node, newLength?: number): Node;
};

export class ArrayCompositeTreeView<
  ElementType extends CompositeType<unknown, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends TreeView<ArrayCompositeType<ElementType>> {
  constructor(readonly type: ArrayCompositeType<ElementType>, protected tree: Tree) {
    super();
  }

  get length(): number {
    return this.type.tree_getLength(this.tree.rootNode);
  }

  get node(): Node {
    return this.tree.rootNode;
  }

  /**
   * Get element at index `i`. Returns the primitive element directly
   */
  get(index: number): CompositeView<ElementType> {
    const gindex = this.type.getGindexBitStringAtChunkIndex(index);
    const subtree = this.tree.getSubtree(gindex);
    return this.type.elementType.getView(subtree);
  }

  set(index: number, view: CompositeView<ElementType>): void {
    const node = this.type.elementType.commitView(view);
    this.tree.setNodeAtDepth(this.type.depth, index, node);
  }

  getAll(): CompositeView<ElementType>[] {
    const views: CompositeView<ElementType>[] = [];
    for (let i = 0; i < this.length; i++) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(i);
      const subtree = this.tree.getSubtree(gindex);
      views.push(this.type.elementType.getView(subtree));
    }
    return views;
  }

  clone(): ArrayCompositeTreeView<ElementType> {
    return new ArrayCompositeTreeView(this.type, this.tree.clone());
  }
}
