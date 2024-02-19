import {expect} from "chai";
import {allocHashId, digest2Bytes32, digest64HashIds, freeHashId, getHash} from "../../src";

describe("hash cache", () => {
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
