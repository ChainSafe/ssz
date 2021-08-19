import { itBench, setBenchOpts } from "@dapplion/benchmark";
import { LeafNode, subtreeFillToContents, Node, countToDepth, Tree, toGindex, uint8ArrayToHashObject, toGindexBitstring } from "../../src";

describe("Track the performance of different Tree methods", () => {
  setBenchOpts({
    maxMs: 60 * 1000,
    minMs: 30 * 1000,
    runs: 10,
  });

  const VALIDATOR_REGISTRY_LIMIT = 1099511627776;
  // add 1 to countToDepth for mix_in_length spec
  const depth = countToDepth(BigInt(Math.ceil(VALIDATOR_REGISTRY_LIMIT / 4))) + 1;

  const newRoot = new Uint8Array(Array.from({length: 32}, () => 1));
  const numBalance = 250_000;
  const index = Math.floor(125_000 / 4);
  const gindex = toGindex(depth, BigInt(index));
  const gindexBitstring = toGindexBitstring(depth, index);
  const newHashObject = uint8ArrayToHashObject(newRoot);

  const numLoop = 10_000;
  /** May need to run these tests separately to compare the performance */
  const tree = new Tree(createBalanceList(numBalance, depth));
  /** Using gindexBitstring is 5% faster than using gindex */
  itBench("setRoot - gindexBitstring", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.setRoot(gindexBitstring, newRoot);
    }
  });

  itBench("setRoot - gindex", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.setRoot(gindex, newRoot);
    }
  });

  /** Using gindexBitstring is 10% faster than using gindex */
  itBench("getRoot - gindexBitstring", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.getRoot(gindexBitstring);
    }
  });

  itBench("getRoot - gindex", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.getRoot(gindex);
    }
  });

  // 5% faster than getRoot
  itBench("getHashObject - gindex", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.getHashObject(gindex);
    }
  });

  // 15% faster than setRoot
  itBench("setHashObject - gindex", () => {
    for (let i = 0; i < numLoop; i++) {
      tree.setHashObject(gindex, newHashObject);
    }
  });

});

function createBalanceList(count: number, depth: number): Node {
  // each balance has 2 bytes => each chunk contains 4 balance
  const numChunk = Math.ceil(count / 4);
  const nodes: Node[] = [];
  for (let i = 0; i < numChunk; i++) {
    nodes.push(new LeafNode(new Uint8Array(Array.from({length: 32}, () => (i % 10)))));
  }

  return subtreeFillToContents(nodes, depth);
}
