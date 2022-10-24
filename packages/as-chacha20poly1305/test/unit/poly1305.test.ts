import {expect} from "chai";
import crypto from "crypto";
import {Poly1305} from "../../src/poly1305";
import {Poly1305 as Poly1305StableLib} from "@stablelib/poly1305";
import {newInstance} from "../../src/wasm";
import { DATA_CHUNK_LENGTH } from "../../common/const";

describe("poly1305", function () {
  let poly1305: Poly1305;

  before(() => {
    const ctx = newInstance();
    poly1305 = new Poly1305(ctx);
  });

  for (let i = 0; i < 100; i++) {
    const dataLength = i * DATA_CHUNK_LENGTH + Math.floor(Math.random() * DATA_CHUNK_LENGTH);
    it(`poly1305 round ${i} data length ${dataLength}`, function () {
      const authKey = new Uint8Array(crypto.randomBytes(32));
      poly1305.init(authKey);
      const data = new Uint8Array(crypto.randomBytes(dataLength));
      poly1305.update(data);
      const asResult = poly1305.digest();
      const h = new Poly1305StableLib(authKey);
      h.update(data);
      const jsResult = h.digest();
      expect(asResult).to.be.deep.equal(jsResult, "assemblyscript poly1305 result is not equal to stablelib, data: " + data);
    });
  }
});
