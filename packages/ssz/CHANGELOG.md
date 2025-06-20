# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/persistent-merkle-tree bumped from 1.0.0 to 1.0.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 1.1.0 to 1.2.0
    * @chainsafe/persistent-merkle-tree bumped from 1.1.0 to 1.2.0

## [1.2.0](https://github.com/ChainSafe/ssz/compare/ssz-v1.1.0...ssz-v1.2.0) (2025-03-13)


### Features

* get list composite by range ([#472](https://github.com/ChainSafe/ssz/issues/472)) ([#473](https://github.com/ChainSafe/ssz/issues/473)) ([867273f](https://github.com/ChainSafe/ssz/commit/867273fc88a8c9e50662ebf491caf2a584fcc48a))
* model ListValidator ssz type ([#471](https://github.com/ChainSafe/ssz/issues/471)) ([9432799](https://github.com/ChainSafe/ssz/commit/9432799856f4f3e6cf3c43066715662313392f43))

## [1.1.0](https://github.com/ChainSafe/ssz/compare/ssz-v1.0.2...ssz-v1.1.0) (2025-03-12)


### Features

* add tests workflow for bun and deno ([#423](https://github.com/ChainSafe/ssz/issues/423)) ([089daed](https://github.com/ChainSafe/ssz/commit/089daeda999ca9887327ef06efa5bdf6507ae0e3))
* forEach() api for ArrayComposite() ([#469](https://github.com/ChainSafe/ssz/issues/469)) ([7ad418c](https://github.com/ChainSafe/ssz/commit/7ad418ce08e6469b562244a14df65f05c1fffdc2))
* improve type.hashTreeRoot() using batch ([#409](https://github.com/ChainSafe/ssz/issues/409)) ([66742f0](https://github.com/ChainSafe/ssz/commit/66742f0faf617f713744048609408365d6185780))


### Bug Fixes

* do not rebind node if unchanged child ViewDUs ([#470](https://github.com/ChainSafe/ssz/issues/470)) ([ab23b30](https://github.com/ChainSafe/ssz/commit/ab23b30ce2d940883816ea9cfbbf2473165353ca))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 1.0.0 to 1.1.0
    * @chainsafe/persistent-merkle-tree bumped from 1.0.1 to 1.1.0

## [1.0.2](https://github.com/ChainSafe/ssz/compare/ssz-v1.0.1...ssz-v1.0.2) (2025-01-30)


### Bug Fixes

* ListCompositeTreeViewDU to getAllReadonly() without commit ([#456](https://github.com/ChainSafe/ssz/issues/456)) ([94510c9](https://github.com/ChainSafe/ssz/commit/94510c9b2f1f907c72e0e2b79edf1891a3394c41))

## [1.0.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.19.1...ssz-v1.0.0) (2025-01-23)


### ⚠ BREAKING CHANGES

* remove support for CJS ([#440](https://github.com/ChainSafe/ssz/issues/440))

### Features

* remove support for CJS ([#440](https://github.com/ChainSafe/ssz/issues/440)) ([57d14f1](https://github.com/ChainSafe/ssz/commit/57d14f19cd71a483e7108570c5c295d4f8a9a85d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 0.6.1 to 1.0.0
    * @chainsafe/persistent-merkle-tree bumped from 0.9.1 to 1.0.0

## [0.19.1](https://github.com/ChainSafe/ssz/compare/ssz-v0.19.0...ssz-v0.19.1) (2025-01-18)


### Bug Fixes

* **persistent-ts:** empty commit to trigger release from package.json fix ([#446](https://github.com/ChainSafe/ssz/issues/446)) ([825d530](https://github.com/ChainSafe/ssz/commit/825d5303eb2bac251a346eda47618dd5b8f67f64))
* **ssz:** empty commit to trigger release from package.json fix ([#445](https://github.com/ChainSafe/ssz/issues/445)) ([f5417f5](https://github.com/ChainSafe/ssz/commit/f5417f54072a71bf86be01d4e028070145d1e4e7))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 0.6.0 to 0.6.1
    * @chainsafe/persistent-merkle-tree bumped from 0.9.0 to 0.9.1

## [0.19.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.18.0...ssz-v0.19.0) (2025-01-15)


### Features

* non simd sha256 for incompatible systems ([#427](https://github.com/ChainSafe/ssz/issues/427)) ([9729005](https://github.com/ChainSafe/ssz/commit/9729005ab0fd401c30e999b20133c4bb6373ded6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 0.5.0 to 0.6.0
    * @chainsafe/persistent-merkle-tree bumped from 0.8.0 to 0.9.0

## [0.18.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.17.1...ssz-v0.18.0) (2024-10-15)


### Features

* add StableContainer ([#373](https://github.com/ChainSafe/ssz/issues/373)) ([78a0291](https://github.com/ChainSafe/ssz/commit/78a029128878685248806ec71100fcedf3cb77ec))
* implement ViewDU.batchHashTreeRoot() ([#392](https://github.com/ChainSafe/ssz/issues/392)) ([8dd6600](https://github.com/ChainSafe/ssz/commit/8dd6600ad41e9a0d25182ca50f0ffd9be7fc5b8c))
* snapshot apis for EIP-4881 ([#400](https://github.com/ChainSafe/ssz/issues/400)) ([32fb35a](https://github.com/ChainSafe/ssz/commit/32fb35ad3dcb67465c04dcaf5d7afd93af5219e8))

## [0.17.1](https://github.com/ChainSafe/ssz/compare/ssz-v0.17.0...ssz-v0.17.1) (2024-08-19)


### Bug Fixes

* sliceFrom api ([#394](https://github.com/ChainSafe/ssz/issues/394)) ([4ca1d6f](https://github.com/ChainSafe/ssz/commit/4ca1d6f789428c52d012e0e2d8fa5809849e581e))

## [0.17.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.16.0...ssz-v0.17.0) (2024-08-06)


### Features

* implement batch hash utils ([#384](https://github.com/ChainSafe/ssz/issues/384)) ([1578883](https://github.com/ChainSafe/ssz/commit/15788839b71287e2ff22254bfcabba8221b08a00))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped from 0.4.2 to 0.5.0
    * @chainsafe/persistent-merkle-tree bumped from 0.7.2 to 0.8.0

## [0.16.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.15.1...ssz-v0.16.0) (2024-05-02)


### Features

* add `sliceFrom` to `ListCompositeTreeViewDU` ([#366](https://github.com/ChainSafe/ssz/issues/366)) ([b3fa4f1](https://github.com/ChainSafe/ssz/commit/b3fa4f1335e893f514afdf735b0da34b50b15b6f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped to 0.4.2
    * @chainsafe/persistent-merkle-tree bumped to 0.7.2

## [0.15.1](https://github.com/ChainSafe/ssz/compare/ssz-v0.15.0...ssz-v0.15.1) (2024-03-15)


### Bug Fixes

* export ListUintNum64Type ([#353](https://github.com/ChainSafe/ssz/issues/353)) ([30e3deb](https://github.com/ChainSafe/ssz/commit/30e3debbaf7346711eb201740c072aab645d3b14))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/persistent-merkle-tree bumped to 0.7.1

## [0.15.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.14.3...ssz-v0.15.0) (2024-03-12)


### Features

* add capability to cache merkle roots for lists ([#349](https://github.com/ChainSafe/ssz/issues/349)) ([14c4457](https://github.com/ChainSafe/ssz/commit/14c4457026a9fbea5bfe5c66580f7c8a8bee790a))
* improve ViewDU.serialize() ([#350](https://github.com/ChainSafe/ssz/issues/350)) ([4ba45d3](https://github.com/ChainSafe/ssz/commit/4ba45d3afec08a8aaf853237c3cd8439ca62bca5))
* new type for list of uint64 ([#352](https://github.com/ChainSafe/ssz/issues/352)) ([e131b5a](https://github.com/ChainSafe/ssz/commit/e131b5a9080f8719d624df97d8a4462081a65807))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/persistent-merkle-tree bumped to 0.7.0

## [0.14.3](https://github.com/ChainSafe/ssz/compare/ssz-v0.14.2...ssz-v0.14.3) (2024-02-10)


### Bug Fixes

* relax other instances of intersectValues ([#344](https://github.com/ChainSafe/ssz/issues/344)) ([e000351](https://github.com/ChainSafe/ssz/commit/e0003516dd4e50005182b55ab954baab81d9cc12))

## [0.14.2](https://github.com/ChainSafe/ssz/compare/ssz-v0.14.1...ssz-v0.14.2) (2024-02-10)


### Bug Fixes

* update changelog ordering ([#342](https://github.com/ChainSafe/ssz/issues/342)) ([698ad13](https://github.com/ChainSafe/ssz/commit/698ad13f8828a237650136ff90f3793b09357ddc))

## [0.14.1](https://github.com/ChainSafe/ssz/compare/ssz-v0.14.0...ssz-v0.14.1) (2024-02-10)


### Bug Fixes

* relax BitArray#intersectValues types ([#339](https://github.com/ChainSafe/ssz/issues/339)) ([9ba2456](https://github.com/ChainSafe/ssz/commit/9ba2456eff8b224248826be482a776f7c721aece))

## [0.14.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.13.0...ssz-v0.14.0) (2023-10-04)


### Features

* implement sliceTo() for ListBasicTreeViewDU ([#336](https://github.com/ChainSafe/ssz/issues/336)) ([e84686b](https://github.com/ChainSafe/ssz/commit/e84686b2192fee9e5d9413d55a57cf40af6fd3ef))


### Bug Fixes

* handle setBitOr in ListBasicTreeViewDU.sliceTo() ([#338](https://github.com/ChainSafe/ssz/issues/338)) ([5c5242a](https://github.com/ChainSafe/ssz/commit/5c5242a3bb5d89f8c51d5cb14112dd36edc91868))

## [0.13.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.12.0...ssz-v0.13.0) (2023-09-14)


### Features

* publish more methods ([#334](https://github.com/ChainSafe/ssz/issues/334)) ([947c3e2](https://github.com/ChainSafe/ssz/commit/947c3e278230c9e9db54c4ce20bef76c63040970))

## [0.12.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.11.1...ssz-v0.12.0) (2023-09-09)


### Features

* add optional ssz type ([#329](https://github.com/ChainSafe/ssz/issues/329)) ([3b714a2](https://github.com/ChainSafe/ssz/commit/3b714a29f8e69524ee5133ef3a28029d1d9f6669))

## [0.11.1](https://github.com/ChainSafe/ssz/compare/ssz-v0.11.0...ssz-v0.11.1) (2023-04-21)


### Bug Fixes

* Use file path imports ([#318](https://github.com/ChainSafe/ssz/issues/318)) ([f459e92](https://github.com/ChainSafe/ssz/commit/f459e92fbafc5d9388bfa630291855ec32a09566))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped to 0.4.1
    * @chainsafe/persistent-merkle-tree bumped to 0.6.1

## [0.11.0](https://github.com/ChainSafe/ssz/compare/ssz-v0.10.2...ssz-v0.11.0) (2023-04-05)


### Features

* add swappable hasher, default to noble-hashes ([#314](https://github.com/ChainSafe/ssz/issues/314)) ([4b44614](https://github.com/ChainSafe/ssz/commit/4b44614003619b2c5477363a3c85287e2f2987bd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/as-sha256 bumped to 0.4.0
    * @chainsafe/persistent-merkle-tree bumped to 0.6.0

## [0.10.2](https://github.com/ChainSafe/ssz/compare/ssz-v0.10.1...ssz-v0.10.2) (2023-02-28)


### Bug Fixes

* Remove replaceAll with replace(/.../g,... for ES2019 compatibility ([#309](https://github.com/ChainSafe/ssz/issues/309)) ([3c0a2c5](https://github.com/ChainSafe/ssz/commit/3c0a2c5dfe678925cd1b35b486b66738cdb12e99))

## [0.10.0](http://chainsafe/ssz/compare/@chainsafe/ssz@0.9.4...@chainsafe/ssz@0.10.0) (2023-01-05)


### Features

* Switch case dependency to internal helper ([#296](http://chainsafe/ssz/issues/296)) ([900811c](http://chainsafe/ssz/commits/900811c70eabf7613d6ba28f473a9a394f1ca544))

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @chainsafe/persistent-merkle-tree bumped from ^0.4.2 to ^0.5.0


## [0.9.4](http://chainsafe/ssz/compare/@chainsafe/ssz@0.9.3...@chainsafe/ssz@0.9.4) (2022-12-08)

**Note:** Version bump only for package @chainsafe/ssz





## [0.9.3](http://chainsafe/ssz/compare/@chainsafe/ssz@0.9.2...@chainsafe/ssz@0.9.3) (2022-12-08)

**Note:** Version bump only for package @chainsafe/ssz





## [0.9.2](https://github.com/chainsafe/ssz/compare/@chainsafe/ssz@0.9.1...@chainsafe/ssz@0.9.2) (2022-05-31)

* Fix ListCompositeType.sliceTo(-1) (#268)

## [0.9.1](https://github.com/chainsafe/ssz/compare/@chainsafe/ssz@0.9.0...@chainsafe/ssz@0.9.1) (2022-04-14)

* Force usage of Uint8Array.prototype.slice (#258)
* Add and use a new helper to digest64 two 32 bytes (#255)
* Remove unused files (#248)
* Bump spec tests (#251)
* Bump yargs-parser from 16.1.0 to 20.2.4 in /packages/ssz (#189)
* Test empty ByteListType (#250)

# [0.9.0](http://chainsafe/ssz/compare/@chainsafe/ssz@0.8.19...@chainsafe/ssz@0.9.0) (2022-03-24)


* SSZ v2 (#223) ([9d167b7](http://chainsafe/ssz/commits/9d167b703b1e974ee4943be15710aa9783183986)), closes [#223](http://chainsafe/ssz/issues/223) [#227](http://chainsafe/ssz/issues/227)
* Convert as-sha256 to typescript (#244) ([2d4e3fe](http://chainsafe/ssz/commits/2d4e3febec89ca8ca7c89a19c6949c3213c2c45c)), closes [#244](http://chainsafe/ssz/issues/244)


### BREAKING CHANGES

* complete refactor, see packages/ssz/README.md for details

## 0.8.20 (2021-11-23)
- Harden ssz implementation [#211](https://github.com/ChainSafe/ssz/pull/211)

## [0.8.19](https://github.com/chainsafe/ssz/compare/@chainsafe/ssz@0.8.18...@chainsafe/ssz@0.8.19) (2021-10-12)

**Note:** Version bump only for package @chainsafe/ssz

## 0.8.18 (2021-09-25)

## Features

- Ability to specify casingMap declaration time for Container's toJson/fromJson [#198](https://github.com/ChainSafe/ssz/pull/198)
- Extending case matching in Container's toJson/fromJson with a range of case types [#184](https://github.com/ChainSafe/ssz/pull/184)
- Ability to provide casingMap in toJson/fromJson interface for aiding case matching [#184](https://github.com/ChainSafe/ssz/pull/184)


## 0.8.17 (2021-08-30)

## Bug fixes

- Fix ContainerLeafNodeStructTreeValue [#179](https://github.com/ChainSafe/ssz/pull/179)

## 0.8.16 (2021-08-30)

## Features

- Implement Number64UintType and Number64ListType [#159](https://github.com/ChainSafe/ssz/pull/159)
- Add ContainerLeafNodeStructType for memory efficiency [#168](https://github.com/ChainSafe/ssz/pull/168)
- Union type [#145](https://github.com/ChainSafe/ssz/pull/145)
- Add alternative to iterator interface [#171](https://github.com/ChainSafe/ssz/pull/171)

## 0.8.15 (2021-08-23)

## Features

- Avoid iterateNodesAtDepth [#167](https://github.com/ChainSafe/ssz/pull/167)

## 0.8.14 (2021-08-19)

## Features

- Add getFixedSerializedLength() [#148](https://github.com/ChainSafe/ssz/pull/148)
- Cache field information for Container type [#146](https://github.com/ChainSafe/ssz/pull/146)
- Use persistent-merkle-tree 0.3.5 and as-sha256 0.2.4 [#165](https://github.com/ChainSafe/ssz/pull/165)

## 0.8.13 (2021-08-04)

## Features

- Use utility function for bigint exponentiation ([c2d3a7](https://github.com/chainsafe/ssz/commit/c2d3a7))

## 0.8.12 (2021-07-30)

## Features

- Use utility function for bigint exponentiation ([fbb671](https://github.com/chainsafe/ssz/commit/fbb671))

## 0.8.11 (2021-06-18)

## Chores

- Update persistent-merkle-tree ([f88f15](https://github.com/chainsafe/ssz/commit/f88f15))

## 0.8.10 (2021-06-16)

## Features

- Add fast struct_equals impl for RootType ([a3f4b4](https://github.com/chainsafe/ssz/commit/a3f4b4))

## 0.8.9 (2021-06-11)

## Bug Fixes

- Fix tree_serializeToBytes offset in BitList ([7cd2c1](https://github.com/chainsafe/ssz/commit/7cd2c1))

## 0.8.8 (2021-06-10)

## Bug Fixes

- Fix tree serialize/deserialize in BitList ([ee47a0](https://github.com/chainsafe/ssz/commit/ee47a0))
- Fix struct_getRootAtChunkIndex for BitVectorType ([ee47a0](https://github.com/chainsafe/ssz/commit/ee47a0))

## 0.8.7 (2021-06-01)

## Bug Fixes

- Fix BitVector tree_deserializeFromBytes() ([fd2c7d](https://github.com/chainsafe/ssz/commit/fd2c7d))

## 0.8.6 (2021-05-25)

## Bug Fixes

- Fix basic vector struct_convertFromJson ([05e7c2](https://github.com/chainsafe/ssz/commit/05e7c2))

## 0.8.5 (2021-05-19)

## Features

- Add composite type leaves to proof ([3f1cfd](https://github.com/chainsafe/ssz/commit/3f1cfd))

## 0.8.4 (2021-05-07)

## Bug Fixes

- Update as-sha256 ([8d497b](https://github.com/chainsafe/ssz/commit/8d497b))

## 0.8.3 (2021-05-04)

## Features

- Improve hexToString performance ([106991](https://github.com/chainsafe/ssz/commit/106991))

## Chores

- Update as-sha256 & persistent-merkle-tree ([212927](https://github.com/chainsafe/ssz/commit/212927))
- Use for of instead of forEach ([e195df](https://github.com/chainsafe/ssz/commit/e195df))
- Add whitespace ([516421](https://github.com/chainsafe/ssz/commit/516421))

## 0.8.2 (2021-04-05)

## Features

- Add tree_createFromProof ([b804f4](https://github.com/chainsafe/ssz/commit/b804f4))

## 0.8.1 (2021-04-02)

## Bug Fixes

- Fix bit array struct->tree ([8b08ea](https://github.com/chainsafe/ssz/commit/8b08ea))

## Features

- Improve convertToTree ([776b63](https://github.com/chainsafe/ssz/commit/776b63))

## 0.8.0 (2021-03-29)

## BREAKING CHANGES

- Refactor codebase ([c86871](https://github.com/chainsafe/ssz/commit/c86871))

## 0.7.1 (2021-03-29)

## Bug Fixes

- Bug fix in @chainsafe/persistent-merkle-tree ([d31f82](https://github.com/chainsafe/ssz/commit/d31f82))

## 0.7.0 (2021-03-01)

## BREAKING CHANGES

- Use abstract class Type/BasicType/CompositeType ([c91b19](https://github.com/chainsafe/ssz/commit/c91b19))
- Remove TreeBacked<T>#gindexOfProperty ([d4b141](https://github.com/chainsafe/ssz/commit/d4b141))

## Features

- Optimize byte array equals ([7639b2](https://github.com/chainsafe/ssz/commit/7639b2))
- Restrict the use of BigInt whenever possible ([22e8c4](https://github.com/chainsafe/ssz/commit/22e8c4))
- Initial multiproof support ([9e758a](https://github.com/chainsafe/ssz/commit/9e758a))

## 0.6.13 (2020-08-05)

## Bug Fixes

- Add length check to array structural equality ([c7782a](https://github.com/chainsafe/ssz/commit/c7782a))

## 0.6.12 (2020-08-05)

## Features

- Add readOnlyEntries ([211e6d](https://github.com/chainsafe/ssz/commit/211e6d))

## 0.6.11 (2020-08-01)

## Features

- Optimize fromStructural ([ff388a](https://github.com/chainsafe/ssz/commit/ff388a))

## 0.6.10 (2020-07-27)

## Features

- Add readOnlyForEach and readOnlyMap functions ([356d70](https://github.com/chainsafe/ssz/commit/356d70))

## Chores

- Use readonly tree iteration in tree-backed toBytes ([356d70](https://github.com/chainsafe/ssz/commit/356d70))

## 0.6.9 (2020-07-09)

### Bug Fixes

- Fix bitlist/bitvector validation ([030784](https://github.com/chainsafe/ssz/commit/030784))

## 0.6.8 (2020-07-09)

### Features

- Track error JSON path location with try / catch ([4ff92d](https://github.com/chainsafe/ssz/commit/4ff92d))
- Add validation for fromBytes ([64b757](https://github.com/chainsafe/ssz/commit/64b757))

### Chores

- Add prettier as an eslint plugin ([c606a0](https://github.com/chainsafe/ssz/commit/c606a0))
- Add es and node badges ([b25c39](https://github.com/chainsafe/ssz/commit/b25c39))
- Standardize uint toJson ([4dbc6f](https://github.com/chainsafe/ssz/commit/4dbc6f))

### Bug Fixes

- Fix structural bitlist/bitvector hashtreeroot ([5ed8e0](https://github.com/chainsafe/ssz/commit/5ed8e0))
- Fix start param validation case ([5fd207](https://github.com/chainsafe/ssz/commit/5fd207))

## 0.6.7 (2020-06-08)

### Features

- Implement minSize and mazSize api ([fb14bd](https://github.com/chainsafe/ssz/commit/fb14bd))

### Chores

- Don't use BigInt in NumberUintType ([7abe06](https://github.com/chainsafe/ssz/commit/7abe06))

## 0.6.6 (2020-06-07)

### Chores

- Update persistent-merkle-tree dependency ([b54ea0](https://github.com/chainsafe/ssz/commit/b54ea0))

## 0.6.5 (2020-06-01)

### Bug Fixes

- Fix Infinity serialization to/fromJson ([9a68c3](https://github.com/chainsafe/ssz/commit/9a68c3))

## 0.6.4 (2020-05-04)

### Features

- Add ObjBacked wrapper type ([1cf4ac](https://github.com/chainsafe/ssz/commit/1cf4ac))

## 0.6.3 (2020-04-30)

### Features

- Add isFooType functions ([a577e3](https://github.com/chainsafe/ssz/commit/a577e3))
- Add json case option ([0f8566](https://github.com/chainsafe/ssz/commit/0f8566))

### Bug Fixes

- Fix far future deserialization ([63d6cd](https://github.com/chainsafe/ssz/commit/63d6cd))

## 0.6.2 (2020-04-20)

### Chores

- Update persistent-merkle-tree dependency ([e05265](https://github.com/chainsafe/ssz/commit/e05265))

### Bug Fixes

- Fix composite vector defaultValue ([facf47](https://github.com/chainsafe/ssz/commit/facf47))
