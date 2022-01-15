import {Gindex, GindexBitstring, convertGindexToBitstring} from "./gindex";
import {Node, LeafNode, BranchNode} from "./node";
import {createNodeFromProof, createProof, Proof, ProofInput} from "./proof";
import {createSingleProof} from "./proof/single";

export type Hook = (newRootNode: Node) => void;

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

  static createFromProof(proof: Proof): Tree {
    return new Tree(createNodeFromProof(proof));
  }

  get rootNode(): Node {
    return this._rootNode;
  }

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

  get root(): Uint8Array {
    return this.rootNode.root;
  }

  clone(): Tree {
    return new Tree(this.rootNode);
  }

  getSubtree(index: Gindex | GindexBitstring): Tree {
    return new Tree(this.getNode(index), (node) => this.setNode(index, node));
  }

  getNode(gindex: Gindex | GindexBitstring): Node {
    const gindexBitstring = convertGindexToBitstring(gindex);

    let node = this.rootNode;
    for (let i = 1; i < gindexBitstring.length; i++) {
      if (node.isLeaf()) {
        throw new Error(`Invalid tree - found leaf at depth ${i}`);
      }

      // If bit is set, means navigate right
      node = gindexBitstring[i] === "1" ? node.right : node.left;
    }
    return node;
  }

  getNodeAtDepth(depth: number, index: number): Node {
    return getNodeAtDepth(this.rootNode, depth, index);
  }

  getRoot(index: Gindex | GindexBitstring): Uint8Array {
    return this.getNode(index).root;
  }

  setNode(gindex: Gindex | GindexBitstring, n: Node): void {
    // Pre-compute entire bitstring instead of using an iterator (25% faster)
    const gindexBitstring = convertGindexToBitstring(gindex);
    const parentNodes = this.getParentNodes(gindexBitstring);
    this.rebindNodeToRoot(gindexBitstring, parentNodes, n);
  }

  /**
   * Traverse from root node to node, get hash object, then apply the function to get new node
   * and set the new node. This is a convenient method to avoid traversing the tree 2 times to
   * get and set.
   */
  setNodeWithFn(gindex: Gindex | GindexBitstring, getNewNode: (node: Node) => Node): void {
    // Pre-compute entire bitstring instead of using an iterator (25% faster)
    const gindexBitstring = convertGindexToBitstring(gindex);
    const parentNodes = this.getParentNodes(gindexBitstring);
    const lastParentNode = parentNodes[parentNodes.length - 1];
    const lastBit = gindexBitstring[gindexBitstring.length - 1];
    const oldNode = lastBit === "1" ? lastParentNode.right : lastParentNode.left;
    const newNode = getNewNode(oldNode);
    this.rebindNodeToRoot(gindexBitstring, parentNodes, newNode);
  }

  setNodeAtDepth(depth: number, index: number, node: Node): void {
    this.rootNode = setNodeAtDepth(this.rootNode, depth, index, node);
  }

  setRoot(index: Gindex | GindexBitstring, root: Uint8Array): void {
    this.setNode(index, LeafNode.fromRoot(root));
  }

  /**
   * Fast read-only iteration
   * In-order traversal of nodes at `depth`
   * starting from the `startIndex`-indexed node
   * iterating through `count` nodes
   */
  getNodesAtDepth(depth: number, startIndex: number, count: number): Node[] {
    return getNodesAtDepth(this.rootNode, depth, startIndex, count);
  }

  /**
   * Fast read-only iteration
   * In-order traversal of nodes at `depth`
   * starting from the `startIndex`-indexed node
   * iterating through `count` nodes
   */
  iterateNodesAtDepth(depth: number, startIndex: number, count: number): IterableIterator<Node> {
    return iterateNodesAtDepth(this.rootNode, depth, startIndex, count);
  }

  getSingleProof(index: Gindex): Uint8Array[] {
    return createSingleProof(this.rootNode, index)[1];
  }

  getProof(input: ProofInput): Proof {
    return createProof(this.rootNode, input);
  }

  /**
   * Traverse the tree from root node, ignore the last bit to get all parent nodes
   * of the specified bitstring.
   */
  private getParentNodes(bitstring: GindexBitstring): Node[] {
    let node = this.rootNode;

    // Keep a list of all parent nodes of node at gindex `index`. Then walk the list
    // backwards to rebind them "recursively" with the new nodes without using functions
    const parentNodes: Node[] = [this.rootNode];

    // Ignore the first bit, left right directions are at bits [1,..]
    // Ignore the last bit, no need to push the target node to the parentNodes array
    for (let i = 1; i < bitstring.length - 1; i++) {
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

export function getNodeAtDepth(rootNode: Node, depth: number, index: number): Node {
  if (depth === 0) {
    return rootNode;
  }
  if (depth === 1) {
    return index === 0 ? rootNode.left : rootNode.right;
  }

  // Ignore first bit "1", then substract 1 to get to the parent
  const depthiRoot = depth - 1;
  const depthiParent = 0;
  let node = rootNode;

  for (let d = depthiRoot; d >= depthiParent; d--) {
    node = isLeftNode(d, index) ? node.left : node.right;
  }

  return node;
}

/**
 * TODO: OPTIMIZE (if necessary)
 */
export function setNodeAtDepth(rootNode: Node, nodesDepth: number, index: number, nodeChanged: Node): Node {
  return setNodesAtDepth(rootNode, nodesDepth, [index], [nodeChanged]);
}

/**
 * Set multiple nodes in batch, editing and traversing nodes strictly once.
 *
 * - gindexes MUST be sorted in ascending order beforehand.
 * - All gindexes must be at the exact same depth.
 * - Depth must be > 0, if 0 just replace the root node.
 *
 * Strategy: for each gindex in `gindexes` navigate to the depth of its parent,
 * and create a new parent. Then calculate the closest common depth with the next
 * gindex and navigate upwards creating or caching nodes as necessary. Loop and repeat.
 */
export function setNodesAtDepth(rootNode: Node, nodesDepth: number, indexes: number[], nodes: Node[]): Node {
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

  // If depth is 0 there's only one node max and the optimization below will cause a navigation error.
  // For this case, check if there's a new root node and return it, otherwise the current rootNode.
  if (nodesDepth === 0) {
    return nodes.length > 0 ? nodes[0] : rootNode;
  }

  /**
   * Contiguous filled stack of parent nodes. It get filled in the first descent
   * Indexed by depthi
   */
  const parentNodeStack: Node[] = [];

  /**
   * Temp stack of left parent nodes, index by depthi.
   * Node leftParentNodeStack[depthi] is a node at d = depthi - 1, such that:
   * ```
   * parentNodeStack[depthi].left = leftParentNodeStack[depthi]
   * ```
   */
  const leftParentNodeStack: (Node | undefined)[] = [];

  // Ignore first bit "1", then substract 1 to get to the parent
  const depthiRoot = nodesDepth - 1;
  const depthiParent = 0;
  let depthi = depthiRoot;
  let node = rootNode;

  // Insert root node to make the loop below general
  parentNodeStack[depthiRoot] = rootNode;

  // TODO: Iterate to depth 32 to allow using bit ops
  // for (; depthi >= 32; depthi--) {
  //   node = node.left;
  // }

  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i];

    // Navigate down until parent depth, and store the chain of nodes
    //
    // Starts from latest common depth, so node is the parent node at `depthi`
    // When persisting the next node, store at the `d - 1` since its the child of node at `depthi`
    //
    // Stops at the level above depthiParent. For the re-binding routing below node must be at depthiParent
    for (let d = depthi; d > depthiParent; d--) {
      node = isLeftNode(d, index) ? node.left : node.right;
      parentNodeStack[d - 1] = node;
    }

    depthi = depthiParent;

    // If this is the left node, check first it the next node is on the right
    //
    //   -    If both nodes exist, create new
    //  / \
    // x   x
    //
    //   -    If only the left node exists, rebindLeft
    //  / \
    // x   -
    //
    //   -    If this is the right node, only the right node exists, rebindRight
    //  / \
    // -   x

    // d = 0, mask = 1 << d = 1
    const isLeftLeafNode = (index & 1) !== 1;
    if (isLeftLeafNode) {
      // Next node is the very next to the right of current node
      if (index + 1 === indexes[i + 1]) {
        node = new BranchNode(nodes[i], nodes[i + 1]);
        // Move pointer one extra forward since node has consumed two nodes
        i++;
      } else {
        node = new BranchNode(nodes[i], node.right);
      }
    } else {
      node = new BranchNode(node.left, nodes[i]);
    }

    // Here `node` is the new BranchNode at depthi `depthiParent`

    // Now climb upwards until finding the common node with the next index
    // For the last iteration, climb to the root at `depthiRoot`
    const isLastIndex = i >= indexes.length - 1;
    const diffDepthi = isLastIndex ? depthiRoot : findDiffDepthi(index, indexes[i + 1]);

    // When climbing up from a left node there are two possible paths
    // 1. Go to the right of the parent: Store left node to rebind latter
    // 2. Go another level up: Will never visit the left node again, so must rebind now

    // 🡼 \     Rebind left only, will never visit this node again
    // 🡽 /\
    //
    //    / 🡽  Rebind left only (same as above)
    // 🡽 /\
    //
    // 🡽 /\ 🡾  Store left node to rebind the entire node when returning
    //
    // 🡼 \     Rebind right with left if exists, will never visit this node again
    //   /\ 🡼
    //
    //    / 🡽  Rebind right with left if exists (same as above)
    //   /\ 🡼

    for (let d = depthiParent + 1; d <= diffDepthi; d++) {
      // If node is on the left, store for latter
      // If node is on the right merge with stored left node
      if (isLeftNode(d, index)) {
        if (isLastIndex || d !== diffDepthi) {
          // If it's last index, bind with parent since it won't navigate to the right anymore
          // Also, if still has to move upwards, rebind since the node won't be visited anymore
          node = new BranchNode(node, parentNodeStack[d].right);
        } else {
          // Only store the left node if it's at d = diffDepth
          leftParentNodeStack[d] = node;
          node = parentNodeStack[d];
        }
      } else {
        const leftNode = leftParentNodeStack[d];

        if (leftNode !== undefined) {
          node = new BranchNode(leftNode, node);
          leftParentNodeStack[d] = undefined;
        } else {
          node = new BranchNode(parentNodeStack[d].left, node);
        }
      }
    }

    // Prepare next loop
    // Go to the parent of the depth with diff, to switch branches to the right
    depthi = diffDepthi;
  }

  // Done, return new root node
  return node;
}

