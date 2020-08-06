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
