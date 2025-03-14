import {bench, describe} from "@chainsafe/benchmark";
import {Node} from "../../src/node.js";
import {packedRootsBytesToLeafNodes} from "../../src/packedNode.js";
import {subtreeFillToContents} from "../../src/subtree.js";
import {zeroNode} from "../../src/zeroNode.js";

describe("packedRootsBytesToLeafNodes", () => {
  const bytes = 4 * 1000;

  for (let offset = 0; offset < 4; offset++) {
    const start = offset;
    const end = start + bytes;

    const data = new Uint8Array(bytes + offset);
    const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
    data.set(Buffer.alloc(bytes, 0xdd));

    bench(`packedRootsBytesToLeafNodes bytes ${bytes} offset ${offset} `, () => {
      packedRootsBytesToLeafNodes(dataView, start, end);
    });
  }
});

describe("subtreeFillToContents", () => {
  const depth = 40;
  const nodesCount = 250_000;

  bench({
    id: `subtreeFillToContents depth ${depth} count ${nodesCount}`,
    beforeEach: () => getNodesArray(nodesCount),
    fn: (nodes) => {
      subtreeFillToContents(nodes, depth);
    },
  });
});

function getNodesArray(len: number): Node[] {
  const nodes = new Array<Node>(len);
  for (let i = 0; i < len; i++) {
    nodes[i] = zeroNode(0);
  }
  return nodes;
}
