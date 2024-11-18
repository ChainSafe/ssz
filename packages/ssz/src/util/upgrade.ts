import type {Node} from "@chainsafe/persistent-merkle-tree";
import {BranchNode, zeroNode} from "@chainsafe/persistent-merkle-tree";
import type {ContainerType} from "../type/container";

/** Upgrade the current View/ViewDU to a root node of new type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function upgradeToNewType(rootNode: Node, oldType: ContainerType<any>, newType: ContainerType<any>): Node {
  const newFieldsCount = newType.fieldsEntries.length;
  const currentFieldsCount = oldType.fieldsEntries.length;
  if (newFieldsCount < currentFieldsCount) {
    throw Error(`Cannot convert to a type with fewer fields: ${newFieldsCount} < ${currentFieldsCount}`);
  }

  if (newType.depth === oldType.depth) {
    // no need to grow the tree
    return rootNode;
  }

  // grow the tree
  let node = rootNode;
  for (let depth = oldType.depth; depth < newType.depth; depth++) {
    node = new BranchNode(node, zeroNode(depth));
  }

  return node;
}
