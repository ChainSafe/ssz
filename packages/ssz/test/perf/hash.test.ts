import {itBench} from "@dapplion/benchmark";
import {digest64HashObjects, hashObjectToByteArray} from "@chainsafe/as-sha256";
import {HashObject as HashObject_, hash, hashtreeOne, hashtree, hashtreeUint8Array, hash64} from "../../../hash-object";
import {expect} from "chai";
import { hashObjectToUint8Array } from "@chainsafe/persistent-merkle-tree";

describe("hash", () => {
  const n = 400;
  const runsFactor = 1e2;

  // itBench({id: "hash-object - zero - rust", runsFactor}, () => {
  //   for (let j = 0; j < runsFactor; j++) {
  //     const x = HashObject_.zero();
  //   }
  // });

  // itBench({id: "hash-object - zero - js", runsFactor}, () => {
  //   for (let j = 0; j < runsFactor; j++) {
  //     const x = {h0: 0, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0};
  //   }
  // });
  it("check hash correctness between all implementations", () => {
    const hU = Buffer.alloc(32, 1);
    const hU2 = new Uint8Array(64);
    hU2.set(hU);
    hU2.set(hU, 32);
    const hO = HashObject_.fromUint8Array(hU);
    expect(hash(hO, hO).toUint8Array()).to.deep.equal(hashObjectToUint8Array(digest64HashObjects(hO, hO)));
    expect(hashtreeOne(hO, hO).toUint8Array()).to.deep.equal(hash(hO, hO).toUint8Array());
    expect(hashtreeOne(hO, hO).toUint8Array()).to.deep.equal(hash(hO, hO).toUint8Array());
    expect(hashtreeUint8Array(hU2)).to.deep.equal(hash(hO, hO).toUint8Array());
    expect(hash64(hO, hO).toUint8Array()).to.deep.equal(hash(hO, hO).toUint8Array());
  });

  // itBench({id: "hashing - hashtreeOne", runsFactor}, () => {
  //   let h = HashObject_.fromUint8Array(new Uint8Array(32));
  //   for (let j = 0; j < runsFactor; j++) {
  //     for (let j = 0; j < n; j++) {
  //       h = hashtreeOne(h, h);
  //     }
  //   }
  // });

  // itBench({id: "hashing - hashtree", runsFactor}, () => {
  //   const h0 = new Array(n * 2).fill(HashObject_.fromUint8Array(new Uint8Array(32)));
  //   for (let j = 0; j < runsFactor; j++) {
  //     hashtree(h0);
  //   }
  // });

  // itBench({id: "hashing - hashtree uint8array", runsFactor}, () => {
  //   const h0 = new Uint8Array(n * 64);
  //   for (let j = 0; j < runsFactor; j++) {
  //     hashtreeUint8Array(h0);
  //   }
  // });

  // itBench({id: "hashing - rust", runsFactor}, () => {
  //   let h = HashObject_.fromUint8Array(new Uint8Array(32));
  //   for (let j = 0; j < runsFactor; j++) {
  //     for (let j = 0; j < n; j++) {
  //       h = hash(h, h);
  //     }
  //   }
  // });

  // itBench({id: "hashing - rust object rs-sha256", runsFactor}, () => {
  //   let h = HashObject_.fromUint8Array(new Uint8Array(32));
  //   for (let j = 0; j < runsFactor; j++) {
  //     for (let j = 0; j < n; j++) {
  //       h = hash64(h, h);
  //     }
  //   }
  // });

  // itBench({id: "hashing - rust object as-sha256", runsFactor}, () => {
  //   let h = HashObject_.fromUint8Array(new Uint8Array(32));
  //   for (let j = 0; j < runsFactor; j++) {
  //     for (let j = 0; j < n; j++) {
  //       h = digest64HashObjects(h, h) as HashObject_;
  //     }
  //   }
  // });

  // itBench({id: "hashing - as-sha256", runsFactor}, () => {
  //   let h = {h0: 0, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0};
  //   for (let j = 0; j < runsFactor; j++) {
  //     for (let j = 0; j < n; j++) {
  //       h = digest64HashObjects(h, h);
  //     }
  //   }
  // });
});

describe("set 32 bytes", () => {
  const runsFactor = 1e2;

  const length = 32000;
  const bytes1 = new Uint8Array(length);
  const bytes2 = new Uint8Array(length);
  const rand = (): number => Math.floor(Math.random() * (length - 32));

  itBench({id: "Uint8Array.set", runsFactor}, () => {
    for (let j = 0; j < runsFactor; j++) {
      const offset1 = rand();
      const offset2 = rand();

      bytes1.set(bytes2.subarray(offset2, offset2 + 32), offset1);
    }
  });

  itBench({id: "manual", runsFactor}, () => {
    for (let j = 0; j < runsFactor; j++) {
      let offset1 = rand();
      let offset2 = rand();

      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
      bytes1[offset1++] = bytes2[offset2++];
    }
  });
});
