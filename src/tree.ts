import { Gindex, gindexIterator } from "./gindex";
import { Node, BranchNode, Link, compose, identity, LeafNode } from "./node";
import { zeroNode } from "./zeroNode";

export type Hook = (v: Tree) => void;

const ERR_INVALID_TREE = "Invalid tree";

export class Tree {
  private _node: Node;
  hook?: Hook;
  constructor(node: Node, hook?: Hook) {
    this._node = node;
    this.hook = hook;
  }
  get rootNode(): Node {
    return this._node;
  }
  set rootNode(n: Node) {
    this._node = n;
    if (this.hook) {
      this.hook(this);
    }
  }
  get root(): Uint8Array {
    return this.rootNode.root;
  }
  getNode(index: Gindex): Node {
    let node = this.rootNode;
    for (const i of gindexIterator(index)) {
      if (i) {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        node = node.right;
      } else {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        node = node.left;
      }
    }
    return node;
  }
  setter(index: Gindex, expand=false): Link {
    let link = identity;
    let node = this.rootNode;
    const iterator = gindexIterator(index);
    for (const i of iterator) {
      if (i) {
        if (node.isLeaf()) {
          if (!expand) throw new Error(ERR_INVALID_TREE);
          else {
            const child = zeroNode(iterator.remainingBitLength() - 1);
            node = new BranchNode(child, child);
          }
        }
        link = compose(node.rebindRight.bind(node), link);
        node = node.right;
      } else {
        if (node.isLeaf()) {
          if (!expand) throw new Error(ERR_INVALID_TREE);
          else {
            const child = zeroNode(iterator.remainingBitLength() - 1);
            node = new BranchNode(child, child);
          }
        }
        link = compose(node.rebindLeft.bind(node), link);
        node = node.left;
      }
    }
    return compose(identity, link);
  }
  setNode(index: Gindex, n: Node, expand=false): void {
    this.rootNode = this.setter(index, expand)(n);
  }
  getRoot(index: Gindex): Uint8Array {
    return this.getNode(index).root;
  }
  setRoot(index: Gindex, root: Uint8Array, expand=false): void {
    this.setNode(index, new LeafNode(root), expand);
  }
  getSubtree(index: Gindex): Tree {
    return new Tree(
      this.getNode(index),
      (v: Tree): void => this.setNode(index, v.rootNode)
    );
  }
  setSubtree(index: Gindex, v: Tree, expand=false): void {
    this.setNode(index, v.rootNode, expand);
  }
  clone(): Tree {
    return new Tree(this.rootNode);
  }

  getSingleProof(index: Gindex): Uint8Array[] {
    const proof: Uint8Array[] = [];
    let node = this.rootNode;
    for (const i of gindexIterator(index)) {
      if (i) {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        proof.push(node.left.root);
        node = node.right;
      } else {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        proof.push(node.right.root);
        node = node.left;
      }
    }
    proof.push(node.root);
    return proof.reverse();
  }
}
