import {
  getNode as _getNode,
  setNode as _setNode,
  setNodeWithFn as _setNodeWithFn,
  setNodesAtDepth,
  getNodeAtDepth,
  getNodesAtDepth,
  zeroNode,
} from "hash-object";
import {Gindex, GindexBitstring, convertGindexToBitstring} from "./gindex";
import {Node} from "./node";
import {createNodeFromProof, createProof, Proof, ProofInput} from "./proof";
import {createSingleProof} from "./proof/single";

export type Hook = (newRootNode: Node) => void;

/**
 * Binary merkle tree
 *
 * Wrapper around immutable `Node` to support mutability.
 *
 * Mutability between a parent tree and subtree is achieved by maintaining a `hook` callback, which updates the parent when the subtree is updated.
 */
export class Tree {
  private _rootNode: Node;
  private hook?: Hook | WeakRef<Hook>;

  constructor(node: Node, hook?: Hook) {
    this._rootNode = node;
    if (hook) {
      if (typeof WeakRef === "undefined") {
        this.hook = hook;
      } else {
        this.hook = new WeakRef(hook);
      }
    }
  }

  /**
   * Create a `Tree` from a `Proof` object
   */
  static createFromProof(proof: Proof): Tree {
    return new Tree(createNodeFromProof(proof));
  }

  /**
   * The root node of the tree
   */
  get rootNode(): Node {
    return this._rootNode;
  }

  /**
   *
   * Setting the root node will trigger a call to the tree's `hook` if it exists.
   */
  set rootNode(newRootNode: Node) {
    this._rootNode = newRootNode;
    if (this.hook) {
      // WeakRef should not change status during a program's execution
      // So, use WeakRef feature detection to assume the type of this.hook
      // to minimize the memory footprint of Tree
      if (typeof WeakRef === "undefined") {
        (this.hook as Hook)(newRootNode);
      } else {
        const hookVar = (this.hook as WeakRef<Hook>).deref();
        if (hookVar) {
          hookVar(newRootNode);
        } else {
          // Hook has been garbage collected, no need to keep the hookRef
          this.hook = undefined;
        }
      }
    }
  }

  /**
   * The root hash of the tree
   */
  get root(): Uint8Array {
    return this.rootNode.root;
  }

  /**
   * Return a copy of the tree
   */
  clone(): Tree {
    return new Tree(this.rootNode);
  }

  /**
   * Return the subtree at the specified gindex.
   *
   * Note: The returned subtree will have a `hook` attached to the parent tree.
   * Updates to the subtree will result in updates to the parent.
   */
  getSubtree(index: Gindex | GindexBitstring): Tree {
    return new Tree(this.getNode(index), (node) => this.setNode(index, node));
  }

  /**
   * Return the node at the specified gindex.
   */
  getNode(gindex: Gindex | GindexBitstring): Node {
    return getNode(this.rootNode, gindex);
  }

  /**
   * Return the node at the specified depth and index.
   *
   * Supports index up to `Number.MAX_SAFE_INTEGER`.
   */
  getNodeAtDepth(depth: number, index: number): Node {
    return getNodeAtDepth(this.rootNode, depth, index);
  }

  /**
   * Return the hash at the specified gindex.
   */
  getRoot(index: Gindex | GindexBitstring): Uint8Array {
    return this.getNode(index).root;
  }

  /**
   * Set the node at at the specified gindex.
   */
  setNode(gindex: Gindex | GindexBitstring, n: Node): void {
    this.rootNode = setNode(this.rootNode, gindex, n);
  }

  /**
   * Traverse to the node at the specified gindex,
   * then apply the function to get a new node and set the node at the specified gindex with the result.
   *
   * This is a convenient method to avoid traversing the tree 2 times to
   * get and set.
   */
  setNodeWithFn(gindex: Gindex | GindexBitstring, getNewNode: (node: Node) => Node): void {
    this.rootNode = setNodeWithFn(this.rootNode, gindex, getNewNode);
  }

  /**
   * Set the node at the specified depth and index.
   *
   * Supports index up to `Number.MAX_SAFE_INTEGER`.
   */
  setNodeAtDepth(depth: number, index: number, node: Node): void {
    this.rootNode = setNodeAtDepth(this.rootNode, depth, index, node);
  }

  /**
   * Set the hash at the specified gindex.
   *
   * Note: This will set a new `LeafNode` at the specified gindex.
   */
  setRoot(index: Gindex | GindexBitstring, root: Uint8Array): void {
    this.setNode(index, Node.fromRoot(root));
  }

  /**
   * Fast read-only iteration
   * In-order traversal of nodes at `depth`
   * starting from the `startIndex`-indexed node
   * iterating through `count` nodes
   *
   * Supports index up to `Number.MAX_SAFE_INTEGER`.
   */
  getNodesAtDepth(depth: number, startIndex: number, count: number): Node[] {
    return getNodesAtDepth(this.rootNode, depth, startIndex, count);
  }

  /**
   * Fast read-only iteration
   * In-order traversal of nodes at `depth`
   * starting from the `startIndex`-indexed node
   * iterating through `count` nodes
   *
   * Supports index up to `Number.MAX_SAFE_INTEGER`.
   */
  iterateNodesAtDepth(depth: number, startIndex: number, count: number): IterableIterator<Node> {
    return iterateNodesAtDepth(this.rootNode, depth, startIndex, count);
  }

