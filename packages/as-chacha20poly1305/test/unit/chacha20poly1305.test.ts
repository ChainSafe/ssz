import {ChaCha20Poly1305} from "../../src/chacha20poly1305";
import crypto from "crypto";
import {newInstance} from "../../src/wasm";
import {ChaCha20Poly1305 as ChaCha20Poly1305Stablelib} from "@stablelib/chacha20poly1305";
import {DATA_CHUNK_LENGTH, KEY_LENGTH, NONCE_LENGTH, TAG_LENGTH} from "../../common/const";
import {expect} from "chai";

describe("chacha20poly1305", function () {
  let asImpl: ChaCha20Poly1305;

  before(() => {
    const ctx = newInstance();
    asImpl = new ChaCha20Poly1305(ctx);
  });

  for (let i = 0; i < 100; i++) {
    const dataLength = i * DATA_CHUNK_LENGTH + Math.floor(Math.random() * DATA_CHUNK_LENGTH);
    for (const adLength of [0, 32]) {
      it(`encode (seal) with ad ${adLength}, round ${i} data length ${dataLength}`, () => {
        const key = new Uint8Array(crypto.randomBytes(KEY_LENGTH));
        const nonce = new Uint8Array(crypto.randomBytes(NONCE_LENGTH));
        const plainText = new Uint8Array(crypto.randomBytes(dataLength));
        const jsImpl = new ChaCha20Poly1305Stablelib(key);
        const ad = adLength > 0 ? new Uint8Array(crypto.randomBytes(adLength)) : undefined;

        const jsSealed = jsImpl.seal(nonce, plainText, ad);
        const asSealed = asImpl.seal(key, nonce, plainText, ad);

        expect(asSealed).to.be.deep.equal(jsSealed, "encoded data from as should be the same to js");
      });
    }
  }

  for (let i = 0; i < 100; i++) {
    const dataLength = i * 512 + Math.floor(Math.random() * 512);
    for (const adLength of [0, 32]) {
      it(`decode (open) with ad ${adLength}, round ${i} data length ${dataLength}`, () => {
        const key = new Uint8Array(crypto.randomBytes(KEY_LENGTH));
        const nonce = new Uint8Array(crypto.randomBytes(NONCE_LENGTH));
        const plainText = new Uint8Array(crypto.randomBytes(dataLength));
        const jsImpl = new ChaCha20Poly1305Stablelib(key);
        const ad = adLength > 0 ? new Uint8Array(crypto.randomBytes(adLength)) : undefined;
        // encode by js impl
        const sealed = jsImpl.seal(nonce, plainText, ad);
        const plainText1 = jsImpl.open(nonce, sealed, ad);
        expect(plainText1).to.be.deep.equal(plainText);
        // decode by as impl
        const plainText2 = asImpl.open(key, nonce, sealed, ad, sealed.subarray(0, sealed.length - TAG_LENGTH));
        expect(plainText2).to.be.deep.equal(plainText, "decoded data from assemblyscript is not correct");
      });
    }
  }
});
