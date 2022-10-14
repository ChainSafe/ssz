import {expect} from "chai";
import crypto from "crypto";
import {Poly1305} from "../../src/poly1305";
import {Poly1305 as Poly1305StableLib} from "@stablelib/poly1305";
import {newInstance} from "../../src/wasm";

describe("poly1305", function () {
  let poly1305: Poly1305;

  // Got TypeError: Cannot perform %TypedArray%.prototype.set on a detached ArrayBuffer
  // if we use before
  beforeEach(() => {
    const ctx = newInstance();
    poly1305 = new Poly1305(ctx);
  });

  for (let i = 0; i < 100; i++) {
    const dataLength = i * 512 + Math.floor(Math.random() * 512);
    it(`poly1305 round ${i} data length ${dataLength}`, function () {
      const authKey = new Uint8Array(Array.from({length: 32}, () => 1));
      poly1305.init(authKey);
      const data = new Uint8Array(crypto.randomBytes(dataLength));
      poly1305.update(data);
      const asResult = poly1305.digest();
      const h = new Poly1305StableLib(authKey);
      h.update(data);
      const jsResult = h.digest();
      expect(asResult).to.be.deep.equal(jsResult, "assemblyscript poly1305 result is not equal to stablelib " + data);
    });
  }
});
