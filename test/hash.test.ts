import { expect } from "chai";
import {uint8ArrayToHashObject, hash, hashTwoObjects, hashObjectToUint8Array} from "../src/hash";

describe("hash", function () {
  it("hash and hashTwoObjects should be the same", () => {
    const root1 = Buffer.alloc(32, 1);
    const root2 = Buffer.alloc(32, 2);
    const root = hash(root1, root2);

    const obj1 = uint8ArrayToHashObject(root1);
    const obj2 = uint8ArrayToHashObject(root2);
    const obj = hashTwoObjects(obj1, obj2);
    const newRoot = hashObjectToUint8Array(obj);
    expect(newRoot).to.be.deep.equal(root, "hash and hash2 is not equal");
  });
});
