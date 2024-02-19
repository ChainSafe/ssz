import {HashObject} from "@chainsafe/as-sha256/lib/hashObject";
import {hasher} from "./hasher";

import {
  allocHashId,
  freeHashId,
  getCache,
  getCacheOffset,
  getHash,
  getHashObject,
  HashId,
  setHash,
  setHashObject,
  setHashObjectItems,
} from "@chainsafe/as-sha256";

const BIGINT_0xFF = BigInt(0xff);
const BIGINT_256 = BigInt(256);

const registry = new FinalizationRegistry((id: HashId) => {
  freeHashId(id);
});

/**
 * An immutable binary merkle tree node
 */
export abstract class Node {
  readonly id: HashId;

  /** The root hash of the node */
  abstract root: Uint8Array;
  /** The root hash of the node as a `HashObject` */
  abstract rootHashObject: HashObject;
  /** The left child node */
  abstract left: Node;
  /** The right child node */
  abstract right: Node;

  constructor() {
    this.id = allocHashId();
    registry.register(this, this.id);
  }

  // constructor(h0: number, h1: number, h2: number, h3: number, h4: number, h5: number, h6: number, h7: number) {
  //   this.id = allocHashId();
  //   setHashObjectItems(this.id, h0, h1, h2, h3, h4, h5, h6, h7);
  //   registry.register(this, this.id);
  // }

  get h0(): number {
    return this.rootHashObject.h0;
  }

  applyHash(root: HashObject): void {
    setHashObject(this.id, root);
  }

  maybeHash(): void {}

  /** Returns true if the node is a `LeafNode` */
  abstract isLeaf(): boolean;
}

/**
 * An immutable binary merkle tree node that has a `left` and `right` child
 */
export class BranchNode extends Node {
  private hashed = false;

  constructor(private _left: Node, private _right: Node) {
    super();

    if (!_left) {
      throw new Error("Left node is undefined");
    }
    if (!_right) {
      throw new Error("Right node is undefined");
    }
  }

  get rootHashObject(): HashObject {
    this.maybeHash();
    return getHashObject(this.id);
  }

  get root(): Uint8Array {
    this.maybeHash();
    return getHash(this.id);
  }

  maybeHash(): void {
    if (!this.hashed) {
      if (!this._left.isLeaf()) {
        this._left.maybeHash();
      }
      if (!this._right.isLeaf()) {
        this._right.maybeHash();
      }

      hasher.digest64HashIds(this.left.id, this.right.id, this.id);
      this.hashed = true;
    }
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
    const node = new LeafNode();
    setHash(node.id, root);
    return node;
  }

  /**
   * New LeafNode from existing HashObject.
   */
  static fromHashObject(ho: HashObject): LeafNode {
    const node = new LeafNode();
    setHashObject(node.id, ho);
    return node;
  }

  /**
   * New LeafNode with its internal value set to zero. Consider using `zeroNode(0)` if you don't need to mutate.
   */
  static fromZero(): LeafNode {
    return new LeafNode();
  }

  /**
   * LeafNode with HashObject `(uint32, 0, 0, 0, 0, 0, 0, 0)`.
   */
  static fromUint32(uint32: number): LeafNode {
    const node = new LeafNode();
    setHashObjectItems(node.id, uint32, 0, 0, 0, 0, 0, 0, 0);
    return node;
  }

  /**
   * Create a new LeafNode with the same internal values. The returned instance is safe to mutate
   */
  clone(): LeafNode {
    return LeafNode.fromHashObject(this.rootHashObject);
  }

  get rootHashObject(): HashObject {
    return getHashObject(this.id);
  }

  get root(): Uint8Array {
    return getHash(this.id);
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
    if (uintBytes > 8 || uintBytes < 1) {
      throw new Error("uintBytes must be 1-8");
    }
    if (offsetBytes + uintBytes > 32 || offsetBytes < 0) {
      throw new Error("offsetBytes must be 0-32");
    }

    const {cache} = getCache(this.id);
    let cacheOffset = getCacheOffset(this.id) + offsetBytes + uintBytes;

    let out = 0;
    let allHighBits = true;
    for (let i = 0; i < uintBytes; i++) {
      out = out * 256 + cache[--cacheOffset];
      if (cache[cacheOffset] !== 0xff) {
        allHighBits = false;
      }
    }

    if (uintBytes === 8 && allHighBits && clipInfinity) {
      return Infinity;
    }

    return out;
  }

  getUintBigint(uintBytes: number, offsetBytes: number): bigint {
    if (uintBytes > 32 || uintBytes < 1) {
      throw new Error("uintBytes must be 1-8");
    }
    if (offsetBytes + uintBytes > 32 || offsetBytes < 0) {
      throw new Error("offsetBytes must be 0-32");
    }

    const {cache} = getCache(this.id);
    let cacheOffset = getCacheOffset(this.id) + offsetBytes + uintBytes;

    let out = BigInt(0);
    for (let i = 0; i < uintBytes; i++) {
      out = out * BIGINT_256 + BigInt(cache[--cacheOffset]);
    }

    return out;
  }

  setUint(uintBytes: number, offsetBytes: number, value: number, clipInfinity?: boolean): void {
    if (uintBytes > 8 || uintBytes < 1) {
      throw new Error("uintBytes must be 1-8");
    }
    if (offsetBytes + uintBytes > 32 || offsetBytes < 0) {
      throw new Error("offsetBytes must be 0-32");
    }
    if (value < 0) {
      throw new Error("value must be positive");
    }

    const {cache} = getCache(this.id);
    let cacheOffset = getCacheOffset(this.id) + offsetBytes;

    if (uintBytes === 8 && value === Infinity && clipInfinity) {
      for (let i = 0; i < uintBytes; i++) {
        cache[cacheOffset++] = 0xff;
        value = Math.floor(value / 256);
      }
    } else {
      for (let i = 0; i < uintBytes; i++) {
        cache[cacheOffset++] = value & 0xff;
        value = Math.floor(value / 256);
      }
    }
  }

  setUintBigint(uintBytes: number, offsetBytes: number, valueBN: bigint): void {
    if (uintBytes > 32 || uintBytes < 1) {
      throw new Error("uintBytes must be 1-8");
    }
    if (offsetBytes + uintBytes > 32 || offsetBytes < 0) {
      throw new Error("offsetBytes must be 0-32");
    }
    if (valueBN < 0) {
      throw new Error("value must be positive");
    }

    const {cache} = getCache(this.id);
    let cacheOffset = getCacheOffset(this.id) + offsetBytes;

    for (let i = 0; i < uintBytes; i++) {
      cache[cacheOffset++] = Number(valueBN & BIGINT_0xFF);
      valueBN /= BIGINT_256;
    }
  }

  bitwiseOrUint(uintBytes: number, offsetBytes: number, value: number): void {
    if (uintBytes > 8 || uintBytes < 1) {
      throw new Error("uintBytes must be 1-8");
    }
    if (offsetBytes + uintBytes > 32 || offsetBytes < 0) {
      throw new Error("offsetBytes must be 0-32");
    }
    if (value < 0) {
      throw new Error("value must be positive");
    }

    const {cache} = getCache(this.id);
    let cacheOffset = getCacheOffset(this.id) + offsetBytes;

    for (let i = 0; i < uintBytes; i++) {
      cache[cacheOffset++] |= value & 0xff;
      value = Math.floor(value / 2);
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
