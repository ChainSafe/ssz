# Persistent Merkle Tree

A binary merkle tree implemented as a [persistent data structure](https://en.wikipedia.org/wiki/Persistent_data_structure).

## Motivation

When dealing with large datasets, it is very expensive to merkleize them in their entirety. In cases where large datasets are remerkleized often between updates and additions, using ephemeral structures for intermediate hashes results in significant duplicated work, as many intermediate hashes will be recomputed and thrown away on each merkleization.  In these cases, maintaining structures for the entire tree, intermediate nodes included, can mitigate these issues and allow for additional usecases (eg: proof generation). This implementation also uses the known immutability of nodes to share data between common subtrees across different versions of the data.

## Features

#### Intermediate nodes with cached, lazily computed hashes

The tree is represented as a linked tree of `Node`s, currently either `BranchNode`s or `LeafNode`s.
A `BranchNode` has a `left` and `right` child `Node`, and a `root`, 32 byte `Uint8Array`.
A `LeafNode has a `root`.
The `root` of a `Node` is not computed until requested, and cached thereafter.

#### Shared data betwen common subtrees

Any updates to a tree (either to the leaves or intermediate nodes) are performed as rebindings that yield a new, updated tree that maximally shares data between versions. Garbage collection allows unused nodes to be discarded eventually.

## License

Apache-2.0
