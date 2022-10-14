import {itBench} from "@dapplion/benchmark";
import crypto from "crypto";
import {streamXOR as streamXORStableLib} from "@stablelib/chacha";
import {chacha20StreamXOR} from "../../src/chacha20";

describe("streamXOR assemblyscript vs javascript", function () {
  this.timeout(0);
  const inputLengths = [512, 1204, 4096, 16384];

  for (const inputLength of inputLengths) {
    const key = crypto.randomBytes(32);
    const nonce = crypto.randomBytes(16);
    const input = crypto.randomBytes(inputLength);
    const dest = new Uint8Array(inputLength);
    const nonceInplaceCounterLength = 4;

    itBench({
      id: `javascript with input length ${inputLength}`,
      before: () => ({key: new Uint8Array(key), nonce: new Uint8Array(nonce), input: new Uint8Array(input)}),
      beforeEach: (v) => v,
      fn: ({key: k, nonce: n, input: i}) => {
        streamXORStableLib(k, n, i, dest, nonceInplaceCounterLength);
      },
      runsFactor: 1000,
    });

    itBench({
      id: `assemblyscript with input length ${inputLength}`,
      before: () => ({key: new Uint8Array(key), nonce: new Uint8Array(nonce), input: new Uint8Array(input)}),
      beforeEach: (v) => v,
      fn: ({key: k, nonce: n, input: i}) => {
        chacha20StreamXOR(k, n, i);
      },
      runsFactor: 1000,
    });
  }
});