  /**
   * Return a merkle proof for the node at the specified gindex.
   */
  getSingleProof(index: Gindex): Uint8Array[] {
    return createSingleProof(this.rootNode, index)[1];
  }

  /**
   * Return a merkle proof for the proof input.
   *
   * This method can be used to create multiproofs.
   */
  getProof(input: ProofInput): Proof {
    return createProof(this.rootNode, input);
  }
}

export {getNodeAtDepth, getNodesAtDepth, setNodesAtDepth};

export function getNode(rootNode: Node, gindex: Gindex | GindexBitstring): Node {
  return _getNode(rootNode, convertGindexToBitstring(gindex));
}
export function setNode(rootNode: Node, gindex: Gindex | GindexBitstring, node: Node): Node {
  return _setNode(rootNode, convertGindexToBitstring(gindex), node);
}
export function setNodeWithFn(
  rootNode: Node,
  gindex: Gindex | GindexBitstring,
  getNewNode: (node: Node) => Node
): Node {
  return _setNodeWithFn(rootNode, convertGindexToBitstring(gindex), getNewNode);
}

/**
 * Supports index up to `Number.MAX_SAFE_INTEGER`.
 */
export function setNodeAtDepth(rootNode: Node, nodesDepth: number, index: number, nodeChanged: Node): Node {
  // TODO: OPTIMIZE (if necessary)
  return setNodesAtDepth(rootNode, nodesDepth, [index], [nodeChanged]);
}

/**
 * @see getNodesAtDepth but instead of pushing to an array, it yields
 */
export function* iterateNodesAtDepth(
  rootNode: Node,
  depth: number,
  startIndex: number,
  count: number
): IterableIterator<Node> {
  yield* getNodesAtDepth(rootNode, depth, startIndex, count);
}

/**
 * Zero's all nodes right of index with constant depth of `nodesDepth`.
 *
 * For example, zero-ing this tree at depth 2 after index 0
 * ```
 *    X              X
 *  X   X    ->    X   0
 * X X X X        X 0 0 0
 * ```
 *
 * Or, zero-ing this tree at depth 3 after index 2
 * ```
 *        X                     X
 *    X       X             X       0
 *  X   X   X   X    ->   X   X   0   0
 * X X X X X X X X       X X X 0 0 0 0 0
 * ```
 *
 * The strategy is to first navigate down to `nodesDepth` and `index` and keep a stack of parents.
 * Then navigate up re-binding:
 * - If navigated to the left rebind with zeroNode()
 * - If navigated to the right rebind with parent.left from the stack
 */
export function treeZeroAfterIndex(rootNode: Node, nodesDepth: number, index: number): Node {
  // depth depthi   gindexes   indexes
  // 0     1           1          0
  // 1     0         2   3      0   1
  // 2     -        4 5 6 7    0 1 2 3
  // '10' means, at depth 1, node is at the left
  //
  // For index N check if the bit at position depthi is set to navigate right at depthi
  // ```
  // mask = 1 << depthi
  // goRight = (N & mask) == mask
  // ```

  // Degenerate case where tree is zero after a negative index (-1).
  // All positive indexes are zero, so the entire tree is zero. Return cached zero node as root.
  if (index < 0) {
    return zeroNode(nodesDepth);
  }

  /**
   * Contiguous filled stack of parent nodes. It get filled in the first descent
   * Indexed by depthi
   */
  const parentNodeStack = new Array<Node>(nodesDepth);

  // Ignore first bit "1", then substract 1 to get to the parent
  const depthiRoot = nodesDepth - 1;
  const depthiParent = 0;
  let depthi = depthiRoot;
  let node = rootNode;

  // Insert root node to make the loop below general
  parentNodeStack[depthiRoot] = rootNode;

  // Navigate down until parent depth, and store the chain of nodes
  //
  // Stops at the depthiParent level. To rebind below down to `nodesDepth`
  for (let d = depthi; d >= depthiParent; d--) {
    node = isLeftNode(d, index) ? node.left : node.right;
    parentNodeStack[d - 1] = node;
  }

  depthi = depthiParent;

  // Now climb up re-binding with either zero of existing tree.

  for (let d = depthiParent; d <= depthiRoot; d++) {
    if (isLeftNode(d, index)) {
      // If navigated to the left, then all the child nodes of the right node are NOT part of the new tree.
      // So re-bind new `node` with a zeroNode at the current depth.
      node = Node.newBranchNode(node, zeroNode(d));
    } else {
      // If navigated to the right, then all the child nodes of the left node are part of the new tree.
      // So re-bind new `node` with the existing left node of the parent.
      node = Node.newBranchNode(parentNodeStack[d].left, node);
    }
  }

  // Done, return new root node
  return node;
}

/**
 * Returns true if the `index` at `depth` is a left node, false if it is a right node.
 *
 * Supports index up to `Number.MAX_SAFE_INTEGER`.
 * In Eth2 case the biggest tree's index is 2**40 (VALIDATOR_REGISTRY_LIMIT)
 */
function isLeftNode(depthi: number, index: number): boolean {
  if (depthi > 31) {
    // Javascript can only do bitwise ops with 32 bit numbers.
    // Shifting left 1 by 32 wraps around and becomes 1.
    // Get the high part of `index` and adjust depthi
    const indexHi = (index / 2 ** 32) >>> 0;
    const mask = 1 << (depthi - 32);
    return (indexHi & mask) !== mask;
  }

  const mask = 1 << depthi;
  return (index & mask) !== mask;
}
