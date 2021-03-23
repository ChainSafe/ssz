import {hash} from "./hash";

const ERR_INVALID_TREE = "Invalid tree";
const ERR_NOT_IMPLEMENTED = "Not implemented";

export abstract class Node {
  get root(): Uint8Array {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
  isLeaf(): boolean {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
  get left(): Node {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
  get right(): Node {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rebindLeft(left: Node): Node {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rebindRight(right: Node): Node {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
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
  set left(n: Node) {
    this._left = n;
  }
  get right(): Node {
    return this._right;
  }
  set right(n: Node) {
    this._right = n;
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
