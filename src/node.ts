import {hash} from "./hash";

const ERR_INVALID_TREE = "Invalid tree";

export abstract class Node {
  abstract root: Uint8Array;
  abstract left: Node;
  abstract right: Node;
  abstract isLeaf(): boolean;
  abstract rebindLeft(left: Node): Node;
  abstract rebindRight(right: Node): Node;
}

export class BranchNode extends Node {
  private _root: Uint8Array | null = null;

  constructor(private _left: Node, private _right: Node) {
    super();
    if (!_left || !_right) throw new Error(ERR_INVALID_TREE);
  }

  get root(): Uint8Array {
    if (!this._root) {
      this._root = hash(this.left.root, this.right.root);
    }
    return this._root as Uint8Array;
  }

  isLeaf(): boolean {
    return false;
  }

  get left(): Node {
    return this._left;
  }

  get right(): Node {
    return this._right;
  }

  rebindLeft(left: Node): Node {
    return new BranchNode(left, this.right);
  }

  rebindRight(right: Node): Node {
    return new BranchNode(this.left, right);
  }
}

export class LeafNode extends Node {
  constructor(private _root: Uint8Array) {
    super();
    if (_root.length !== 32) throw new Error(ERR_INVALID_TREE);
  }

  get root(): Uint8Array {
    return this._root;
  }

  isLeaf(): boolean {
    return true;
  }

  get left(): Node {
    throw Error("LeafNode has no left node");
  }

  get right(): Node {
    throw Error("LeafNode has no right node");
  }

  rebindLeft(): Node {
    throw Error("LeafNode has no left node");
  }

  rebindRight(): Node {
    throw Error("LeafNode has no right node");
  }
}

// setter helpers

export type Link = (n: Node) => Node;

export function identity(n: Node): Node {
  return n;
}

export function compose(inner: Link, outer: Link): Link {
  return function (n: Node): Node {
    return outer(inner(n));
  };
}
