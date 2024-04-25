import {HashObject} from "@chainsafe/as-sha256/lib/hashObject";
import {hashObjectToUint8Array, hasher, uint8ArrayToHashObject} from "./hasher";

const TWO_POWER_32 = 2 ** 32;

export type HashComputation = {
  src0: Node;
  src1: Node;
  dest: Node;
};

/**
 * An immutable binary merkle tree node
 */
export abstract class Node implements HashObject {
  /**
   * May be null. This is to save an extra variable to check if a node has a root or not
   */
  h0: number;
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  h7: number;

  /** The root hash of the node */
  abstract root: Uint8Array;
  /** The root hash of the node as a `HashObject` */
  abstract rootHashObject: HashObject;
  /** The left child node */
  abstract left: Node;
  /** The right child node */
  abstract right: Node;

  constructor(h0: number, h1: number, h2: number, h3: number, h4: number, h5: number, h6: number, h7: number) {
    this.h0 = h0;
    this.h1 = h1;
    this.h2 = h2;
    this.h3 = h3;
    this.h4 = h4;
    this.h5 = h5;
    this.h6 = h6;
    this.h7 = h7;
  }

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

  /** Returns true if the node is a `LeafNode` */
  abstract isLeaf(): boolean;
}

/**
 * An immutable binary merkle tree node that has a `left` and `right` child
 */
export class BranchNode extends Node {
  constructor(private _left: Node, private _right: Node) {
    // First null value is to save an extra variable to check if a node has a root or not
    super(null as unknown as number, 0, 0, 0, 0, 0, 0, 0);

    if (!_left) {
      throw new Error("Left node is undefined");
    }
    if (!_right) {
      throw new Error("Right node is undefined");
    }
  }

  // TODO: private, unit tests, use Array[HashComputation[]] for better performance
  getHashComputation(level: number, hashCompsByLevel: Map<number, HashComputation[]>): void {
    if (this.h0 === null) {
      let hashComputations = hashCompsByLevel.get(level);
      if (hashComputations === undefined) {
        hashComputations = [];
        hashCompsByLevel.set(level, hashComputations);
      }
      hashComputations.push({src0: this.left, src1: this.right, dest: this});
      if (!this.left.isLeaf()) {
        (this.left as BranchNode).getHashComputation(level + 1, hashCompsByLevel);
      }
      if (!this.right.isLeaf()) {
        (this.right as BranchNode).getHashComputation(level + 1, hashCompsByLevel);
      }

      return;
    }

    // else stop the recursion, LeafNode should have h0
  }

  batchHash(): Uint8Array {
    const hashCompsByLevel = new Map<number, HashComputation[]>();
    this.getHashComputation(0, hashCompsByLevel);
    const levelsDesc = Array.from(hashCompsByLevel.keys()).sort((a, b) => b - a);
    for (const level of levelsDesc) {
      const hcArr = hashCompsByLevel.get(level);
      if (!hcArr) {
        // should not happen
        throw Error(`no hash computations for level ${level}`);
      }
      // HashComputations of the same level are safe to batch
      const batch = Math.floor(hcArr.length / 4);
      for (let i = 0; i < batch; i++) {
        const item0 = hcArr[i * 4];
        const item1 = hcArr[i * 4 + 1];
        const item2 = hcArr[i * 4 + 2];
        const item3 = hcArr[i * 4 + 3];

        const [dest0, dest1, dest2, dest3] = hasher.hash8HashObjects([
          item0.src0,
          item0.src1,
          item1.src0,
          item1.src1,
          item2.src0,
          item2.src1,
          item3.src0,
          item3.src1,
        ]);

        item0.dest.applyHash(dest0);
        item1.dest.applyHash(dest1);
        item2.dest.applyHash(dest2);
        item3.dest.applyHash(dest3);
      }
      // compute remaining separatedly
      const remLen = hcArr.length % 4;
      for (let i = remLen - 1; i >= 0; i--) {
        const {src0, src1, dest} = hcArr[hcArr.length - i - 1];
        dest.applyHash(hasher.digest64HashObjects(src0, src1));
      }
    }

    if (this.h0 === null) {
      throw Error("Root is not computed by batch");
    }
    return this.root;
  }

