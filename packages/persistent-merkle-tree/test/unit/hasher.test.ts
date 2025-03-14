import {describe, expect, it} from "vitest";

import {hasher as asSha256Hasher} from "../../src/hasher/as-sha256.js";
import {hasher as hashtreeHasher} from "../../src/hasher/hashtree.js";
import {hasher as nobleHasher} from "../../src/hasher/noble.js";
import {hashObjectToUint8Array, uint8ArrayToHashObject} from "../../src/hasher/util.js";
import {
  HashComputationLevel,
  HashObject,
  Hasher,
  LeafNode,
  getHashComputations,
  subtreeFillToContents,
} from "../../src/index.js";
import {zeroHash} from "../../src/zeroHash.js";
import {expectEqualHex} from "../utils/expectHex.js";
import {buildComparisonTrees} from "../utils/tree.js";

describe("hashers", () => {
  const hashers: Hasher[] = [hashtreeHasher, asSha256Hasher, nobleHasher];

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
    nobleHasher.digest64HashObjects(hashObject1, hashObject2, ho1);
    const hash1 = hashObjectToUint8Array(ho1);
    const ho2 = {} as HashObject;
    asSha256Hasher.digest64HashObjects(hashObject1, hashObject2, ho2);
    const hash2 = hashObjectToUint8Array(ho2);
    const ho3 = {} as HashObject;
    hashtreeHasher.digest64HashObjects(hashObject1, hashObject2, ho3);
    const hash3 = hashObjectToUint8Array(ho3);
    expectEqualHex(hash1, hash2);
    expectEqualHex(hash1, hash3);
  });

  describe("all hashers should return the same values from executeHashComputations", () => {
    for (const hasher of hashers) {
      it(hasher.name, () => {
        const [tree1, tree2] = buildComparisonTrees(8);
        const hashComputations: HashComputationLevel[] = [];
        getHashComputations(tree1, 0, hashComputations);
        hasher.executeHashComputations(hashComputations);
        expectEqualHex(tree1.root, tree2.root);
      });
    }
  });

  describe("hasher.digestNLevel", () => {
    for (const hasher of hashers) {
      const numValidators = [1, 2, 3, 4];
      for (const numValidator of numValidators) {
        it(`${hasher.name} digestNLevel ${numValidator} validators = ${8 * numValidator} chunk(s)`, () => {
          const nodes = Array.from({length: 8 * numValidator}, (_, i) =>
            LeafNode.fromRoot(Buffer.alloc(32, i + numValidator))
          );
          const hashInput = Buffer.concat(nodes.map((node) => node.root));
          const hashOutput = hasher.digestNLevel(hashInput, 3).slice();
          for (let i = 0; i < numValidator; i++) {
            const root = subtreeFillToContents(nodes.slice(i * 8, (i + 1) * 8), 3).root;
            expectEqualHex(hashOutput.subarray(i * 32, (i + 1) * 32), root);
          }
        });
      }
    }
  });

  describe("hasher.merkleizeBlocksBytes", () => {
    const numNodes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (const hasher of hashers) {
      it(`${hasher.name} should throw error if not multiple of 64 bytes`, () => {
        const data = Buffer.alloc(63, 0);
        const output = Buffer.alloc(32);
        expect(() => hasher.merkleizeBlocksBytes(data, 2, output, 0)).to.throw("Invalid input length");
      });

      for (const numNode of numNodes) {
        it(`${hasher.name}.merkleizeBlocksBytes for ${numNode} nodes`, () => {
          const nodes = Array.from({length: numNode}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i)));
          const data = Buffer.concat(nodes.map((node) => node.root));
          const output = Buffer.alloc(32);
          const chunkCount = Math.max(numNode, 1);
          const padData = numNode % 2 === 1 ? Buffer.concat([data, zeroHash(0)]) : data;
          hasher.merkleizeBlocksBytes(padData, chunkCount, output, 0);
          const depth = Math.ceil(Math.log2(chunkCount));
          const root = subtreeFillToContents(nodes, depth).root;
          expectEqualHex(output, root);
        });
      }
    }
  });

  /**
   * The same to the previous test, but using the merkleizeBlockArray method
   */
  describe("hasher.merkleizeBlockArray", () => {
    for (const hasher of hashers) {
      it(`${hasher.name} should throw error if invalid blockLimit`, () => {
        const data = Buffer.alloc(64, 0);
        const output = Buffer.alloc(32);
        expect(() => hasher.merkleizeBlockArray([data], 2, 2, output, 0)).to.throw(
          "Invalid blockLimit, expect to be less than or equal blocks.length 1, got 2"
        );
      });

      it(`${hasher.name} should throw error if not multiple of 64 bytes`, () => {
        const data = Buffer.alloc(63, 0);
        const output = Buffer.alloc(32);
        expect(() => hasher.merkleizeBlockArray([data], 1, 2, output, 0)).to.throw(
          "Invalid block length, expect to be 64 bytes, got 63"
        );
      });

      it(`${hasher.name} should throw error if chunkCount < 1`, () => {
        const data = Buffer.alloc(64, 0);
        const output = Buffer.alloc(32);
        const chunkCount = 0;
        expect(() => hasher.merkleizeBlockArray([data], 1, chunkCount, output, 0)).to.throw(
          "Invalid padFor, expect to be at least 1, got 0"
        );
      });

      // hashtree has a buffer of 16 * 64 bytes = 32 nodes
      const numNodes = [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79];
      for (const numNode of numNodes) {
        it(`${hasher.name}.merkleizeBlockArray for ${numNode} nodes`, () => {
          const nodes = Array.from({length: numNode}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i)));
          const data = Buffer.concat(nodes.map((node) => node.root));
          const output = Buffer.alloc(32);
          // depth of 79 nodes are 7, make it 10 to test the padding
          const chunkCount = Math.max(numNode, 10);
          const padData = numNode % 2 === 1 ? Buffer.concat([data, zeroHash(0)]) : data;
          expect(padData.length % 64).to.equal(0);
          const blocks: Uint8Array[] = [];
          for (let i = 0; i < padData.length; i += 64) {
            blocks.push(padData.slice(i, i + 64));
          }
          const blockLimit = blocks.length;
          // should be able to run with above blocks, however add some redundant blocks similar to the consumer
          blocks.push(Buffer.alloc(64, 1));
          blocks.push(Buffer.alloc(64, 2));
          hasher.merkleizeBlockArray(blocks, blockLimit, chunkCount, output, 0);
          const depth = Math.ceil(Math.log2(chunkCount));
          const root = subtreeFillToContents(nodes, depth).root;
          expectEqualHex(output, root);
        });
      }
    }
  });
});
