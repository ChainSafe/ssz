import {HashObject} from "@chainsafe/as-sha256";
import {hashObjectToUint8Array, hashTwoObjects, isHashObject, uint8ArrayToHashObject} from "./hash";

const ERR_INVALID_TREE = "Invalid tree";
const TWO_POWER_32 = 2 ** 32;

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
    if (!_left) throw new Error("Left node is undefined");
    if (!_right) throw new Error("Right node is undefined");
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
    const hIndex = Math.floor(offsetBytes / 4);

    // number has to be masked from an h value
    if (uintBytes < 4) {
      const bIndex = 4 - uintBytes - (offsetBytes % 4);
      const h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        return 0xff & (h >> (bIndex * 8));
      } else {
        return 0xffff & (h >> (bIndex * 8));
      }
    }

    // number equals the h value
    else if (uintBytes === 4) {
      return getNodeH(this, hIndex) >>> 0;
    }

    // number spans 2 h values
    else if (uintBytes === 8) {
      const low = getNodeH(this, hIndex) >>> 0;
      const high = getNodeH(this, hIndex + 1);
      if (high === 0) {
        return low;
      } else {
        return low + high * TWO_POWER_32;
      }
    }

    // Bigger uint can't be represented
    else {
      throw Error("uintBytes > 8");
    }
  }

  getUintBigint(uintBytes: number, offsetBytes: number): bigint {
    const hIndex = Math.floor(offsetBytes / 4);

    // number has to be masked from an h value
    if (uintBytes < 4) {
      const bIndex = 4 - uintBytes - (offsetBytes % 4);
      const h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        return BigInt(0xff & (h >> (bIndex * 8)));
      } else {
        return BigInt(0xffff & (h >> (bIndex * 8)));
      }
    }

    // number equals the h value
    else if (uintBytes === 4) {
      return BigInt(getNodeH(this, hIndex));
    }

    // number spans multiple h values
    else {
      const hRange = Math.ceil(uintBytes / 4);
      let v = BigInt(0);
      for (let i = 0; i < hRange; i++) {
        v += BigInt(getNodeH(this, hIndex + i)) << BigInt(32 * i);
      }
      return v;
    }
  }

  setUint(uintBytes: number, offsetBytes: number, value: number): void {
    const hIndex = Math.floor(offsetBytes / 4);

    // number has to be masked from an h value
    if (uintBytes < 4) {
      const bIndex = 4 - uintBytes - (offsetBytes % 4);
      let h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        h &= ~(0xff << (bIndex * 8));
        h |= (0xff && value) << (bIndex * 8);
      } else {
        h &= ~(0xffff << (bIndex * 8));
        h |= (0xffff && value) << (bIndex * 8);
      }
      setNodeH(this, hIndex, h);
    }

    // number equals the h value
    else if (uintBytes === 4) {
      setNodeH(this, hIndex, value);
    }

    // number spans 2 h values
    else if (uintBytes === 8) {
      setNodeH(this, hIndex, value & 0xffffffff);
      setNodeH(this, hIndex + 1, (value / TWO_POWER_32) & 0xffffffff);
    }

    // Bigger uint can't be represented
    else {
      throw Error("uintBytes > 8");
    }
  }

  setUintBigint(uintBytes: number, offsetBytes: number, valueBN: bigint): void {
    const hIndex = Math.floor(offsetBytes / 4);

    // number has to be masked from an h value
    if (uintBytes < 4) {
      const value = Number(valueBN);
      const bIndex = 4 - uintBytes - (offsetBytes % 4);
      let h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        h &= ~(0xff << (bIndex * 8));
        h |= (0xff && value) << (bIndex * 8);
      } else {
        h &= ~(0xffff << (bIndex * 8));
        h |= (0xffff && value) << (bIndex * 8);
      }
      setNodeH(this, hIndex, h);
    }

    // number equals the h value
    else if (uintBytes === 4) {
      setNodeH(this, hIndex, Number(valueBN));
    }

    // number spans multiple h values
    else {
      const hEnd = hIndex + Math.ceil(uintBytes / 4);
      for (let i = hIndex; i < hEnd; i++) {
        setNodeH(this, i, Number(valueBN & BigInt(0xffffffff)));
        valueBN = valueBN >> BigInt(32);
      }
    }
  }

  bitwiseOrUint(uintBytes: number, offsetBytes: number, value: number): void {
    const hIndex = Math.floor(offsetBytes / 4);

    // number has to be masked from an h value
    if (uintBytes < 4) {
      const bIndex = 4 - uintBytes - (offsetBytes % 4);
      bitwiseOrNodeH(this, hIndex, value << bIndex);
    }

    // number equals the h value
    else if (uintBytes === 4) {
      bitwiseOrNodeH(this, hIndex, value);
    }

    // number spans multiple h values
    else {
      const hEnd = hIndex + Math.ceil(uintBytes / 4);
      for (let i = hIndex; i < hEnd; i++) {
        bitwiseOrNodeH(this, i, value & 0xffffffff);
        value >>= 32;
      }
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
