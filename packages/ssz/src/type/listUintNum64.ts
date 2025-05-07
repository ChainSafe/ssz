import {LeafNode, Node, packedUintNum64sToLeafNodes, subtreeFillToContents} from "@chainsafe/persistent-merkle-tree";

import {ListBasicTreeViewDU} from "../viewDU/listBasic.ts";
import {addLengthNode} from "./arrayBasic.ts";
import {ListBasicOpts, ListBasicType} from "./listBasic.ts";
import {UintNumberType} from "./uint.ts";

/**
 * Specific implementation of ListBasicType for UintNumberType with some optimizations.
 */
export class ListUintNum64Type extends ListBasicType<UintNumberType> {
  constructor(limit: number, opts?: ListBasicOpts) {
    super(new UintNumberType(8), limit, opts);
  }

  /**
   * Return a ListBasicTreeViewDU with nodes populated
   */
  toViewDU(value: number[]): ListBasicTreeViewDU<UintNumberType> {
    // no need to serialize and deserialize like in the abstract class
    const {treeNode, leafNodes} = this.packedUintNum64sToNode(value);
    // cache leaf nodes in the ViewDU
    return this.getViewDU(treeNode, {
      nodes: leafNodes,
      length: value.length,
      nodesPopulated: true,
    });
  }

  /**
   * No need to serialize and deserialize like in the abstract class
   */
  value_toTree(value: number[]): Node {
    const {treeNode} = this.packedUintNum64sToNode(value);
    return treeNode;
  }

  private packedUintNum64sToNode(value: number[]): {treeNode: Node; leafNodes: LeafNode[]} {
    if (value.length > this.limit) {
      throw new Error(`Exceeds limit: ${value.length} > ${this.limit}`);
    }

    const leafNodes = packedUintNum64sToLeafNodes(value);
    // subtreeFillToContents mutates the leafNodes array
    const rootNode = subtreeFillToContents([...leafNodes], this.chunkDepth);
    const treeNode = addLengthNode(rootNode, value.length);
    return {treeNode, leafNodes};
  }
}
