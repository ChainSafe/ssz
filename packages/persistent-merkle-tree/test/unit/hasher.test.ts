import {expect} from "chai";
import {uint8ArrayToHashObject, hasher, hashObjectToUint8Array} from "../../src/hasher";
import {allocHashId, freeHashId, getHash, getHashObject, setHash, setHashObject} from "@chainsafe/as-sha256";

describe("hasher", function () {
  it("hasher methods should be the same", () => {
    const root1 = Buffer.from("2e38da9dcfa42dc546b3a8c685a9e58b26f8a22c980af36a841e867ae6134a2e", "hex");
    const root2 = Buffer.from("b3c957fe5ce9cdd57aee7bef2c2f3818f3d2851459cc6a71178fa55ee2e322dc", "hex");
    const root = hasher.digest64(root1, root2);

    // ensure that hash object functionality is the same as Uint8array functionality
    const obj1 = uint8ArrayToHashObject(root1);
    const obj2 = uint8ArrayToHashObject(root2);
    const obj = hasher.digest64HashObjects(obj1, obj2);
    const newRoot = hashObjectToUint8Array(obj);
    expect(newRoot).to.be.deep.equal(root, "hash and hash2 is not equal");

    // ensure that hash id functionality is the same as Uint8array functionality
    const id1 = allocHashId();
    const id2 = allocHashId();
    const out = allocHashId();

    setHash(id1, root1);
    setHash(id2, root2);
    hasher.digest64HashIds(id1, id2, out);
    expect(getHash(out)).to.be.deep.equal(root, "hash and hash2 is not equal");

    // ensure that hash id functionality is the same as hash object functionality
    setHashObject(id1, obj1);
    setHashObject(id2, obj2);
    hasher.digest64HashIds(id1, id2, out);
    expect(getHashObject(out)).to.be.deep.equal(obj, "hash and hash2 is not equal");

    freeHashId(id1);
    freeHashId(id2);
    freeHashId(out);
  });
});