/**
 * Fast read-only iteration
 * In-order traversal of nodes at `depth`
 * starting from the `startIndex`-indexed node
 * iterating through `count` nodes
 *
 * **Strategy**
 * 1. Navigate down to parentDepth storing a stack of parents
 * 2. At target level push current node
 * 3. Go up to the first level that navigated left
 * 4. Repeat (1) for next index
 */
export function getNodesAtDepth(rootNode: Node, depth: number, startIndex: number, count: number): Node[] {
  // Optimized paths for short trees (x20 times faster)
  if (depth === 0) {
    return startIndex === 0 && count > 0 ? [rootNode] : [];
  } else if (depth === 1) {
    if (count === 0) {
      return [];
    } else if (count === 1) {
      return startIndex === 0 ? [rootNode.left] : [rootNode.right];
    } else {
      return [rootNode.left, rootNode.right];
    }
  }

  const nodes: Node[] = [];
  const endIndex = startIndex + count;

  // Ignore first bit "1", then substract 1 to get to the parent
  const depthiRoot = depth - 1;
  const depthiParent = 0;
  let depthi = depthiRoot;
  let node = rootNode;

  // Contiguous filled stack of parent nodes. It get filled in the first descent
  // Indexed by depthi
  const parentNodeStack: Node[] = [];
  const isLeftStack: boolean[] = [];

  // Insert root node to make the loop below general
  parentNodeStack[depthiRoot] = rootNode;

  for (let index = startIndex; index < endIndex; index++) {
    for (let d = depthi; d >= depthiParent; d--) {
      if (d !== depthi) {
        parentNodeStack[d] = node;
      }

      const isLeft = isLeftNode(d, index);
      isLeftStack[d] = isLeft;
      node = isLeft ? node.left : node.right;
    }

    nodes.push(node);

    // Find the first depth where navigation when left.
    // Store that heigh and go right from there
    for (let d = depthiParent; d <= depthiRoot; d++) {
      if (isLeftStack[d] === true) {
        depthi = d;
        break;
      }
    }

    node = parentNodeStack[depthi];
  }

  return nodes;
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
  const endIndex = startIndex + count;

  // Ignore first bit "1", then substract 1 to get to the parent
  const depthiRoot = depth - 1;
  const depthiParent = 0;
  let depthi = depthiRoot;
  let node = rootNode;

  // Contiguous filled stack of parent nodes. It get filled in the first descent
  // Indexed by depthi
  const parentNodeStack: Node[] = [];
  const isLeftStack: boolean[] = [];

  // Insert root node to make the loop below general
  parentNodeStack[depthiRoot] = rootNode;

  for (let index = startIndex; index < endIndex; index++) {
    for (let d = depthi; d >= depthiParent; d--) {
      if (d !== depthi) {
        parentNodeStack[d] = node;
      }

      const isLeft = isLeftNode(d, index);
      isLeftStack[d] = isLeft;
      node = isLeft ? node.left : node.right;
    }

    yield node;

    // Find the first depth where navigation when left.
    // Store that heigh and go right from there
    for (let d = depthiParent; d <= depthiRoot; d++) {
      if (isLeftStack[d] === true) {
        depthi = d;
        break;
      }
    }

    node = parentNodeStack[depthi];
  }
}

/**
 * Supports index up to Number.MAX_SAFE_INTEGER.
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

/**
 * depth depthi   gindexes   indexes
 * 0     1           1          0
 * 1     0         2   3      0   1
 * 2     -        4 5 6 7    0 1 2 3
 *
 * **Conditions**:
 * - `from` and `to` must not be equal
 *
 * @param from Index
 * @param to Index
 */
function findDiffDepthi(from: number, to: number): number {
  // (0,0) -> 0 | (0,1) -> 1 | (0,2) -> 2
  const heighFromLeafs = Math.ceil(Math.log2(-~(from ^ to)));
  // Must offset by one to match the depthi scale
  return heighFromLeafs - 1;
}
