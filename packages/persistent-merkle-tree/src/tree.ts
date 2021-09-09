import {Gindex, Bit, toGindexBitstring, GindexBitstring, convertGindexToBitstring} from "./gindex";
import {Node, LeafNode} from "./node";
import {HashObject} from "@chainsafe/as-sha256";
import {createNodeFromProof, createProof, Proof, ProofInput} from "./proof";
import {createSingleProof} from "./proof/single";
import {zeroNode} from "./zeroNode";

export type Hook = (v: Tree) => void;
export type HashObjectFn = (hashObject: HashObject) => HashObject;

const ERR_INVALID_TREE = "Invalid tree operation";
const ERR_PARAM_LT_ZERO = "Param must be >= 0";
const ERR_COUNT_GT_DEPTH = "Count extends beyond depth limit";

export class Tree {
  private _node: Node;
  private hook?: Hook | WeakRef<Hook>;

  constructor(node: Node, hook?: Hook) {
    this._node = node;
    if (hook) {
      if (typeof WeakRef === "undefined") {
        this.hook = hook;
      } else {
        this.hook = new WeakRef(hook);
      }
    }
  }

  static createFromProof(proof: Proof): Tree {
    return new Tree(createNodeFromProof(proof));
  }

  get rootNode(): Node {
    return this._node;
  }

  set rootNode(n: Node) {
    this._node = n;
    if (this.hook) {
      // WeakRef should not change status during a program's execution
      // So, use WeakRef feature detection to assume the type of this.hook
      // to minimize the memory footprint of Tree
      if (typeof WeakRef === "undefined") {
        (this.hook as Hook)(this);
      } else {
        const hookVar = (this.hook as WeakRef<Hook>).deref();
        if (hookVar) {
          hookVar(this);
        } else {
          // Hook has been garbage collected, no need to keep the hookRef
          this.hook = undefined;
        }
      }
    }
  }

  get root(): Uint8Array {
    return this.rootNode.root;
  }

  getNode(index: Gindex | GindexBitstring): Node {
    let node = this.rootNode;
    const bitstring = convertGindexToBitstring(index);
    for (let i = 1; i < bitstring.length; i++) {
      if (bitstring[i] === "1") {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        node = node.right;
      } else {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        node = node.left;
      }
    }
    return node;
  }

  setNode(gindex: Gindex | GindexBitstring, n: Node, expand = false): void {
    // Pre-compute entire bitstring instead of using an iterator (25% faster)
    let bitstring;
    if (typeof gindex === "string") {
      bitstring = gindex;
    } else {
      if (gindex < 1) {
        throw new Error("Invalid gindex < 1");
      }
      bitstring = gindex.toString(2);
    }
    const parentNodes = this.getParentNodes(bitstring, expand);
    this.rebindNodeToRoot(bitstring, parentNodes, n);
  }

  getRoot(index: Gindex | GindexBitstring): Uint8Array {
    return this.getNode(index).root;
  }

  getHashObject(index: Gindex | GindexBitstring): HashObject {
    return this.getNode(index);
  }

  setRoot(index: Gindex | GindexBitstring, root: Uint8Array, expand = false): void {
    this.setNode(index, new LeafNode(root), expand);
  }

  setHashObject(index: Gindex | GindexBitstring, hashObject: HashObject, expand = false): void {
    this.setNode(index, new LeafNode(hashObject), expand);
  }

  /**
   * Traverse from root node to node, get hash object, then apply the function to get new node
   * and set the new node. This is a convenient method to avoid traversing the tree 2 times to
   * get and set.
   */
  setHashObjectFn(gindex: Gindex | GindexBitstring, hashObjectFn: HashObjectFn, expand = false): void {
    // Pre-compute entire bitstring instead of using an iterator (25% faster)
    let bitstring;
    if (typeof gindex === "string") {
      bitstring = gindex;
    } else {
      if (gindex < 1) {
        throw new Error("Invalid gindex < 1");
      }
      bitstring = gindex.toString(2);
    }
    const parentNodes = this.getParentNodes(bitstring, expand);
    const lastParentNode = parentNodes[parentNodes.length - 1];
    const lastBit = bitstring[bitstring.length - 1];
    const oldNode = lastBit === "1" ? lastParentNode.right : lastParentNode.left;
    const newNode = new LeafNode(hashObjectFn(oldNode));
    this.rebindNodeToRoot(bitstring, parentNodes, newNode);
  }

  getSubtree(index: Gindex | GindexBitstring): Tree {
    return new Tree(this.getNode(index), (v: Tree): void => this.setNode(index, v.rootNode));
  }

  setSubtree(index: Gindex | GindexBitstring, v: Tree, expand = false): void {
    this.setNode(index, v.rootNode, expand);
  }

  clone(): Tree {
    return new Tree(this.rootNode);
  }

  getSingleProof(index: Gindex): Uint8Array[] {
    return createSingleProof(this.rootNode, index)[1];
  }

