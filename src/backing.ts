import { Gindex, gindexIterator } from "./gindex";
import { Node, BranchNode, Link, compose, identity, zeroNode, LeafNode } from "./node";

export type Hook = (b: TreeBacking) => void;

const ERR_INVALID_TREE = "Invalid tree";

export class TreeBacking {
  private _node: Node;
  hook?: Hook;
  constructor(node: Node, hook?: Hook) {
    this._node = node;
    this.hook = hook;
  }
  get node(): Node {
    return this._node;
  }
  set node(n: Node) {
    this._node = n;
    if (this.hook) {
      this.hook(this);
    }
  }
  get(index: Gindex): Node {
    let node = this.node as BranchNode;
    for (const i of gindexIterator(index)) {
      if (i) {
        if (!node.right) throw new Error(ERR_INVALID_TREE);
        node = node.right as BranchNode;
      } else {
        if (!node.left) throw new Error(ERR_INVALID_TREE);
        node = node.left as BranchNode;
      }
    }
    return node;
  }
  setter(index: Gindex, expand=false): Link {
    let link = identity;
    let node = this.node as BranchNode;
    const iterator = gindexIterator(index);
    for (const i of iterator) {
      if (i) {
        if (!node.right) {
          if (!expand) throw new Error(ERR_INVALID_TREE);
          else {
            const child = zeroNode(iterator.remainingBitLength() - 1);
            node = new BranchNode(child, child);
          }
        }
        link = compose(node.rebindRight.bind(node), link);
        node = node.right as BranchNode;
      } else {
        if (!node.left) {
          if (!expand) throw new Error(ERR_INVALID_TREE);
          else {
            const child = zeroNode(iterator.remainingBitLength() - 1);
            node = new BranchNode(child, child);
          }
        }
        link = compose(node.rebindLeft.bind(node), link);
        node = node.left as BranchNode;
      }
    }
    return compose(identity, link);
  }
  set(index: Gindex, n: Node, expand=false): void {
    this.node = this.setter(index, expand)(n);
  }
  getRoot(index: Gindex): Uint8Array {
    return this.get(index).merkleRoot;
  }
  setRoot(index: Gindex, root: Uint8Array): void {
    this.set(index, new LeafNode(root));
  }
}
