import { hash } from "./hash";

const ERR_INVALID_TREE = "Invalid tree";
const ERR_NOT_IMPLEMENTED = "Not implemented";

export type Link = (n: Node) => Node;

export abstract class Node {
  get merkleRoot(): Uint8Array {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
}

export class BranchNode extends Node {
  public root: Uint8Array | null = null;
  constructor(
    public left: Node | null = null,
    public right: Node | null = null
  ) {
    super();
    if ((!left && right) || (left && !right))
      throw new Error(ERR_INVALID_TREE);
  }
  get merkleRoot(): Uint8Array {
    if (!this.root) {
      if (!this.left || !this.right) {
        throw new Error(ERR_INVALID_TREE);
      }
      this.root = hash(this.left.merkleRoot, this.right.merkleRoot);
    }
    return this.root;
  }
  rebindLeft(n: Node): Node {
    return new BranchNode(n, this.right);
  }
  rebindRight(n: Node): Node {
    return new BranchNode(this.left, n);
  }
}

export class LeafNode extends Node {
  constructor(
    public root: Uint8Array
  ) {
    super();
  }
  get merkleRoot(): Uint8Array {
    return this.root;
  }
}

export function identity(n: Node): Node {
  return n;
}

export function compose(inner: Link, outer: Link): Link {
  return function(n: Node): Node {
    return outer(inner(n));
  }
}
