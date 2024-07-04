import {expectEqualHex} from "../utils/expectHex";
import {uint8ArrayToHashObject, hashObjectToUint8Array} from "../../src/hasher/util";
import {hasher as nobleHasher} from "../../src/hasher/noble";
import {hasher as asSha256Hasher} from "../../src/hasher/as-sha256";
import {hasher as hashtreeHasher} from "../../src/hasher/hashtree";
import {linspace} from "../utils/misc";
import {buildComparisonTrees} from "../utils/tree";
import {HashObject, LeafNode, subtreeFillToContents} from "../../src";
import { expect } from "chai";
import { zeroHash } from "../../src/zeroHash";

const hashers = [hashtreeHasher, asSha256Hasher, nobleHasher];

describe("hashers", function () {
  describe("digest64 vs digest64HashObjects methods should be the same", () => {
    for (const hasher of hashers) {
      it(`${hasher.name} hasher`, () => {
        const root1 = Buffer.alloc(32, 1);
        const root2 = Buffer.alloc(32, 2);
        const root = hasher.digest64(root1, root2);

        const obj1 = uint8ArrayToHashObject(root1);
        const obj2 = uint8ArrayToHashObject(root2);
        const obj = {} as HashObject;
        hasher.digest64HashObjects(obj1, obj2, obj);
        const newRoot = hashObjectToUint8Array(obj);
        expectEqualHex(root, newRoot);
      });
    }
  });

  it("all hashers should return the same values from digest64", () => {
    const root1 = Buffer.alloc(32, 0x01);
    const root2 = Buffer.alloc(32, 0xff);
    const hash1 = nobleHasher.digest64(root1, root2);
    const hash2 = asSha256Hasher.digest64(root1, root2);
    const hash3 = hashtreeHasher.digest64(root1, root2);
    expectEqualHex(hash1, hash2);
    expectEqualHex(hash1, hash3);
  });

  it("all hashers should return the same values from digest64HashObjects", () => {
    const root1 = Buffer.alloc(32, 0x01);
    const hashObject1 = uint8ArrayToHashObject(root1);
    const root2 = Buffer.alloc(32, 0xff);
    const hashObject2 = uint8ArrayToHashObject(root2);
    const ho1 = {} as HashObject;
    nobleHasher.digest64HashObjects(hashObject1, hashObject2, ho1)
    const hash1 = hashObjectToUint8Array(ho1);
    const ho2 = {} as HashObject;
    asSha256Hasher.digest64HashObjects(hashObject1, hashObject2, ho2)
    const hash2 = hashObjectToUint8Array(ho2);
    const ho3 = {} as HashObject;
    hashtreeHasher.digest64HashObjects(hashObject1, hashObject2, ho3);
    const hash3 = hashObjectToUint8Array(ho3);
    expectEqualHex(hash1, hash2);
    expectEqualHex(hash1, hash3);
  });

  it("all hashers should return the same values from batchHashObjects", () => {
    const hashObjects = linspace(254)
      .map((num) => Buffer.alloc(32, num))
      .map(uint8ArrayToHashObject);
    const results1 = nobleHasher.batchHashObjects(hashObjects).map(hashObjectToUint8Array);
    const results2 = asSha256Hasher.batchHashObjects(hashObjects).map(hashObjectToUint8Array);
    const results3 = hashtreeHasher.batchHashObjects(hashObjects).map(hashObjectToUint8Array);
    Object.values(results1).forEach((result1, i) => {
      expectEqualHex(result1, results2[i]);
      expectEqualHex(result1, results3[i]);
    });
  });

  describe("all hashers should return the same values from executeHashComputations", () => {
    for (const hasher of hashers) {
      it(hasher.name, () => {
        const [tree1, tree2] = buildComparisonTrees(8);
        const hashComputations = tree2.hashComputations;
        hasher.executeHashComputations(hashComputations);
        expectEqualHex(tree1.root, tree2.root);
      });
    }
  });
});

describe("hasher.digestNLevelUnsafe", function () {
  const hashers = [hashtreeHasher, asSha256Hasher];
  for (const hasher of hashers) {
    const numValidators = [1, 2, 3, 4];
    for (const numValidator of numValidators) {
      it (`${hasher.name} digestNLevelUnsafe ${numValidator} validators = ${8 * numValidator} chunk(s)`, () => {
        const nodes = Array.from({length: 8 * numValidator}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i + numValidator)));
        const hashInput = Buffer.concat(nodes.map((node) => node.root));
        // slice() because output is unsafe
        const hashOutput = hasher.digestNLevelUnsafe(hashInput, 3).slice();
        for (let i = 0; i < numValidator; i++) {
          const root = subtreeFillToContents(nodes.slice(i * 8, (i + 1) * 8), 3).root;
          expectEqualHex(hashOutput.subarray(i * 32, (i + 1) * 32), root);
        }
      });
    }
  }
});


describe("hasher.merkleizeInto", function () {
  const numNodes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (const hasher of [hashtreeHasher, asSha256Hasher]) {
    it (`${hasher.name} should throw error if not multiple of 64 bytes`, () => {
      const data = Buffer.alloc(63, 0);
      const output = Buffer.alloc(32);
      expect(() => hasher.merkleizeInto(data, 2, output, 0)).to.throw("Invalid input length");
    });

    for (const numNode of numNodes) {
      it(`${hasher.name}.merkleizeInto for ${numNode} nodes`, () => {

        const nodes = Array.from({length: numNode}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i)));
        const data = Buffer.concat(nodes.map((node) => node.root));
        const output = Buffer.alloc(32);
        const chunkCount = Math.max(numNode, 1);
        const padData = numNode % 2 === 1 ? Buffer.concat([data, zeroHash(0)]) : data;
        hasher.merkleizeInto(padData, chunkCount, output, 0);
        const depth = Math.ceil(Math.log2(chunkCount));
        const root = subtreeFillToContents(nodes, depth).root;
        expectEqualHex(output, root);
      });
    }
  }
});

// TODO - batch: test more methods
