import {BranchNode, Node} from "@chainsafe/persistent-merkle-tree";

type JsonPathProp = string | number;

/** Duplicated partial declaration to break circular dependency with CompositeType */
type Type = {
  readonly isBasic: boolean;
  /** Tree depth to chunks or LeafNodes */
  readonly depth: number;
  /** Maximum count of LeafNode chunks this type can have when merkleized */
  readonly maxChunkCount: number;
};

/** Duplicated partial declaration to break circular dependency with CompositeType */
type CompositeType = Type & {
  /** Return the property's subtype if the property exists */
  getPropertyType(property: JsonPathProp): Type;
  /** Return a leaf node index's property if the index is within bounds */
  getIndexProperty(index: number): JsonPathProp | null;
  /** INTERNAL METHOD: post process `Ǹode` instance created from a proof */
  tree_fromProofNode(node: Node): {node: Node; done: boolean};
};

/** Duplicated partial declaration to break circular dependency with CompositeType */
function isCompositeType(type: Type): type is CompositeType {
  return !type.isBasic;
}

/**
 * Navigates and mutates nodes to post process a tree created with `Tree.createFromProof`.
 * Tree returns regular a tree with only BranchNode and LeafNode instances. However, SSZ features
 * non-standard nodes that make proofs for those types to be un-usable. This include:
 * - BranchNodeStruct: Must contain complete data `tree_fromProofNode` transforms a BranchNode and
 *   all of its data into a single BranchNodeStruct instance.
 *
 * @param bitstring Bitstring without the leading "1", since it's only used to compute horizontal indexes.
 */
export function treePostProcessFromProofNode(node: Node, type: CompositeType, bitstring = "", currentDepth = 0): Node {
  // Must run tree_fromProofNode on the first received node (i.e. Validator object)
  if (currentDepth === 0) {
    const nodePost = type.tree_fromProofNode(node);
    if (nodePost.done) {
      return nodePost.node;
    } else {
      node = nodePost.node;
    }
  }

  const atTypeDepth = type.depth === currentDepth;

  if (node.isLeaf()) {
    if (atTypeDepth) {
      const jsonPathProp = type.getIndexProperty(bitstringToIndex(bitstring));
      if (jsonPathProp === null) {
        // bitstring is out of bounds, witness node
        return node;
      }

      const childType = type.getPropertyType(jsonPathProp);

      // If this type merkleized fits in a single chunk then this LeafNode includes all data
      if (childType.maxChunkCount === 1 && isCompositeType(childType)) {
        return childType.tree_fromProofNode(node).node;
      }
      // Witness node
      else {
        return node;
      }
    }

    // LeafNode not at type depth is a witness or a length / selector nodes
    else {
      return node;
    }
  } else {
    if (atTypeDepth) {
      const jsonPathProp = type.getIndexProperty(bitstringToIndex(bitstring));
      if (jsonPathProp === null) {
        // bitstring is out of bounds, witness node
        return node;
      }

      const childType = type.getPropertyType(jsonPathProp);

      if (!isCompositeType(childType)) {
        throw Error("BranchNode does not map to CompositeType");
      }

      const nodePost = childType.tree_fromProofNode(node);

      // If tree_fromProofNode is the identity function, keep going, otherwise stop navigating
      if (nodePost.done) {
        return nodePost.node;
      } else {
        return treePostProcessFromProofNode(nodePost.node, childType);
      }
    }

    // BranchNode at not type depth, keep navigating
    else {
      const leftNode = treePostProcessFromProofNode(node.left, type, bitstring + "0", currentDepth + 1);
      const rightNode = treePostProcessFromProofNode(node.right, type, bitstring + "1", currentDepth + 1);

      if (leftNode === node.left && rightNode === node.right) {
        return node;
      } else {
        return new BranchNode(leftNode, rightNode);
      }
    }
  }
}

/** Return the node horizontal index given a bitstring without the leading "1" */
function bitstringToIndex(bitstring: string): number {
  if (bitstring === "") return 0;
  return parseInt(bitstring, 2);
}
