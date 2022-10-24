import {expect} from "chai";
import crypto from "crypto";
import {chacha20StreamXOR} from "../../src/chacha20";
import {streamXOR as streamXORStableLib} from "@stablelib/chacha";
import {DATA_CHUNK_LENGTH} from "../../common/const";

describe("chacha20 as vs js", function () {
  for (let i = 0; i < 100; i++) {
    const inputLength = i * DATA_CHUNK_LENGTH + Math.floor(Math.random() * DATA_CHUNK_LENGTH);
    it(`chacha20 round ${i} with length ${inputLength}`, function () {
      const key = crypto.randomBytes(32);
      const nonce = crypto.randomBytes(16);
      const input = crypto.randomBytes(inputLength);
      const dest = new Uint8Array(inputLength);
      const nonceInplaceCounterLength = 4;
      streamXORStableLib(
        new Uint8Array(key),
        new Uint8Array(nonce),
        new Uint8Array(input),
        dest,
        nonceInplaceCounterLength
      );
      const dest2 = chacha20StreamXOR(new Uint8Array(key), new Uint8Array(nonce), new Uint8Array(input));
      expect(dest2).to.be.deep.equal(dest, "as-chacha20 is not equal to stablelib chacha20");
    });
  }
});
