import {expect} from "chai";
import crypto from "crypto";
import {streamXOR} from "../../src/index";
import {streamXOR as streamXORStableLib} from "@stablelib/chacha";

describe("chacha streamXOR", function () {
  for (let i = 0; i < 100; i++) {
    const inputLength = i * 100 + Math.floor(Math.random() * 100);
    // const inputLength = 64;
    it.only(`Test round ${i}`, function () {
      const key = crypto.randomBytes(32);
      const nonce = crypto.randomBytes(16);
      const input = crypto.randomBytes(inputLength);
      const dest = new Uint8Array(inputLength);
      const nonceInplaceCounterLength = 4;
      streamXORStableLib(new Uint8Array(key), new Uint8Array(nonce), new Uint8Array(input), dest, nonceInplaceCounterLength);
      const dest2 = streamXOR(new Uint8Array(key), new Uint8Array(nonce), new Uint8Array(input));
      expect(dest2).to.be.deep.equal(dest, "as-chacha20 is not equal to stablelib chacha20");
    });
  }
});
