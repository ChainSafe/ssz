import { hash } from "./hash";
import {Gindex, pivot, anchor, subIndex, gindexDepth} from "./gindex";

const ERR_INVALID_TREE = "Invalid tree";
const ERR_INVALID_GINDEX = "Invalid gindex";
const ERR_NOT_IMPLEMENTED = "Not implemented";
const ERR_NAVIGATION = "Navigation error";
const ERR_TOO_MANY_NODES = "Too many nodes";

export type Link = (n: Node) => Node;

export abstract class Node {
  get merkleRoot(): Buffer {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
  get(target: Gindex): Node {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
  setter(target: Gindex): Link {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
  expandInto(target: Gindex): Link {
    throw new Error(ERR_NOT_IMPLEMENTED);
  }
}

export class BranchNode extends Node {
  public root: Buffer | null = null;
  constructor(
    public left: Node | null = null,
    public right: Node | null = null
  ) {
    super();
    if ((!left && right) || (left && !right))
      throw new Error(ERR_INVALID_TREE);
  }
  get merkleRoot(): Buffer {
    if (!this.root) {
      if (!this.left || !this.right) {
        throw new Error(ERR_INVALID_TREE);
      }
      this.root = hash(this.left.merkleRoot, this.right.merkleRoot);
    }
    return this.root;
  }
  get(target: Gindex): Node {
    if (target < 1) {
      throw new Error(ERR_INVALID_GINDEX);
    } else if (target === 1n) {
      return this;
    } else if (target === 2n) {
      if (!this.left) throw new Error(ERR_INVALID_TREE);
      return this.left;
    } else if (target === 3n) {
      if (!this.right) throw new Error(ERR_INVALID_TREE);
      return this.right;
    } else {
      const _pivot = pivot(target);
      const _anchor = anchor(target);
      const nextTarget = target ^ _anchor | _pivot;
      if (target < (target | _pivot)) {
        if (!this.left) throw new Error(ERR_INVALID_TREE);
        return this.left.get(nextTarget);
      } else {
        if (!this.right) throw new Error(ERR_INVALID_TREE);
        return this.right.get(nextTarget);
      }
    }
  }
  set(target: Gindex, n: Node): Node {
    return this.setter(target)(n);
  }

  rebindLeftChild(n: Node): Node {
    return new BranchNode(n, this.right);
  }
  rebindRightChild(n: Node): Node {
    return new BranchNode(this.left, n);
  }
  setter(target: Gindex): Link {
    if (target < 1) {
      throw new Error(ERR_INVALID_GINDEX);
    } else if (target === 1n) {
      return identity;
    } else if (target === 2n) {
      return this.rebindLeftChild.bind(this);
    } else if (target === 3n) {
      return this.rebindRightChild.bind(this);
    } else {
      const _pivot = pivot(target);
      const _anchor = anchor(target);
      const nextTarget = target ^ _anchor | _pivot;
      if (target < (target | _pivot)) {
        if (!this.left) throw new Error(ERR_INVALID_TREE);
        return compose(this.left.setter(nextTarget), this.rebindLeftChild.bind(this));
      } else {
        if (!this.right) throw new Error(ERR_INVALID_TREE);
        return compose(this.right.setter(nextTarget), this.rebindRightChild.bind(this));
      }
    }
  }
  expandInto(target: Gindex): Link {
    return this.setter(target);
  }
}

export class LeafNode extends Node {
  constructor(
    public root: Buffer
  ) {
    super();
  }
  get merkleRoot(): Buffer {
    return this.root;
  }
  get(target: Gindex): Node {
    if (target != 1n) {
      throw new Error(ERR_NAVIGATION);
    }
    return this;
  }
  setter(target: Gindex): Link {
    if (target != 1n) {
      throw new Error(ERR_NAVIGATION);
    }
    return identity;
  }
  expandInto(target: Gindex): Link {
    if (target < 1) {
      throw new Error(ERR_NAVIGATION);
    } else if (target === 1n) {
      return identity;
    } else {
      const childTargetIndex = subIndex(target);
      const child = zeroNode(gindexDepth(childTargetIndex));
      return (new BranchNode(child, child)).expandInto(childTargetIndex);
    }
  }
}

function identity(n: Node): Node {
  return n;
}

function compose(inner: Link, outer: Link): Link {
  return function(n: Node): Node {
    return outer(inner(n));
  }
}

// zeroes

// zeros singleton state
let zeroes: Node[] = [new LeafNode(Buffer.alloc(32))];

export function zeroNode(depth: number): Node {
  if (depth >= zeroes.length) {
    for (let i = zeroes.length; i <= depth; i++) {
      zeroes[i] = new BranchNode(zeroes[i-1], zeroes[i-1]);
    }
  }
  return zeroes[depth];
}

// subtree filling

export function subtreeFillToDepth(bottom: Node, depth: number): Node {
  let node = bottom;
  while (depth > 0) {
    node = new BranchNode(node, node);
    depth--;
  }
  return node;
}

export function subtreeFillToLength(bottom: Node, depth: number, length: number): Node {
  const maxLength = 1 << depth;
  if (length > maxLength) throw new Error(ERR_TOO_MANY_NODES);
  else if (length === maxLength) return subtreeFillToDepth(bottom, depth);
  else if (depth === 0) {
    if (length === 1) return bottom;
    else throw new Error(ERR_NAVIGATION);
  } else if (depth === 1) {
    return new BranchNode(bottom, (length > 1) ? bottom : zeroNode(0));
  } else {
    const pivot = maxLength >> 1;
    if (length <= pivot) {
      return new BranchNode(subtreeFillToLength(bottom, depth - 1, length), zeroNode(depth));
    } else {
      return new BranchNode(
        subtreeFillToDepth(bottom, depth - 1),
        subtreeFillToLength(bottom, depth - 1, length - pivot)
      );
    }
  }
}

export function subtreeFillToContents(nodes: Node[], depth: number): Node {
  const maxLength = 1 << depth;
  if (nodes.length > maxLength) throw new Error(ERR_TOO_MANY_NODES);
  else if (depth === 0) {
    if (nodes.length === 1) return nodes[0];
    else throw new Error(ERR_NAVIGATION);
  } else if (depth === 1) {
    return new BranchNode(nodes[0], (nodes.length > 1) ? nodes[1] : zeroNode(0));
  } else {
    const pivot = maxLength >> 1;
    if (nodes.length <= pivot) {
      return new BranchNode(subtreeFillToContents(nodes, depth - 1), zeroNode(depth));
    } else {
      return new BranchNode(
        subtreeFillToContents(nodes.slice(0, Number(pivot)), depth - 1),
        subtreeFillToContents(nodes.slice(Number(pivot)), depth - 1),
      );
    }
  }
}
