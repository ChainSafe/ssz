import {HashObject} from "@chainsafe/as-sha256";
import {hashObjectToUint8Array, hashTwoObjects, uint8ArrayToHashObject} from "./hash";

const ERR_INVALID_TREE = "Invalid tree";

export abstract class Node implements HashObject {
  // this is to save an extra variable to check if a node has a root or not
  h0 = (null as unknown) as number;
  h1 = 0;
  h2 = 0;
  h3 = 0;
  h4 = 0;
  h5 = 0;
  h6 = 0;
  h7 = 0;

  abstract root: Uint8Array;
  abstract rootHashObject: HashObject;
  abstract left: Node;
  abstract right: Node;

  applyHash(root: HashObject): void {
    this.h0 = root.h0;
    this.h1 = root.h1;
    this.h2 = root.h2;
    this.h3 = root.h3;
    this.h4 = root.h4;
    this.h5 = root.h5;
    this.h6 = root.h6;
    this.h7 = root.h7;
  }

  abstract isLeaf(): boolean;
  abstract rebindLeft(left: Node): Node;
  abstract rebindRight(right: Node): Node;
}

export class BranchNode extends Node {
  constructor(private _left: Node, private _right: Node) {
    super();
    if (!_left || !_right) throw new Error(ERR_INVALID_TREE);
  }

  get rootHashObject(): HashObject {
    if (this.h0 === null) {
      super.applyHash(hashTwoObjects(this.left.rootHashObject, this.right.rootHashObject));
    }
    return this;
  }

  get root(): Uint8Array {
    return hashObjectToUint8Array(this.rootHashObject);
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
  constructor(_root: Uint8Array) {
    super();
    if (_root.length !== 32) throw new Error(ERR_INVALID_TREE);
    this.applyHash(uint8ArrayToHashObject(_root));
  }

  get rootHashObject(): HashObject {
    return this;
  }

  get root(): Uint8Array {
    return hashObjectToUint8Array(this);
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
