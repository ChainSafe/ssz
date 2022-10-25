import {itBench, setBenchOpts} from "@dapplion/benchmark";
import crypto from "crypto";
import {ChaCha20Poly1305 as ChaCha20Poly1305Stablelib} from "@stablelib/chacha20poly1305";
import {ChaCha20Poly1305} from "../../src/chacha20poly1305";
import {KEY_LENGTH, NONCE_LENGTH, TAG_LENGTH} from "../../common/const";
import {newInstance} from "../../src/wasm";

describe("chacha20poly1305", function () {
  this.timeout(0);
  setBenchOpts({
    minMs: 30_000,
  });
  const ctx = newInstance();
  const asImpl = new ChaCha20Poly1305(ctx);

  const key = new Uint8Array(crypto.randomBytes(KEY_LENGTH));
  const jsImpl = new ChaCha20Poly1305Stablelib(key);
  const nonce = new Uint8Array(crypto.randomBytes(NONCE_LENGTH));
  // const jsImpl = new ChaCha20Poly1305Stablelib(key);
  const ad = new Uint8Array(crypto.randomBytes(32));

  for (const dataLength of [512, 4096, 16384, 65_536, 524_288]) {
    const plainText = new Uint8Array(crypto.randomBytes(dataLength));
    const sealed = jsImpl.seal(nonce, plainText, ad);

    itBench({
      id: `as seal with data length ${dataLength}`,
      fn: () => {
        asImpl.seal(key, nonce, plainText, ad);
      },
      runsFactor: 1000,
    });

    itBench({
      id: `js seal with data length ${dataLength}`,
      fn: () => {
        jsImpl.seal(nonce, plainText, ad);
      },
      runsFactor: 1000,
    });

    itBench({
      id: `as open with data length ${dataLength}`,
      beforeEach: () => new Uint8Array(sealed),
      fn: (clonedSealed) => {
        // overwriteSealed as true to avoid memory allocation
        asImpl.open(key, nonce, clonedSealed, ad, clonedSealed.subarray(0, clonedSealed.length - TAG_LENGTH));
      },
      runsFactor: 1000,
    });

    itBench({
      id: `js open with data length ${dataLength}`,
      beforeEach: () => new Uint8Array(sealed),
      fn: (clonedSealed) => {
        jsImpl.open(nonce, clonedSealed, ad, clonedSealed.subarray(0, clonedSealed.length - TAG_LENGTH));
      },
      runsFactor: 1000,
    });
  }
});
