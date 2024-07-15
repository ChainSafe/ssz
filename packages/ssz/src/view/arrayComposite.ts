import {getNodesAtDepth, HashComputationGroup, Node, toGindexBitstring, Tree} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract";
import {CompositeType, CompositeView, CompositeViewDU} from "../type/composite";
import {TreeView} from "./abstract";

/** Expected API of this View's type. This interface allows to break a recursive dependency between types and views */
export type ArrayCompositeType<
  ElementType extends CompositeType<unknown, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> = CompositeType<ValueOf<ElementType>[], unknown, unknown> & {
  readonly elementType: ElementType;
  readonly chunkDepth: number;

  /** INTERNAL METHOD: Return the length of this type from an Array's root node */
  tree_getLength(node: Node): number;
  /** INTERNAL METHOD: Mutate a tree's rootNode with a new length value */
  tree_setLength(tree: Tree, length: number): void;
  /** INTERNAL METHOD: Return the chunks node from a root node */
  tree_getChunksNode(rootNode: Node): Node;
  /** INTERNAL METHOD: Return the offset from root for HashComputation */
  tree_chunksNodeOffset(): number;
  /** INTERNAL METHOD: Return a new root node with changed chunks node and length */
  tree_setChunksNode(
    rootNode: Node,
    chunksNode: Node,
    newLength: number | null,
    hashComps: HashComputationGroup | null
  ): Node;
};

export class ArrayCompositeTreeView<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends TreeView<ArrayCompositeType<ElementType>> {
  constructor(readonly type: ArrayCompositeType<ElementType>, protected tree: Tree) {
    super();
  }

  /**
   * Number of elements in the array. Equal to the Uint32 value of the Tree's length node
   */
  get length(): number {
    return this.type.tree_getLength(this.tree.rootNode);
  }

  /**
   * Returns the View's Tree rootNode
   */
  get node(): Node {
    return this.tree.rootNode;
  }

  /**
   * Get element at `index`. Returns a view of the Composite element type
   */
  get(index: number): CompositeView<ElementType> {
    // TODO: Optimize without bitstring
    const gindex = toGindexBitstring(this.type.depth, index);
    const subtree = this.tree.getSubtree(gindex);
    return this.type.elementType.getView(subtree);
  }

  /**
   * Get element at `index`. Returns a view of the Composite element type.
   * DOES NOT PROPAGATE CHANGES: use only for reads and to skip parent references.
   */
  getReadonly(index: number): CompositeView<ElementType> {
    // TODO: Optimize without bitstring
    const gindex = toGindexBitstring(this.type.depth, index);
    // tree.getSubtree but without the hook
    const subtree = new Tree(this.tree.getNode(gindex));
    return this.type.elementType.getView(subtree);
  }

  /**
   * Set Composite element type `view` at `index`
   */
  set(index: number, view: CompositeView<ElementType>): void {
    const length = this.length;
    if (index >= length) {
      throw Error(`Error setting index over length ${index} > ${length}`);
    }

    const node = this.type.elementType.commitView(view);
    this.tree.setNodeAtDepth(this.type.depth, index, node);
  }

  /**
   * Returns an array of views of all elements in the array, from index zero to `this.length - 1`.
   * The returned views don't have a parent hook to this View's Tree, so changes in the returned views won't be
   * propagated upwards. To get linked element Views use `this.get()`
   */
  getAllReadonly(views?: CompositeView<ElementType>[]): CompositeView<ElementType>[] {
    if (views && views.length !== this.length) {
      throw Error(`Expected ${this.length} views, got ${views.length}`);
    }
    const length = this.length;
    const chunksNode = this.type.tree_getChunksNode(this.node);
    const nodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, length);
    views = views ?? new Array<CompositeView<ElementType>>(length);
    for (let i = 0; i < length; i++) {
      // TODO: Optimize
      views[i] = this.type.elementType.getView(new Tree(nodes[i]));
    }
    return views;
  }

  /**
   * Returns an array of values of all elements in the array, from index zero to `this.length - 1`.
   * The returned values are not Views so any changes won't be propagated upwards.
   * To get linked element Views use `this.get()`
   */
  getAllReadonlyValues(values?: ValueOf<ElementType>[]): ValueOf<ElementType>[] {
    if (values && values.length !== this.length) {
      throw Error(`Expected ${this.length} values, got ${values.length}`);
    }
    const length = this.length;
    const chunksNode = this.type.tree_getChunksNode(this.node);
    const nodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, length);
    values = values ?? new Array<ValueOf<ElementType>>(length);
    for (let i = 0; i < length; i++) {
      values[i] = this.type.elementType.tree_toValue(nodes[i]);
    }
    return values;
  }
}
