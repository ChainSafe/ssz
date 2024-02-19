import {HashObject} from "@chainsafe/as-sha256";
import {expect} from "chai";
import {BranchNode, LeafNode, hasher} from "../../src";

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
        {bytes: 2, offset: 2, value: 0},
        {bytes: 1, offset: 3, value: 0},
        {bytes: 2, offset: 0, value: 4},
        {bytes: 1, offset: 0, value: 4},
      ],
    },
    {
      // This number is represented here as big endian.
      // eth2 uses little endian, so the number is chopped as bytes [dd, cc, bb, aa]
      nodeValue: {h0: 0xaabbccdd},
      asHex: true,
      testCases: [
        {bytes: 8, offset: 0, value: 0xaabbccdd},
        {bytes: 4, offset: 0, value: 0xaabbccdd},
        {bytes: 2, offset: 2, value: 0xaabb},
        {bytes: 2, offset: 0, value: 0xccdd},
        {bytes: 1, offset: 0, value: 0xdd},
        {bytes: 1, offset: 1, value: 0xcc},
        {bytes: 1, offset: 2, value: 0xbb},
        {bytes: 1, offset: 3, value: 0xaa},
      ],
    },
  ];

  for (const {nodeValue, testCases, asHex} of testCasesNode) {
    const leafNode = LeafNode.fromHashObject({h0: 0, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0, ...nodeValue});
    for (const {bytes, offset, value} of testCases) {
      it(`getUint, ${JSON.stringify(nodeValue)} bytes: ${bytes} offset: ${offset}`, () => {
        // Use the unsigned right shift operator. By default bitwise ops convert to signed 32 bit numbers.
        // Signed 32 bit numbers conver funky to hex.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift
        const res = leafNode.getUint(bytes, offset) >>> 0;
        if (asHex) {
          expect(res.toString(16)).to.equal(value.toString(16), `Wrong getUint(${bytes}, ${offset})`);
        } else {
          expect(res).to.equal(value, `Wrong getUint(${bytes}, ${offset})`);
        }
      });
    }
  }
});

// Ensure that bitshifting logic to manipulate single bytes is correct
describe("LeafNode single bytes", () => {
  const buf = Buffer.alloc(32, 0);
  for (let i = 0; i < 32; i++) {
    buf[i] = i + 1;
  }

  it("Write full root with setUint", () => {
    const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0));
    for (let i = 0; i < 32; i++) {
      leafNode.setUint(1, i, i + 1);
    }
    expect(Buffer.from(leafNode.root).toString("hex")).to.equal(buf.toString("hex"), "Wrong leafNode.root value");
  });

  it("Write full root with setUintBigint", () => {
    const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0));
    for (let i = 0; i < 32; i++) {
      leafNode.setUintBigint(1, i, BigInt(i + 1));
    }
    expect(Buffer.from(leafNode.root).toString("hex")).to.equal(buf.toString("hex"), "Wrong leafNode.root value");
  });

  it("Get full root with getUint", () => {
    const out = Buffer.alloc(32, 0);
    const leafNode = LeafNode.fromRoot(buf);
    for (let i = 0; i < 32; i++) {
      out[i] = leafNode.getUint(1, i);
    }
    expect(out.toString("hex")).to.equal(buf.toString("hex"), "Wrong out value");
  });

  it("Get full root with getUintBigint", () => {
    const out = Buffer.alloc(32, 0);
    const leafNode = LeafNode.fromRoot(buf);
    for (let i = 0; i < 32; i++) {
      out[i] = Number(leafNode.getUintBigint(1, i));
    }
    expect(out.toString("hex")).to.equal(buf.toString("hex"), "Wrong out value");
  });
});

describe("setUint getUint - all small values", () => {
  for (let bytes = 1; bytes <= 8; bytes *= 2) {
    const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0xff));

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
    const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0xff));

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
    const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0));

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
      const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0));

      for (let offset = 0; offset < 1; offset += bytes) {
        it(`setUint getUint value ${value} bytes ${bytes} offset ${offset}`, () => {
          leafNode.setUintBigint(bytes, offset, value);
          expect(leafNode.getUintBigint(bytes, offset)).to.equal(value);
        });
      }
    }
  }
});

describe("getUint with correct sign", () => {
  it("8 bytes", () => {
    const leafNodeUint = LeafNode.fromHashObject({
      h0: 3287189044,
      h1: 67237308,
      h2: 0,
      h3: 0,
      h4: 0,
      h5: 0,
      h6: 0,
      h7: 0,
    });

    const leafNodeInt = LeafNode.fromHashObject({
      h0: -1007778252,
      h1: 67237308,
      h2: 0,
      h3: 0,
      h4: 0,
      h5: 0,
      h6: 0,
      h7: 0,
    });

    expect(leafNodeUint.getUintBigint(8, 0)).to.equal(BigInt("288782042218268212"), "Wrong leafNodeUint.getUintBigint");
    expect(leafNodeInt.getUintBigint(8, 0)).to.equal(BigInt("288782042218268212"), "Wrong leafNodeInt.getUintBigint");
  });
});

describe("BranchNode basics", () => {
  it("should properly hash two leaves", () => {
    const leftRoot = Buffer.alloc(32, 1);
    const rightRoot = Buffer.alloc(32, 2);
    const root = hasher.digest64(leftRoot, rightRoot);

    const left = LeafNode.fromRoot(leftRoot);
    const right = LeafNode.fromRoot(rightRoot);
    const branch = new BranchNode(left, right);
    expect(branch.root).to.be.deep.equal(root);
  });
});
