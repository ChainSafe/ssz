import {HashObject} from "@chainsafe/as-sha256";
import {hashObjectToUint8Array, hashTwoObjects, isHashObject, uint8ArrayToHashObject} from "./hash";

const ERR_INVALID_TREE = "Invalid tree";

export abstract class Node implements HashObject {
  // this is to save an extra variable to check if a node has a root or not
  h0 = null as unknown as number;
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
  constructor(_root: Uint8Array | HashObject) {
    super();
    if (isHashObject(_root)) {
      this.applyHash(_root);
    } else {
      if (_root.length !== 32) throw new Error(ERR_INVALID_TREE);
      this.applyHash(uint8ArrayToHashObject(_root));
    }
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

  getUint(uintBytes: number, offsetBytes: number): number {
    if (uintBytes < 4) {
      // number has to be masked from an h value
      const hIndex = Math.floor(offsetBytes / 4);
      const bIndex = 3 - (offsetBytes % 4);
      const h = getLeafNodeH(this, hIndex);
      if (uintBytes === 1) {
        return h & (0xff << bIndex);
      } else {
        return h & (0xffff << (bIndex / 2));
      }
    } else if (uintBytes === 4) {
      // number equals the h value
      const hIndex = Math.floor(offsetBytes / 4);
      return getLeafNodeH(this, hIndex);
    } else {
      throw Error("getUint does not support uintBytes > 4");
    }
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

export function getLeafNodeH(leafNode: LeafNode, hIndex: number): number {
  if (hIndex === 0) return leafNode.h0;
  if (hIndex === 1) return leafNode.h1;
  if (hIndex === 2) return leafNode.h2;
  if (hIndex === 3) return leafNode.h3;
  if (hIndex === 4) return leafNode.h4;
  if (hIndex === 5) return leafNode.h5;
  if (hIndex === 6) return leafNode.h6;
  if (hIndex === 7) return leafNode.h7;
  throw Error("hIndex > 7");
}
