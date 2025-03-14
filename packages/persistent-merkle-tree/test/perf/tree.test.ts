import {bench, describe} from "@chainsafe/benchmark";
import {
  LeafNode,
  Node,
  Tree,
  countToDepth,
  subtreeFillToContents,
  toGindex,
  toGindexBitstring,
  uint8ArrayToHashObject,
} from "../../src/index.js";

describe("Track the performance of different Tree methods", () => {
  const VALIDATOR_REGISTRY_LIMIT = 1099511627776;
  // add 1 to countToDepth for mix_in_length spec
  const depth = countToDepth(BigInt(Math.ceil(VALIDATOR_REGISTRY_LIMIT / 4))) + 1;

  const newRoot = new Uint8Array(Array.from({length: 32}, () => 1));
  const numBalance = 250_000;
  const index = Math.floor(125_000 / 4);
  const gindex = toGindex(depth, BigInt(index));
  const gindexBitstring = toGindexBitstring(depth, index);
  const newHashObject = uint8ArrayToHashObject(newRoot);
  const newNode = LeafNode.fromHashObject(newHashObject);

  const numLoop = 10_000;
  /** May need to run these tests separately to compare the performance */
  const tree = new Tree(createBalanceList(numBalance, depth));
  /** Using gindexBitstring is 5% faster than using gindex */
  bench("setRoot - gindexBitstring", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.setRoot(gindexBitstring, newRoot);
    }
  });

  bench("setRoot - gindex", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.setRoot(gindex, newRoot);
    }
  });

  /** Using gindexBitstring is 10% faster than using gindex */
  bench("getRoot - gindexBitstring", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.getRoot(gindexBitstring);
    }
  });

  bench("getRoot - gindex", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.getRoot(gindex);
    }
  });

  bench("getHashObject then setHashObject", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.getNode(gindex);
      tree.setNode(gindex, newNode);
    }
  });

  /* Double the speed compared to get then set */
  bench("setNodeWithFn", () => {
    const getNewNodeFn = (): Node => newNode;
    for (let i = 0; i < numLoop; i++) {
      tree.setNodeWithFn(gindex, getNewNodeFn);
    }
  });
});

function createBalanceList(count: number, depth: number): Node {
  // each balance has 2 bytes => each chunk contains 4 balance
  const numChunk = Math.ceil(count / 4);
  const nodes = new Array<Node>(numChunk);
  for (let i = 0; i < numChunk; i++) {
    nodes[i] = LeafNode.fromRoot(new Uint8Array(Array.from({length: 32}, () => i % 10)));
  }

  return subtreeFillToContents(nodes, depth);
}