  /**
   * Fast read-only iteration
   * In-order traversal of nodes at `depth`
   * starting from the `startIndex`-indexed node
   * iterating through `count` nodes
   */
  *iterateNodesAtDepth(depth: number, startIndex: number, count: number): IterableIterator<Node> {
    // Strategy:
    // First nagivate to the starting Gindex node,
    // At each level record the tuple (current node, the navigation direction) in a list (Left=0, Right=1)
    // Once we reach the starting Gindex node, the list will be length == depth
    // Begin emitting nodes: Outer loop:
    //   Yield the current node
    //   Inner loop
    //     pop off the end of the list
    //     If its (N, Left) (we've nav'd the left subtree, but not the right subtree)
    //       push (N, Right) and set set node as the n.right
    //       push (N, Left) and set node as n.left until list length == depth
    //   Inner loop until the list length == depth
    // Outer loop until the list is empty or the yield count == count
    if (startIndex < 0 || count < 0 || depth < 0) {
      throw new Error(ERR_PARAM_LT_ZERO);
    }

    if (BigInt(1) << BigInt(depth) < startIndex + count) {
      throw new Error(ERR_COUNT_GT_DEPTH);
    }

    if (count === 0) {
      return;
    }

    if (depth === 0) {
      yield this.rootNode;
      return;
    }

    let node = this.rootNode;
    let currCount = 0;
    const startGindex = toGindexBitstring(depth, startIndex);
    const nav: [Node, Bit][] = [];
    for (let i = 1; i < startGindex.length; i++) {
      const bit = Number(startGindex[i]) as Bit;
      nav.push([node, bit]);
      if (bit) {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        node = node.right;
      } else {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        node = node.left;
      }
    }

    while (nav.length && currCount < count) {
      yield node;

      currCount++;
      if (currCount === count) {
        return;
      }

      do {
        const [parentNode, direction] = nav.pop()!;
        // if direction was left
        if (!direction) {
          // now navigate right
          nav.push([parentNode, 1]);
          if (parentNode.isLeaf()) throw new Error(ERR_INVALID_TREE);
          node = parentNode.right;

          // and then left as far as possible
          while (nav.length !== depth) {
            nav.push([node, 0]);
            if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
            node = node.left;
          }
        }
      } while (nav.length && nav.length !== depth);
    }
  }

  /**
   * Fast read-only iteration
   * In-order traversal of nodes at `depth`
   * starting from the `startIndex`-indexed node
   * iterating through `count` nodes
   */
  getNodesAtDepth(depth: number, startIndex: number, count: number): Node[] {
    // Strategy:
    // First nagivate to the starting Gindex node,
    // At each level record the tuple (current node, the navigation direction) in a list (Left=0, Right=1)
    // Once we reach the starting Gindex node, the list will be length == depth
    // Begin emitting nodes: Outer loop:
    //   Yield the current node
    //   Inner loop
    //     pop off the end of the list
    //     If its (N, Left) (we've nav'd the left subtree, but not the right subtree)
    //       push (N, Right) and set set node as the n.right
    //       push (N, Left) and set node as n.left until list length == depth
    //   Inner loop until the list length == depth
    // Outer loop until the list is empty or the yield count == count
    if (startIndex < 0 || count < 0 || depth < 0) {
      throw new Error(ERR_PARAM_LT_ZERO);
    }

    if (BigInt(1) << BigInt(depth) < startIndex + count) {
      throw new Error(ERR_COUNT_GT_DEPTH);
    }

    if (count === 0) {
      return [];
    }

    if (depth === 0) {
      return [this.rootNode];
    }

    const nodes: Node[] = [];

    let node = this.rootNode;
    let currCount = 0;
    const startGindex = toGindexBitstring(depth, startIndex);
    const nav: [Node, Bit][] = [];
    for (let i = 1; i < startGindex.length; i++) {
      const bit = Number(startGindex[i]) as Bit;
      nav.push([node, bit]);
      if (bit) {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        node = node.right;
      } else {
        if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
        node = node.left;
      }
    }

    while (nav.length && currCount < count) {
      nodes.push(node);

      currCount++;
      if (currCount === count) {
        break;
      }

      do {
        const [parentNode, direction] = nav.pop()!;
        // if direction was left
        if (!direction) {
          // now navigate right
          nav.push([parentNode, 1]);
          if (parentNode.isLeaf()) throw new Error(ERR_INVALID_TREE);
          node = parentNode.right;

          // and then left as far as possible
          while (nav.length !== depth) {
            nav.push([node, 0]);
            if (node.isLeaf()) throw new Error(ERR_INVALID_TREE);
            node = node.left;
          }
        }
      } while (nav.length && nav.length !== depth);
    }

    return nodes;
  }

  getProof(input: ProofInput): Proof {
    return createProof(this.rootNode, input);
  }

  /**
   * Traverse the tree from root node, ignore the last bit to get all parent nodes
   * of the specified bitstring.
   */
  private getParentNodes(bitstring: GindexBitstring, expand = false): Node[] {
    let node = this.rootNode;

    // Keep a list of all parent nodes of node at gindex `index`. Then walk the list
    // backwards to rebind them "recursively" with the new nodes without using functions
    const parentNodes: Node[] = [this.rootNode];

    // Ignore the first bit, left right directions are at bits [1,..]
    // Ignore the last bit, no need to push the target node to the parentNodes array
    for (let i = 1; i < bitstring.length - 1; i++) {
      if (node.isLeaf()) {
        if (!expand) {
          throw new Error(ERR_INVALID_TREE);
        } else {
          node = zeroNode(bitstring.length - i);
        }
      }

      // Compare to string directly to prevent unnecessary type conversions
      if (bitstring[i] === "1") {
        node = node.right;
      } else {
        node = node.left;
      }

      parentNodes.push(node);
    }

    return parentNodes;
  }

  /**
   * Build a new tree structure from bitstring, parentNodes and a new node.
   * Note: keep the same Tree, just mutate the root node.
   */
  private rebindNodeToRoot(bitstring: GindexBitstring, parentNodes: Node[], newNode: Node): void {
    let node = newNode;
    // Ignore the first bit, left right directions are at bits [1,..]
    // Iterate the list backwards including the last bit, but offset the parentNodes array
    // by one since the first bit in bitstring was ignored in the previous loop
    for (let i = bitstring.length - 1; i >= 1; i--) {
      if (bitstring[i] === "1") {
        node = parentNodes[i - 1].rebindRight(node);
      } else {
        node = parentNodes[i - 1].rebindLeft(node);
      }
    }

    this.rootNode = node;
  }
}
