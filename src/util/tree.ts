import {Tree} from "@chainsafe/persistent-merkle-tree";

export function isTree(value: unknown): value is Tree {
  return Boolean((value as Tree).rootNode && (value as Tree).rootNode.isLeaf);
}
