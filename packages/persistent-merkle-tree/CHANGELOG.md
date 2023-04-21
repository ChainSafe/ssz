# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.1](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.6.0...persistent-merkle-tree-v0.6.1) (2023-04-21)


### Bug Fixes

* Use file path imports ([#318](https://github.com/ChainSafe/ssz/issues/318)) ([f459e92](https://github.com/ChainSafe/ssz/commit/f459e92fbafc5d9388bfa630291855ec32a09566))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped to 0.4.1

## [0.6.0](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.5.0...persistent-merkle-tree-v0.6.0) (2023-04-05)


### Features

* add swappable hasher, default to noble-hashes ([#314](https://github.com/ChainSafe/ssz/issues/314)) ([4b44614](https://github.com/ChainSafe/ssz/commit/4b44614003619b2c5477363a3c85287e2f2987bd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped to 0.4.0

## [0.5.0](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.4.2...persistent-merkle-tree-v0.5.0) (2023-01-24)


### Features

* compact multiproof ([#292](https://github.com/ChainSafe/ssz/issues/292)) ([5f1ea99](https://github.com/ChainSafe/ssz/commit/5f1ea9914d0796cf0c9a8c2f9622fc5e459a12f2))

## [0.4.2](https://github.com/ChainSafe/persistent-merkle-tree/compare/@chainsafe/persistent-merkle-tree@0.4.1...@chainsafe/persistent-merkle-tree@0.4.2) (2022-05-31)

* Fix treeZeroAfterIndex for negative index (#268)

## [0.4.1](https://github.com/ChainSafe/persistent-merkle-tree/compare/@chainsafe/persistent-merkle-tree@0.4.0...@chainsafe/persistent-merkle-tree@0.4.1) (2022-04-14)

* Remove unused files (#248)
* Bump minimist from 0.0.8 to 0.0.10 (#192)

# [0.4.0](https://github.com/ChainSafe/persistent-merkle-tree/compare/@chainsafe/persistent-merkle-tree@0.3.7...@chainsafe/persistent-merkle-tree@0.4.0) (2022-03-24)


* SSZ v2 (#223) ([9d167b7](https://github.com/ChainSafe/persistent-merkle-tree/commit/9d167b703b1e974ee4943be15710aa9783183986)), closes [#223](https://github.com/ChainSafe/persistent-merkle-tree/issues/223) [#227](https://github.com/ChainSafe/persistent-merkle-tree/issues/227)
* Convert as-sha256 to typescript (#244) ([2d4e3fe](https://github.com/ChainSafe/persistent-merkle-tree/commit/2d4e3febec89ca8ca7c89a19c6949c3213c2c45c)), closes [#244](https://github.com/ChainSafe/persistent-merkle-tree/issues/244)


### BREAKING CHANGES

* complete refactor, see packages/ssz/README.md for details
* export digest* functions as named exports

## 0.3.7 (2021-08-26)

- Support setHashObjectFn ([35bad6](https://github.com/chainsafe/persistent-merkle-tree/commit/35bad6))

## 0.3.2 (2021-06-17)

## Chores

- Use singleton uint8array for hash ([219e3a](https://github.com/chainsafe/persistent-merkle-tree/commit/219e3a))

## 0.3.2 (2021-05-06)

## Chores

- Update as-sha256 ([116029](https://github.com/chainsafe/persistent-merkle-tree/commit/116029))

## 0.3.1 (2021-05-04)

## Features

- Use digest64 instead of digest to hash merkle nodes ([eeea76](https://github.com/chainsafe/persistent-merkle-tree/commit/eeea76))

## 0.3.0 (2021-03-26)

## BREAKING CHANGES

- Use WeakRef on tree hook ([dd23ed](https://github.com/chainsafe/persistent-merkle-tree/commit/dd23ed))

## Features

- Add proof serialization logic  ([44ec21](https://github.com/chainsafe/persistent-merkle-tree/commit/44ec21))

## Bug Fixes

- Fix off-by-one in iterateAtDepth ([84e05e](https://github.com/chainsafe/persistent-merkle-tree/commit/84e05e))

## 0.2.3 (2021-02-13)

## Features

- Add tree-offset multiproof code ([a35181](https://github.com/chainsafe/persistent-merkle-tree/commit/a35181))

## 0.2.2 (2021-02-11)

## Features

- Add concatGindices ([bb74df](https://github.com/chainsafe/persistent-merkle-tree/commit/bb74df))

## 0.2.1 (2020-07-32)

## Bug Fixes

- Fix subtreeFillToContents edge cases ([8a2012](https://github.com/chainsafe/persistent-merkle-tree/commit/8a2012))

## 0.2.0 (2020-07-27)

## Features

- Add iterateNodestDepth ([24ca18](https://github.com/chainsafe/persistent-merkle-tree/commit/24ca18))

## BREAKING CHANGES

- Rearrange params, depth first where appropriate ([24ca18](https://github.com/chainsafe/persistent-merkle-tree/commit/24ca18))

## 0.1.3 (2020-06-07)

### Chores

- remove bigint literals ([461fb7](https://github.com/chainsafe/persistent-merkle-tree/commit/461fb7))

## 0.1.2 (2020-02-26)

### Chores

- use @chainsafe/as-sha256 sha2 implementation ([b9bcfe](https://github.com/chainsafe/persistent-merkle-tree/commit/b9bcfe))
