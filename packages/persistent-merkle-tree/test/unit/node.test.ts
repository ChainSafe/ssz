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
        const res = leafNode.getUint(bytes, offset);
        if (asHex) {
          expect(res.toString(16)).to.equal(value.toString(16), `Wrong getUint(${bytes}, ${offset})`);
        } else {
          expect(res).to.equal(value, `Wrong getUint(${bytes}, ${offset})`);
        }
      }
    });
  }
});
