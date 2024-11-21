import {expect} from "chai";
import {bitLength, maxChunksToDepth, merkleize, mixInLength, nextPowerOf2} from "../../src/util/merkleize";
import {merkleizeBlocksBytes, LeafNode, zeroHash} from "@chainsafe/persistent-merkle-tree";

describe("util / merkleize / bitLength", () => {
  const bitLengthByIndex = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4];

  for (let n = 0; n < bitLengthByIndex.length; n++) {
    it(`bitLength(${n})`, () => {
      expect(bitLength(n)).to.equal(bitLengthByIndex[n]);
    });
  }
});

describe("util / merkleize / maxChunksToDepth", () => {
  const results = [0, 0, 1, 2, 2, 3, 3, 3, 3, 4];

  for (let i = 0; i < results.length; i++) {
    it(`maxChunksToDepth(${i})`, () => {
      expect(maxChunksToDepth(i)).to.equal(results[i]);
    });
  }
});

describe("util / merkleize / nextPowerOf2", () => {
  const results = [1, 1, 2, 4, 4, 8, 8, 8, 8, 16];

  for (let i = 0; i < results.length; i++) {
    it(`nextPowerOf2(${i})`, () => {
      expect(nextPowerOf2(i)).to.equal(results[i]);
    });
  }
});

describe("util / merkleize / mixInLength", () => {
  const root = Buffer.alloc(32, 1);
  const lengths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (const length of lengths) {
    it(`mixInLength(${length})`, () => {
      const mixInLengthBuffer = Buffer.alloc(64);
      mixInLengthBuffer.set(root, 0);
      mixInLengthBuffer.writeUIntLE(length, 32, 6);
      const finalRoot = new Uint8Array(32);
      merkleizeBlocksBytes(mixInLengthBuffer, 2, finalRoot, 0);
      const expectedRoot = mixInLength(root, length);
      expect(finalRoot).to.be.deep.equal(expectedRoot);
    });
  }
});

describe("merkleize should be equal to merkleizeInto of hasher", () => {
  const numNodes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (const numNode of numNodes) {
    it(`merkleize for ${numNode} nodes`, () => {
      const nodes = Array.from({length: numNode}, (_, i) => LeafNode.fromRoot(Buffer.alloc(32, i)));
      const data = Buffer.concat(nodes.map((node) => node.root));
      const padData = numNode % 2 === 1 ? Buffer.concat([data, zeroHash(0)]) : data;
      const roots = nodes.map((node) => node.root);
      const expectedRoot = Buffer.alloc(32);
      const chunkCount = Math.max(numNode, 1);
      merkleizeBlocksBytes(padData, chunkCount, expectedRoot, 0);
      expect(merkleize(roots, chunkCount)).to.be.deep.equal(expectedRoot);
    });
  }
});
