import {
  HashComputationGroup,
  HashComputationLevel,
  LeafNode,
  Node,
  executeHashComputations,
  getNodesAtDepth,
  levelAtIndex,
  packedUintNum64sToLeafNodes,
  setNodesAtDepth,
  subtreeFillToContents,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";

import {ListBasicTreeViewDU} from "../viewDU/listBasic";
import {ListBasicOpts, ListBasicType} from "./listBasic";
import {UintNumberType} from "./uint";
import {addLengthNode, getLengthFromRootNode} from "./arrayBasic";

/**
 * Specific implementation of ListBasicType for UintNumberType with some optimizations.
 */
export class ListUintNum64Type extends ListBasicType<UintNumberType> {
  private hcGroup: HashComputationGroup | undefined;
  constructor(limit: number, opts?: ListBasicOpts) {
    super(new UintNumberType(8), limit, opts);
  }

  /**
   * Return a ListBasicTreeViewDU with nodes populated
   * @param unusedViewDU optional, if provided we'll create ViewDU using the provided rootNode. Need to rehash the whole
   * tree in this case to make it clean for consumers.
   */
  toViewDU(value: number[], unusedViewDU?: ListBasicTreeViewDU<UintNumberType>): ListBasicTreeViewDU<UintNumberType> {
    // no need to serialize and deserialize like in the abstract class
    const {treeNode, leafNodes} = this.packedUintNum64sToNode(value, unusedViewDU?.node);

    if (unusedViewDU) {
      const hcGroup = this.getHcGroup();
      hcGroup.reset();
      forceGetHashComputations(treeNode, this.chunkDepth + 1, 0, hcGroup.byLevel);
      hcGroup.clean();

      treeNode.h0 = null as unknown as number;
      executeHashComputations(hcGroup.byLevel);
      // This makes sure the root node is computed by batch
      if (treeNode.h0 === null) {
        throw Error("Root is not computed by batch");
      }
    }
    // cache leaf nodes in the ViewDU
    return this.getViewDU(treeNode, {
      nodes: leafNodes,
      length: value.length,
      nodesPopulated: true,
    });
  }

  /**
   * No need to serialize and deserialize like in the abstract class
   * This should be conformed to parent's signature so cannot provide an `unusedViewDU` parameter here
   */
  value_toTree(value: number[]): Node {
    const {treeNode} = this.packedUintNum64sToNode(value);
    return treeNode;
  }

  private packedUintNum64sToNode(value: number[], unusedRootNode?: Node): {treeNode: Node; leafNodes: LeafNode[]} {
    if (value.length > this.limit) {
      throw new Error(`Exceeds limit: ${value.length} > ${this.limit}`);
    }

    if (unusedRootNode) {
      // create new tree from unusedRootNode
      const oldLength = getLengthFromRootNode(unusedRootNode);
      if (oldLength > value.length) {
        throw new Error(`Cannot decrease length: ${oldLength} > ${value.length}`);
      }

      const oldNodeCount = Math.ceil(oldLength / 4);
      const oldChunksNode = unusedRootNode.left;
      const oldLeafNodes = getNodesAtDepth(oldChunksNode, this.chunkDepth, 0, oldNodeCount) as LeafNode[];
      if (oldLeafNodes.length !== oldNodeCount) {
        throw new Error(`oldLeafNodes.length ${oldLeafNodes.length} !== oldNodeCount ${oldNodeCount}`);
      }

      const newNodeCount = Math.ceil(value.length / 4);
      const count = newNodeCount - oldNodeCount;
      const newLeafNodes = Array.from({length: count}, () => new LeafNode(0, 0, 0, 0, 0, 0, 0, 0));
      const leafNodes = [...oldLeafNodes, ...newLeafNodes];
      packedUintNum64sToLeafNodes(value, leafNodes);

      // middle nodes are not changed so consumer must recompute parent hashes
      const newChunksNode = setNodesAtDepth(
        oldChunksNode,
        this.chunkDepth,
        Array.from({length: count}, (_, i) => oldNodeCount + i),
        newLeafNodes
      );
      const treeNode = addLengthNode(newChunksNode, value.length);

      return {treeNode, leafNodes};
    }

    // create new tree from scratch
    const leafNodes = packedUintNum64sToLeafNodes(value);
    // subtreeFillToContents mutates the leafNodes array
    const chunksNode = subtreeFillToContents([...leafNodes], this.chunkDepth);
    const treeNode = addLengthNode(chunksNode, value.length);
    return {treeNode, leafNodes};
  }

  private getHcGroup(): HashComputationGroup {
    if (!this.hcGroup) {
      this.hcGroup = new HashComputationGroup();
    }
    return this.hcGroup;
  }
}

/**
 * Consider moving this to persistent-merkle-tree.
 * For now this is the only flow to force get hash computations.
 */
function forceGetHashComputations(
  node: Node,
  nodeDepth: number,
  index: number,
  hcByLevel: HashComputationLevel[]
): void {
  // very important: never mutate zeroNode
  if (node === zeroNode(nodeDepth) || node.isLeaf()) {
    return;
  }

  // if (node.h0 === null) {
  const hashComputations = levelAtIndex(hcByLevel, index);
  const {left, right} = node;
  hashComputations.push(left, right, node);
  // leaf nodes should have h0 to stop the recursion
  forceGetHashComputations(left, nodeDepth - 1, index + 1, hcByLevel);
  forceGetHashComputations(right, nodeDepth - 1, index + 1, hcByLevel);
}
