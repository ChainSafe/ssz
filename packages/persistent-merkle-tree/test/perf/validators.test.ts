import {bench, describe, setBenchOpts} from "@chainsafe/benchmark";
import {LeafNode, subtreeFillToContents, Node, countToDepth, zeroNode, getHashComputations} from "../../src/index.js";
import {MemoryTracker} from "../utils/memTracker.js";
import {batchHash} from "../utils/batchHash.js";

/**
 * Below is measured on Mac M1.
 * It takes less than 10% of the original hashTreeRoot() time to traverse the tree.
 * The remaining time depends on how better is the batch hash.
 * Below it shows: `batchHash = 101ms + 0.81 * hash` where 101ms is the time to traverse and precompute hash computations by level
 *   Track the performance of validators
    ✓ 1600000 validators root getter                                     0.8134348 ops/s    1.229355  s/op        -         12 runs   16.4 s
    ✓ 1600000 validators batchHash()                                     0.9135884 ops/s    1.094585  s/op        -         13 runs   15.8 s
    ✓ 1600000 validators hashComputations                                 9.857173 ops/s    101.4490 ms/op        -         17 runs   2.90 s

 * Refer to SIMD, it shows `batchHash = 0.81 * hash`
      digest64 vs hash4Inputs vs hash8HashObjects
    ✓ digest64 50023 times                                                27.09631 ops/s    36.90539 ms/op        -        259 runs   10.1 s
    ✓ hash 200092 times using hash4Inputs                                 8.393366 ops/s    119.1417 ms/op        -         81 runs   10.2 s
    ✓ hash 200092 times using hash8HashObjects                            8.433091 ops/s    118.5805 ms/op        -         81 runs   10.2 s
 */
describe("Track the performance of validators", () => {
  setBenchOpts({
    maxMs: 2 * 60 * 1000,
  });
  if (global.gc) {
    global.gc();
  }

  const tracker = new MemoryTracker();
  tracker.logDiff("Start");
  const vc = 250_000;
  // see createValidatorList
  const depth = countToDepth(BigInt(vc)) + 1;
  // cache roots of zero nodes
  zeroNode(depth).root;
  const node = createValidatorList(vc);
  tracker.logDiff("Create validator tree");
  node.root;
  tracker.logDiff("Calculate tree root");

  bench({
    id: `${vc} validators root getter`,
    beforeEach: () => {
      resetNodes(node, depth);
      return node;
    },
    fn: (node) => {
      node.root;
    },
  });

  bench({
    id: `${vc} validators batchHash()`,
    beforeEach: () => {
      resetNodes(node, depth);
      return node;
    },
    fn: (node) => {
      batchHash(node);
    },
  });

  bench({
    id: `${vc} validators hashComputations`,
    beforeEach: () => {
      resetNodes(node, depth);
      return node;
    },
    fn: (node) => {
      getHashComputations(node, 0, []);
    },
  });
});

function resetNodes(node: Node, depth: number): void {
  if (node.isLeaf()) return;
  // do not reset zeroNode
  if (node === zeroNode(depth)) return;
  // this is to ask Node to calculate node again
  node.h0 = null as unknown as number;
  resetNodes(node.left, depth - 1);
  resetNodes(node.right, depth - 1);
}

function createValidator(i: number): Node {
  return newLeafNodeFilled(i);
}

function createValidatorList(numValidator: number): Node {
  const validators = Array.from({length: numValidator}, (_, i) => createValidator(i));
  // add 1 to countToDepth for mix_in_length spec
  const depth = countToDepth(BigInt(numValidator)) + 1;
  const rootNode = subtreeFillToContents(validators, depth);
  return rootNode;
}

function newLeafNodeFilled(i: number): LeafNode {
  return LeafNode.fromRoot(new Uint8Array(Array.from({length: 32}, () => i % 10)));
}
