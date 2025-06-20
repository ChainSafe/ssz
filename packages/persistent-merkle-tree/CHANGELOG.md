# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped to 0.4.2

## [1.2.0](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v1.1.0...persistent-merkle-tree-v1.2.0) (2025-05-30)


### Features

* hashInto() and digest64Into() api ([#480](https://github.com/ChainSafe/ssz/issues/480)) ([d69a8a3](https://github.com/ChainSafe/ssz/commit/d69a8a3ae512c3567a80b2fc5ccc32d0a59a3b3e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 1.1.0 to 1.2.0

## [1.1.0](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v1.0.1...persistent-merkle-tree-v1.1.0) (2025-03-12)


### Features

* add tests workflow for bun and deno ([#423](https://github.com/ChainSafe/ssz/issues/423)) ([089daed](https://github.com/ChainSafe/ssz/commit/089daeda999ca9887327ef06efa5bdf6507ae0e3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 1.0.0 to 1.1.0

## [1.0.1](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v1.0.0...persistent-merkle-tree-v1.0.1) (2025-01-23)


### Bug Fixes

* correctly export hashers from persistent-merkle-tree ([#460](https://github.com/ChainSafe/ssz/issues/460)) ([1eba2f9](https://github.com/ChainSafe/ssz/commit/1eba2f9f96db950a6ca8ea6b7b2d585d087da619))

## [1.0.0](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.9.1...persistent-merkle-tree-v1.0.0) (2025-01-23)


### ⚠ BREAKING CHANGES

* use named exports to expose different hashers ([#459](https://github.com/ChainSafe/ssz/issues/459))
* remove support for CJS ([#440](https://github.com/ChainSafe/ssz/issues/440))

### Features

* remove support for CJS ([#440](https://github.com/ChainSafe/ssz/issues/440)) ([57d14f1](https://github.com/ChainSafe/ssz/commit/57d14f19cd71a483e7108570c5c295d4f8a9a85d))
* use named exports to expose different hashers ([#459](https://github.com/ChainSafe/ssz/issues/459)) ([f763c8a](https://github.com/ChainSafe/ssz/commit/f763c8ad01fa1375b977b1deaa7545cbd4eff5d9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 0.6.1 to 1.0.0

## [0.9.1](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.9.0...persistent-merkle-tree-v0.9.1) (2025-01-18)


### Bug Fixes

* **persistent-ts:** empty commit to trigger release from package.json fix ([#446](https://github.com/ChainSafe/ssz/issues/446)) ([825d530](https://github.com/ChainSafe/ssz/commit/825d5303eb2bac251a346eda47618dd5b8f67f64))
* **ssz:** empty commit to trigger release from package.json fix ([#445](https://github.com/ChainSafe/ssz/issues/445)) ([f5417f5](https://github.com/ChainSafe/ssz/commit/f5417f54072a71bf86be01d4e028070145d1e4e7))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 0.6.0 to 0.6.1

## [0.9.0](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.8.0...persistent-merkle-tree-v0.9.0) (2025-01-15)


### Features

* implement merkleizeBlockArray ([#421](https://github.com/ChainSafe/ssz/issues/421)) ([e58781f](https://github.com/ChainSafe/ssz/commit/e58781feb7c9a956b66f1109fc639bdb86326293))
* implement ViewDU.batchHashTreeRoot() ([#392](https://github.com/ChainSafe/ssz/issues/392)) ([8dd6600](https://github.com/ChainSafe/ssz/commit/8dd6600ad41e9a0d25182ca50f0ffd9be7fc5b8c))
* non simd sha256 for incompatible systems ([#427](https://github.com/ChainSafe/ssz/issues/427)) ([9729005](https://github.com/ChainSafe/ssz/commit/9729005ab0fd401c30e999b20133c4bb6373ded6))
* snapshot apis for EIP-4881 ([#400](https://github.com/ChainSafe/ssz/issues/400)) ([32fb35a](https://github.com/ChainSafe/ssz/commit/32fb35ad3dcb67465c04dcaf5d7afd93af5219e8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 0.5.0 to 0.6.0

## [0.8.0](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.8.0...persistent-merkle-tree-v0.8.0) (2024-10-15)


### Features

* implement ViewDU.batchHashTreeRoot() ([#392](https://github.com/ChainSafe/ssz/issues/392)) ([8dd6600](https://github.com/ChainSafe/ssz/commit/8dd6600ad41e9a0d25182ca50f0ffd9be7fc5b8c))
* snapshot apis for EIP-4881 ([#400](https://github.com/ChainSafe/ssz/issues/400)) ([32fb35a](https://github.com/ChainSafe/ssz/commit/32fb35ad3dcb67465c04dcaf5d7afd93af5219e8))

## [0.8.0](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.7.2...persistent-merkle-tree-v0.8.0) (2024-08-06)


### ⚠ BREAKING CHANGES

* implement hashInto() api for as-sha256 ([#382](https://github.com/ChainSafe/ssz/issues/382))

### Features

* implement batch hash utils ([#384](https://github.com/ChainSafe/ssz/issues/384)) ([1578883](https://github.com/ChainSafe/ssz/commit/15788839b71287e2ff22254bfcabba8221b08a00))
* implement HashComputationLevel using LinkedList ([#389](https://github.com/ChainSafe/ssz/issues/389)) ([e2c8329](https://github.com/ChainSafe/ssz/commit/e2c83298f9cdb29de407737df85da9292c8eb754))
* implement hashInto() api for as-sha256 ([#382](https://github.com/ChainSafe/ssz/issues/382)) ([ccadf43](https://github.com/ChainSafe/ssz/commit/ccadf431cea6164822e72771304192b2728d7bb2))


### Bug Fixes

* findDiffDepthi to support more than 31 bytes ([#371](https://github.com/ChainSafe/ssz/issues/371)) ([3a1c8dc](https://github.com/ChainSafe/ssz/commit/3a1c8dc54a571dfed4cc426810472627b334e9b9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 0.4.2 to 0.5.0

## [0.7.1](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.7.0...persistent-merkle-tree-v0.7.1) (2024-03-15)


### Bug Fixes

* export ListUintNum64Type ([#353](https://github.com/ChainSafe/ssz/issues/353)) ([30e3deb](https://github.com/ChainSafe/ssz/commit/30e3debbaf7346711eb201740c072aab645d3b14))

## [0.7.0](https://github.com/ChainSafe/ssz/compare/persistent-merkle-tree-v0.6.1...persistent-merkle-tree-v0.7.0) (2024-03-12)


### Features

* new type for list of uint64 ([#352](https://github.com/ChainSafe/ssz/issues/352)) ([e131b5a](https://github.com/ChainSafe/ssz/commit/e131b5a9080f8719d624df97d8a4462081a65807))

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
