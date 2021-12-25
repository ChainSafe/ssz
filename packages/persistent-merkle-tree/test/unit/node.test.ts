import {HashObject} from "@chainsafe/as-sha256";
import {expect} from "chai";
import {LeafNode} from "../../src";

describe("LeafNode uint", () => {
  const testCasesNode: {
    nodeValue: Partial<HashObject>;
    testCases: {bytes: number; offset: number; value: number}[];
    asHex?: boolean;
  }[] = [
    {
      nodeValue: {h0: 4},
      testCases: [
        {bytes: 4, offset: 0, value: 4},
        {bytes: 2, offset: 2, value: 4},
        {bytes: 1, offset: 3, value: 4},
        {bytes: 2, offset: 0, value: 0},
        {bytes: 1, offset: 0, value: 0},
      ],
    },
    {
      nodeValue: {h0: 0xaabbccdd},
      asHex: true,
      testCases: [
        {bytes: 8, offset: 0, value: 0xaabbccdd},
        {bytes: 4, offset: 0, value: 0xaabbccdd},
        {bytes: 2, offset: 2, value: 0xccdd},
        {bytes: 2, offset: 0, value: 0xaabb},
        {bytes: 1, offset: 0, value: 0xaa},
        {bytes: 1, offset: 1, value: 0xbb},
        {bytes: 1, offset: 2, value: 0xcc},
        {bytes: 1, offset: 3, value: 0xdd},
      ],
    },
  ];

  for (const {nodeValue, testCases, asHex} of testCasesNode) {
    it(`getUint, ${JSON.stringify(nodeValue)}`, () => {
      const leafNode = new LeafNode({h0: 0, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0, ...nodeValue});
      for (const {bytes, offset, value} of testCases) {
        // Use the unsigned right shift operator. By default bitwise ops convert to signed 32 bit numbers.
        // Signed 32 bit numbers conver funky to hex.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift
        const res = leafNode.getUint(bytes, offset) >>> 0;
        if (asHex) {
          expect(res.toString(16)).to.equal(value.toString(16), `Wrong getUint(${bytes}, ${offset})`);
        } else {
          expect(res).to.equal(value, `Wrong getUint(${bytes}, ${offset})`);
        }
      }
    });
  }
});

describe("setUint getUint - all small values", () => {
  for (let bytes = 1; bytes <= 8; bytes *= 2) {
    const leafNode = new LeafNode(Buffer.alloc(32, 0xff));

    for (let offset = 0; offset < 32; offset += bytes) {
      it(`setUint getUint bytes ${bytes} offset ${offset}`, () => {
        const value = 0x0f + offset;
        leafNode.setUint(bytes, offset, value);
        expect(leafNode.getUint(bytes, offset)).to.equal(value);
      });
    }
  }
});

describe("setUintBigint getUintBigint - all small values", () => {
  for (let bytes = 1; bytes <= 32; bytes *= 2) {
    const leafNode = new LeafNode(Buffer.alloc(32, 0xff));

    for (let offset = 0; offset < 32; offset += bytes) {
      it(`setUint getUint bytes ${bytes} offset ${offset}`, () => {
        const value = BigInt(0x0f + offset);
        leafNode.setUintBigint(bytes, offset, value);
        expect(leafNode.getUintBigint(bytes, offset)).to.equal(value);
      });
    }
  }
});

describe("setUint getUint - some big values", () => {
  const bytes = 8;

  for (const value of [Number.MAX_SAFE_INTEGER, 0xffffffff + 1, 0xaabbccddee]) {
    const leafNode = new LeafNode(Buffer.alloc(32, 0));

    for (let offset = 0; offset < 1; offset += bytes) {
      it(`setUint getUint value ${value} offset ${offset}`, () => {
        leafNode.setUint(bytes, offset, value);
        expect(leafNode.getUint(bytes, offset)).to.equal(value);
      });
    }
  }
});

describe("setUintBigint getUintBigint - some big values", () => {
  for (const value of [
    BigInt(Number.MAX_SAFE_INTEGER),
    BigInt(0xffffffff + 1),
    BigInt(0xaabbccddee),
    BigInt("0xaabbccddeeff9988"),
    BigInt("0xaabbccddeeff9988aabbccddeeff9988"),
    BigInt("0xaabbccddeeff9988aabbccddeeff9988aabbccddeeff9988"),
    BigInt("0xaabbccddeeff9988aabbccddeeff9988aabbccddeeff9988aabbccddeeff9988"),
  ]) {
    // Test as many bytes as the number fits
    const numBytes = Math.ceil(value.toString(2).length / 8);
    const numBytesNextPow2 = Math.pow(2, Math.floor(Math.log2(numBytes - 1)) + 1);

    for (let bytes = numBytesNextPow2; bytes <= 32; bytes *= 2) {
      const leafNode = new LeafNode(Buffer.alloc(32, 0));

      for (let offset = 0; offset < 1; offset += bytes) {
        it(`setUint getUint value ${value} bytes ${bytes} offset ${offset}`, () => {
          leafNode.setUintBigint(bytes, offset, value);
          expect(leafNode.getUintBigint(bytes, offset)).to.equal(value);
        });
      }
    }
  }
});