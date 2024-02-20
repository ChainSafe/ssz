import {expect} from "chai";
import {CACHE_HASH_SIZE, allocHashId, digest2Bytes32, digest64HashIds, freeHashId, getCache, getHash, getHashIndex} from "../../src";

describe("hash cache", () => {
  it("should allocate and free hash ids", () => {
    let id = allocHashId();
    const hashIndex = getHashIndex(id);
    if (hashIndex >= CACHE_HASH_SIZE / 2) {
      console.warn("unreachable");
      return;
    }

    const ids = [id];
    for (let i = 0; i < CACHE_HASH_SIZE - hashIndex; i++) {
      ids.push(allocHashId());
    }

    expect(getCache(ids[0]).used.size).to.equal(CACHE_HASH_SIZE);

    for (const id of ids) {
      freeHashId(id);
    }

    expect(getCache(ids[0]).used.size).to.equal(Math.max(CACHE_HASH_SIZE - ids.length, 0));
  });

  it("should properly hash many items", function () {
    this.timeout(0);

    let id = allocHashId();
    const ids = [id];
    let hash = new Uint8Array(32);
    for (let i = 0; i < 1_000_000; i++) {
      hash = digest2Bytes32(hash, hash);
      const outId = allocHashId();
      ids.push(outId);
      digest64HashIds(id, id, outId);
      id = outId;
      expect(getHash(outId), `failure on ${i}`).to.deep.equal(hash);

      if (i % 100_000 === 0) {
        for (const id of ids) {
          freeHashId(id);
        }
      }
    }
  });
});
