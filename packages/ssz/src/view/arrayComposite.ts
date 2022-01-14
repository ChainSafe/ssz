import {getNodesAtDepth, Node, Tree} from "@chainsafe/persistent-merkle-tree";
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
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>
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
    // TODO: Optimize without bitstring
    const gindex = this.type.getGindexBitStringAtChunkIndex(index);
    const subtree = this.tree.getSubtree(gindex);
    return this.type.elementType.getView(subtree);
  }

  set(index: number, view: CompositeView<ElementType>): void {
    const node = this.type.elementType.commitView(view);
    this.tree.setNodeAtDepth(this.type.depth, index, node);
  }

  getAllReadonly(): CompositeView<ElementType>[] {
    const length = this.length;
    const chunksNode = this.type.tree_getChunksNode(this.node);
    const nodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, length);
    const views: CompositeView<ElementType>[] = [];
    for (let i = 0; i < nodes.length; i++) {
      // TODO: Optimize
      views.push(this.type.elementType.getView(new Tree(nodes[i])));
    }
    return views;
  }

  getAllReadonlyValues(): ValueOf<ElementType>[] {
    const length = this.length;
    const chunksNode = this.type.tree_getChunksNode(this.node);
    const nodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, length);
    const values: ValueOf<ElementType>[] = [];
    for (let i = 0; i < nodes.length; i++) {
      values.push(this.type.elementType.tree_toValue(nodes[i]));
    }
    return values;
  }
}
