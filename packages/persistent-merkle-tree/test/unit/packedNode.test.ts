import {HashObject} from "@chainsafe/as-sha256";
import {expect} from "chai";
import {LeafNode, Node} from "../../src";
import {packedNodeRootsToBytes, packedRootsBytesToLeafNodes} from "../../src/packedNode";

describe("subtree / packedNode single node", () => {
  const testCases: {
    id: string;
    size: number;
    nodes: Node[];
    outStr: string;
  }[] = [
    {
      id: "One byte",
      size: 1,
      nodes: [new LeafNode({h0: 0x07, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0})],
      outStr: "0x07",
    },
    {
      id: "Two bytes",
      size: 2,
      nodes: [new LeafNode({h0: 0x0708, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0})],
      outStr: "0x0807",
    },
    {
      id: "Three bytes",
      size: 3,
      nodes: [new LeafNode({h0: 0x070809, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0})],
      outStr: "0x090807",
    },
    {
      id: "Four bytes",
      size: 4,
      nodes: [new LeafNode({h0: 0x0708090a, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0})],
      outStr: "0x0a090807",
    },
    {
      id: "Odd last bytes",
      size: 31,
      nodes: [new LeafNode({h0: 0x0102, h1: 0x0304, h2: 0, h3: 0, h4: 0x0102, h5: 0x0304, h6: 0, h7: 0x0d0e0f})],
      outStr: "0x020100000403000000000000000000000201000004030000000000000f0e0d",
    },
    {
      id: "2 h values",
      size: 8,
      nodes: [new LeafNode({h0: 0x0708090a, h1: 0x01020304, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0})],
      outStr: "0x0a09080704030201",
    },
    {
      id: "32 bytes zero",
      size: 32,
      nodes: [new LeafNode({h0: 0, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0})],
      outStr: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "32 bytes same",
      size: 32,
      nodes: [new LeafNode(Buffer.alloc(32, 0xdd))],
      outStr: "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
    },
    {
      id: "32 bytes random",
      size: 32,
      nodes: [
        new LeafNode({
          h0: 928805656,
          h1: 695963229,
          h2: 4049923874,
          h3: 2584465765,
          h4: 842993870,
          h5: 2733647718,
          h6: 2699562781,
          h7: 1073247141,
        }),
      ],
      outStr: "0x18735c375d8e7b2922ef64f165d10b9ace103f326627f0a21d0fe8a0a573f83f",
    },
  ];

  for (const {id, size, nodes, outStr} of testCases) {
    it(`${id} - packedNodeRootsToBytes`, () => {
      const uint8Array = new Uint8Array(size);
      const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
      packedNodeRootsToBytes(dataView, 0, size, nodes);
      expect("0x" + Buffer.from(uint8Array).toString("hex")).to.equal(outStr);
    });

    it(`${id} - packedRootsBytesToLeafNodes`, () => {
      const uint8Array = new Uint8Array(Buffer.from(outStr.replace("0x", ""), "hex"));
      const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
      const nodesRes = packedRootsBytesToLeafNodes(dataView, 0, size);
      expect(onlyHashObject(nodesRes[0].rootHashObject)).to.deep.equal(onlyHashObject(nodes[0].rootHashObject));
    });
  }
});

function onlyHashObject(rootHashObject: HashObject): HashObject {
  return {
    h0: rootHashObject.h0 >>> 0, // Force unsigned integer for equal comparision
    h1: rootHashObject.h1 >>> 0,
    h2: rootHashObject.h2 >>> 0,
    h3: rootHashObject.h3 >>> 0,
    h4: rootHashObject.h4 >>> 0,
    h5: rootHashObject.h5 >>> 0,
    h6: rootHashObject.h6 >>> 0,
    h7: rootHashObject.h7 >>> 0,
  };
}
