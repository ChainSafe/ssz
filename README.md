# Persistent Merkle Tree

A binary merkle tree implemented as a [persistent data structure](https://en.wikipedia.org/wiki/Persistent_data_structure).

## Example

```typescript

// LeafNode and BranchNode are used to build nodes in a tree
// Nodes may not be changed once initialized

import {LeafNode, BranchNode} from "@chainsafe/persistent-merkle-tree";

const leaf = new LeafNode(Uint8Array.from([...]));
const otherLeaf = new LeafNode(Uint8Array.from([...]));

const branch = new BranchNode(leaf, otherLeaf);

// The `root` property returns the merkle root of a Node

const r: Uint8Array = branch.root; // == hash(leaf.root, otherLeaf.root));

// The `isLeaf` method returns true if the Node is a LeafNode

branch.isLeaf() === false;
leaf.isLeaf() === true;

// Well-known zero nodes are provided

import {zeroNode} from "@chainsafe/persistent-merkle-tree";

// 0x0
const zero0 = zeroNode(0);

// hash(0, 0)
const zero1 = zeroNode(1);

// hash(hash(0, 0), hash(0, 0))
const zero1 = zeroNode(2);

// Tree provides a mutable wrapper around a "root" Node

import {Tree} from "@chainsafe/persistent-merkle-tree";

const tree = new Tree(zeroNode(10));

// `rootNode` property returns the root Node of a Tree

const rootNode: Node = tree.rootNode;

// `root` property returns the merkle root of a Tree

const rr: Uint8Array = tree.root;

// A Tree is navigated by Gindex

const gindex = BigInt(...);

const n: Node = tree.getNode(gindex); // the Node at gindex
const rrr: Uint8Array = tree.getRoot(gindex); // the Uint8Array root at gindex
const subtree: Tree = tree.getSubtree(gindex); // the Tree wrapping the Node at gindex

// A merkle proof for a gindex can be generated

const proof: Uint8Array[] = tree.getSingleProof(gindex);

```

## Motivation

When dealing with large datasets, it is very expensive to merkleize them in their entirety. In cases where large datasets are remerkleized often between updates and additions, using ephemeral structures for intermediate hashes results in significant duplicated work, as many intermediate hashes will be recomputed and thrown away on each merkleization.  In these cases, maintaining structures for the entire tree, intermediate nodes included, can mitigate these issues and allow for additional usecases (eg: proof generation). This implementation also uses the known immutability of nodes to share data between common subtrees across different versions of the data.

## Features

#### Intermediate nodes with cached, lazily computed hashes

The tree is represented as a linked tree of `Node`s, currently either `BranchNode`s or `LeafNode`s.
A `BranchNode` has a `left` and `right` child `Node`, and a `root`, 32 byte `Uint8Array`.
A `LeafNode` has a `root`.
The `root` of a `Node` is not computed until requested, and cached thereafter.

#### Shared data betwen common subtrees

Any update to a tree (either to a leaf or intermediate node) is performed as a rebinding that yields a new, updated tree that maximally shares data between versions. Garbage collection allows memory from unused nodes to be eventually reclaimed.

#### Mutable wrapper for the persistent core

A `Tree` object wraps `Node` and provides an API for tree navigation and transparent rebinding on updates.

## See also:

https://github.com/protolambda/remerkleable

## License

Apache-2.0
