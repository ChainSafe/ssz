import {BranchNode, LeafNode, Node} from "@chainsafe/persistent-merkle-tree";
import {CompositeType, isCompositeType} from "../../type/composite.js";

type JsonPathProp = string | number;
type JsonPath = JsonPathProp[];

export enum TreeDataTypeCode {
  witness = "witness",
  partial = "partial",
  complete = "complete",
}

type TreeDataTypeWitness = {
  type: TreeDataTypeCode.witness;
};
type TreeDataTypePartial = {
  type: TreeDataTypeCode.partial;
  jsonPaths: JsonPath[];
};
type TreeDataTypeComplete = {
  type: TreeDataTypeCode.complete;
  jsonPathProps: JsonPathProp[];
};
type TreeDataType = TreeDataTypeWitness | TreeDataTypePartial | TreeDataTypeComplete;

export function treePartialToJsonPaths(
  node: Node,
  type: CompositeType<unknown, unknown, unknown>,
  bitstring = "",
  currentDepth = 0
): TreeDataType {
  const atTypeDepth = type.depth === currentDepth;

  if (node.isLeaf()) {
    if (atTypeDepth) {
      const jsonPathProp = type.getIndexProperty(bitstringToIndex(bitstring));
      if (jsonPathProp === null) {
        return {type: TreeDataTypeCode.complete, jsonPathProps: []};
      }

      const childType = type.getPropertyType(jsonPathProp);

      // If this type merkleized fits in a single chunk then this LeafNode includes all data
      if (childType.maxChunkCount === 1) {
        return {type: TreeDataTypeCode.complete, jsonPathProps: [jsonPathProp]};
      } else {
        return {type: TreeDataTypeCode.witness};
      }
    }

    // LeafNode not at type depth can be either
    // - length / selector nodes
    // - witness
    else {
      if (currentDepth === 1 && bitstringToIndex(bitstring) === 1 && isCompositeType(type) && type.isList) {
        return {type: TreeDataTypeCode.complete, jsonPathProps: []};
      }
      return {type: TreeDataTypeCode.witness};
    }
  } else {
    if (atTypeDepth) {
      const jsonPathProp = type.getIndexProperty(bitstringToIndex(bitstring));
      if (jsonPathProp === null) {
        return {type: TreeDataTypeCode.complete, jsonPathProps: []};
      }

      const childType = type.getPropertyType(jsonPathProp);

      if (!isCompositeType(childType)) {
        throw Error("BranchNode does not map to CompositeType");
      }

      // Restart navigation with childType, bitstring = "0", currentDepth = 0
      const ress = treePartialToJsonPaths(node, childType, "0", 0);

      if (ress.type === TreeDataTypeCode.complete) {
        return {type: TreeDataTypeCode.complete, jsonPathProps: [jsonPathProp]};
      } else if (ress.type === TreeDataTypeCode.partial) {
        return {
          type: TreeDataTypeCode.partial,
          jsonPaths: ress.jsonPaths.filter((jpp) => jpp.length > 0).map((jpp) => [jsonPathProp, ...jpp]),
        };
      } else {
        throw Error(`BranchNode navigation returns witness - bitstring ${bitstring}`);
      }
    }

    // BranchNode at not type depth, keep navigating
    else {
      const leftRes = treePartialToJsonPaths(node.left, type, bitstring + "0", currentDepth + 1);
      const rightRes = treePartialToJsonPaths(node.right, type, bitstring + "1", currentDepth + 1);

      // Upstream status that all data is there
      if (leftRes.type === TreeDataTypeCode.complete && rightRes.type === TreeDataTypeCode.complete) {
        return {type: TreeDataTypeCode.complete, jsonPathProps: [...leftRes.jsonPathProps, ...rightRes.jsonPathProps]};
      }

      // Ensure there's not a bad BranchNode. All BranchNodes must contain some data at least on one side
      else if (leftRes.type === TreeDataTypeCode.witness && rightRes.type === TreeDataTypeCode.witness) {
        throw Error(`BranchNode with witness in left and right nodes - bitstring ${bitstring}`);
      }

      // Here equals to:
      // - partial-data on both sides
      // - partial-data + full-data
      // - partial-data + witness
      // - full-data + witness
      else {
        return {type: TreeDataTypeCode.partial, jsonPaths: getMergedJsonPathsFrom(leftRes, rightRes)};
      }
    }
  }
}

function getJsonPathFromRes(res: TreeDataType): JsonPath[] {
  switch (res.type) {
    case TreeDataTypeCode.complete:
      return [res.jsonPathProps];
    case TreeDataTypeCode.partial:
      return res.jsonPaths;
    case TreeDataTypeCode.witness:
      return [];
  }
}

function getMergedJsonPathsFrom(leftRes: TreeDataType, rightRes: TreeDataType): JsonPath[] {
  return [...getJsonPathFromRes(leftRes), ...getJsonPathFromRes(rightRes)];
}

function bitstringToIndex(bitstring: string): number {
  if (bitstring === "") return 0;
  return Number.parseInt(bitstring, 2);
}

/**
 * Recreate a `Node` given offsets and leaves of a tree-offset proof
 *
 * Recursive definition
 *
 * See https://github.com/protolambda/eth-merkle-trees/blob/master/tree_offsets.md
 */
export function treeOffsetProofToNode(offsets: number[], leaves: Uint8Array[]): Node {
  if (!leaves.length) {
    throw new Error("Proof must contain gt 0 leaves");
  } else if (leaves.length === 1) {
    return LeafNode.fromRoot(leaves[0]);
  } else {
    // the offset popped from the list is the # of leaves in the left subtree
    const pivot = offsets[0];
    return new BranchNode(
      treeOffsetProofToNode(offsets.slice(1, pivot), leaves.slice(0, pivot)),
      treeOffsetProofToNode(offsets.slice(pivot), leaves.slice(pivot))
    );
  }
}
