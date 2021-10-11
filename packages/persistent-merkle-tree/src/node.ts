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

  writeToBytes(data: Uint8Array, start: number, size: number): void {
    // TODO: Optimize
    data.set(this.root.slice(0, size), start);
  }

  getUint(uintBytes: number, offsetBytes: number): number {
    if (uintBytes < 4) {
      // number has to be masked from an h value
      const hIndex = Math.floor(offsetBytes / 4);
      const h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        const bIndex = 3 - (offsetBytes % 4);
        return 0xff & (h >> (bIndex * 8));
      } else {
        const bIndex = 2 - (offsetBytes % 4);
        return 0xffff & (h >> (bIndex * 8));
      }
    } else if (uintBytes === 4) {
      // number equals the h value
      const hIndex = Math.floor(offsetBytes / 4);
      return getNodeH(this, hIndex);
    } else {
      throw Error("getUint does not support uintBytes > 4");
    }
  }

  getUintBigint(uintBytes: number, offsetBytes: number): bigint {
    if (uintBytes < 4) {
      // number has to be masked from an h value
      const hIndex = Math.floor(offsetBytes / 4);
      const bIndex = 4 - uintBytes - (offsetBytes % 4);
      const h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        return BigInt(0xff & (h >> (bIndex * 8)));
      } else {
        return BigInt(0xffff & (h >> (bIndex * 8)));
      }
    } else if (uintBytes === 4) {
      // number equals the h value
      const hIndex = Math.floor(offsetBytes / 4);
      return BigInt(getNodeH(this, hIndex));
    } else if (uintBytes === 8) {
      const hIndex1 = Math.floor(offsetBytes / 4);
      const hIndex2 = hIndex1 + 1;
      const h1 = BigInt(getNodeH(this, hIndex1));
      const h2 = BigInt(getNodeH(this, hIndex2));
      return (h1 << BigInt(32)) + h2;
    } else {
      throw Error("getUint does not support uintBytes > 8");
    }
  }

  setUint(uintBytes: number, offsetBytes: number, value: number): void {
    if (uintBytes === 4) {
      // number equals the h value
      const hIndex = Math.floor(offsetBytes / 4);
      setNodeH(this, hIndex, value);
    } else {
      throw Error("Does not support uintBytes !== 4");
    }
  }

  bitwiseOrUint(uintBytes: number, offsetBytes: number, value: number): void {
    if (uintBytes < 4) {
      // number has to be masked from an h value
      const hIndex = Math.floor(offsetBytes / 4);
      const bIndex = 4 - uintBytes - (offsetBytes % 4);
      bitwiseOrNodeH(this, hIndex, value << bIndex);
    } else if (uintBytes === 4) {
      // number equals the h value
      const hIndex = Math.floor(offsetBytes / 4);
      setNodeH(this, hIndex, value);
    } else {
      // TODO
      throw Error("Not supports byteLength > 4");
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

export function getNodeH(node: Node, hIndex: number): number {
  if (hIndex === 0) return node.h0;
  else if (hIndex === 1) return node.h1;
  else if (hIndex === 2) return node.h2;
  else if (hIndex === 3) return node.h3;
  else if (hIndex === 4) return node.h4;
  else if (hIndex === 5) return node.h5;
  else if (hIndex === 6) return node.h6;
  else if (hIndex === 7) return node.h7;
  else throw Error("hIndex > 7");
}

export function setNodeH(node: Node, hIndex: number, value: number): void {
  if (hIndex === 0) node.h0 = value;
  else if (hIndex === 1) node.h1 = value;
  else if (hIndex === 2) node.h2 = value;
  else if (hIndex === 3) node.h3 = value;
  else if (hIndex === 4) node.h4 = value;
  else if (hIndex === 5) node.h5 = value;
  else if (hIndex === 6) node.h6 = value;
  else if (hIndex === 7) node.h7 = value;
  else throw Error("hIndex > 7");
}

export function bitwiseOrNodeH(node: Node, hIndex: number, value: number): void {
  if (hIndex === 0) node.h0 |= value;
  else if (hIndex === 1) node.h1 |= value;
  else if (hIndex === 2) node.h2 |= value;
  else if (hIndex === 3) node.h3 |= value;
  else if (hIndex === 4) node.h4 |= value;
  else if (hIndex === 5) node.h5 |= value;
  else if (hIndex === 6) node.h6 |= value;
  else if (hIndex === 7) node.h7 |= value;
  else throw Error("hIndex > 7");
}
