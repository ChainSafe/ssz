import {expectEqualHex} from "../utils/expectHex";
import {uint8ArrayToHashObject, hashObjectToUint8Array} from "../../src/hasher/util";
import {hasher as nobleHasher} from "../../src/hasher/noble";
import {hasher as asSha256Hasher} from "../../src/hasher/as-sha256";
import {hasher as hashtreeHasher} from "../../src/hasher/hashtree";
import {linspace} from "../utils/misc";
import {buildComparisonTrees} from "../utils/tree";

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
        const obj = hasher.digest64HashObjects(obj1, obj2);
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
    const hash1 = hashObjectToUint8Array(nobleHasher.digest64HashObjects(hashObject1, hashObject2));
    const hash2 = hashObjectToUint8Array(asSha256Hasher.digest64HashObjects(hashObject1, hashObject2));
    const hash3 = hashObjectToUint8Array(hashtreeHasher.digest64HashObjects(hashObject1, hashObject2));
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
        expectEqualHex(tree1.root, tree2.batchHash());
      });
    }
  });
});

// TODO - batch: test more methods