  get rootHashObject(): HashObject {
    if (this.h0 === null) {
      super.applyHash(hasher.digest64HashObjects(this.left.rootHashObject, this.right.rootHashObject));
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
}

/**
 * An immutable binary merkle tree node that has no children
 */
export class LeafNode extends Node {
  static fromRoot(root: Uint8Array): LeafNode {
    return this.fromHashObject(uint8ArrayToHashObject(root));
  }

  /**
   * New LeafNode from existing HashObject.
   */
  static fromHashObject(ho: HashObject): LeafNode {
    return new LeafNode(ho.h0, ho.h1, ho.h2, ho.h3, ho.h4, ho.h5, ho.h6, ho.h7);
  }

  /**
   * New LeafNode with its internal value set to zero. Consider using `zeroNode(0)` if you don't need to mutate.
   */
  static fromZero(): LeafNode {
    return new LeafNode(0, 0, 0, 0, 0, 0, 0, 0);
  }

  /**
   * LeafNode with HashObject `(uint32, 0, 0, 0, 0, 0, 0, 0)`.
   */
  static fromUint32(uint32: number): LeafNode {
    return new LeafNode(uint32, 0, 0, 0, 0, 0, 0, 0);
  }

  /**
   * Create a new LeafNode with the same internal values. The returned instance is safe to mutate
   */
  clone(): LeafNode {
    return LeafNode.fromHashObject(this);
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

  writeToBytes(data: Uint8Array, start: number, size: number): void {
    // TODO: Optimize
    data.set(this.root.slice(0, size), start);
  }

  getUint(uintBytes: number, offsetBytes: number, clipInfinity?: boolean): number {
    const hIndex = Math.floor(offsetBytes / 4);

    // number has to be masked from an h value
    if (uintBytes < 4) {
      const bitIndex = (offsetBytes % 4) * 8;
      const h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        return 0xff & (h >> bitIndex);
      } else {
        return 0xffff & (h >> bitIndex);
      }
    }

    // number equals the h value
    else if (uintBytes === 4) {
      return getNodeH(this, hIndex) >>> 0;
    }

    // number spans 2 h values
    else if (uintBytes === 8) {
      const low = getNodeH(this, hIndex);
      const high = getNodeH(this, hIndex + 1);
      if (high === 0) {
        return low >>> 0;
      } else if (high === -1 && low === -1 && clipInfinity) {
        // Limit uint returns
        return Infinity;
      } else {
        return (low >>> 0) + (high >>> 0) * TWO_POWER_32;
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
      const bitIndex = (offsetBytes % 4) * 8;
      const h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        return BigInt(0xff & (h >> bitIndex));
      } else {
        return BigInt(0xffff & (h >> bitIndex));
      }
    }

    // number equals the h value
    else if (uintBytes === 4) {
      return BigInt(getNodeH(this, hIndex) >>> 0);
    }

    // number spans multiple h values
    else {
      const hRange = Math.ceil(uintBytes / 4);
      let v = BigInt(0);
      for (let i = 0; i < hRange; i++) {
        v += BigInt(getNodeH(this, hIndex + i) >>> 0) << BigInt(32 * i);
      }
      return v;
    }
  }

  setUint(uintBytes: number, offsetBytes: number, value: number, clipInfinity?: boolean): void {
    const hIndex = Math.floor(offsetBytes / 4);

    // number has to be masked from an h value
    if (uintBytes < 4) {
      const bitIndex = (offsetBytes % 4) * 8;
      let h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        h &= ~(0xff << bitIndex);
        h |= (0xff && value) << bitIndex;
      } else {
        h &= ~(0xffff << bitIndex);
        h |= (0xffff && value) << bitIndex;
      }
      setNodeH(this, hIndex, h);
    }

    // number equals the h value
    else if (uintBytes === 4) {
      setNodeH(this, hIndex, value);
    }

    // number spans 2 h values
    else if (uintBytes === 8) {
      if (value === Infinity && clipInfinity) {
        setNodeH(this, hIndex, -1);
        setNodeH(this, hIndex + 1, -1);
      } else {
        setNodeH(this, hIndex, value & 0xffffffff);
        setNodeH(this, hIndex + 1, (value / TWO_POWER_32) & 0xffffffff);
      }
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
      const bitIndex = (offsetBytes % 4) * 8;
      let h = getNodeH(this, hIndex);
      if (uintBytes === 1) {
        h &= ~(0xff << bitIndex);
        h |= (0xff && value) << bitIndex;
      } else {
        h &= ~(0xffff << bitIndex);
        h |= (0xffff && value) << bitIndex;
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
      const bitIndex = (offsetBytes % 4) * 8;
      bitwiseOrNodeH(this, hIndex, value << bitIndex);
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
