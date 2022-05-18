# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.2.0](https://github.com/chainsafe/simpleserialize.com/compare/simpleserialize.com@0.1.0...simpleserialize.com@0.2.0) (2022-05-18)


* SSZ v2 (#223) ([9d167b7](https://github.com/chainsafe/simpleserialize.com/commit/9d167b703b1e974ee4943be15710aa9783183986)), closes [#223](https://github.com/chainsafe/simpleserialize.com/issues/223) [#227](https://github.com/chainsafe/simpleserialize.com/issues/227)


### BREAKING CHANGES

* complete refactor, see packages/ssz/README.md for details

Initial squashed v2 commit

Replace lodestarTypes

Update tests

Add Union and None types

Update spec tests

Remove old src and lodestar dependencies

Improve JSON parsing for tests

Load YAML with lodestar utils schema

Commit ArrayComposite before getAll

Re-write toJson fromJson test

Fix uint json conversions

Print tree in valid test if requested

Fix hashTreeRoot for ByteList

Add RENDER_ROOTS option

Fix typos

Use numerical sort in array commit

Fix value_serializedSizeArrayComposite

Pass ssz_generic tests

Allow to select tests to run in ssz_static

Fix container bytes offset

Rename fixedLen to fixedSize

Sort deserailization methods

Print json stringified in test

Review logic

Clean up tests

Define JSON casing at constructor time only

Add casing maps for merge types

Update casing in unit tests

Re-organize utils

Fix merge casing

FIx offset calculation

Pass all spec test pre-merge

Bump merge test

Extend timeout for mainnet tests

Pass all unit tests

Return defaultValue in simpleserialize random

Remove @chainsafe/lodestar-spec-test-util dependency

Copy yaml schema from lodestar-utils

Fix benchmark type issues

Skip createProof benchmark

Skip old benchmark without runner

Remove postinstall script

Re-add UintBigint optimization

Fix set_exitEpoch_and_hashTreeRoot benchmark

Add List of Number benchmark

Use DataViews for faster deserialization

Use DataViews for tree serialization too

Update workflows build after install

Update packedNode tests

Review Tree API

Validate length in ByteArrays

FIx benchmarks in persistent-merkle-tree

Simplify LeafNode constructor

Refactor subtreeFillToContents

Run struct <-> tree_backed benchmarks

Update test types

Fix Uint64 DataView benchmarks

Add benchmarks for full state serialization

Use consistent initialization in DataView

Optimize toView for ByteArray

Add clone method for safer ContainerTreeViewDU

Add documentation to all public methods

Update SSZ README

Simplify testTypes

Update persistent-merkle-tree README

Add unit test push x5

Fix heigh typo

Add note Supports index up to Number.MAX_SAFE_INTEGER.

Address PR comments





## [0.1.1](https://github.com/chainsafe/simpleserialize.com/compare/simpleserialize.com@0.1.0...simpleserialize.com@0.1.1) (2021-10-12)

**Note:** Version bump only for package simpleserialize.com
