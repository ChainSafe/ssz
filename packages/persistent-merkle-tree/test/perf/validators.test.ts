import {itBench} from "@dapplion/benchmark";
import {BranchNode, LeafNode, subtreeFillToContents, Node, countToDepth} from "../../src";
import {MemoryTracker} from "../utils/memTracker";

describe("Track the performance of validators", () => {
  if (global.gc) {
    global.gc();
  }

  const tracker = new MemoryTracker();
  tracker.logDiff("Start");
  const node = createValidatorList(250_000);
  tracker.logDiff("Create validator tree");
  node.root;
  tracker.logDiff("Calculate tree root");

  itBench({
    id: "250k validators",
    beforeEach: () => {
      resetNodes(node);
      return node;
    },
    fn: (node) => {
      node.root;
    },
  });
});

function resetNodes(node: Node): void {
  if (node.isLeaf()) return;
  // this is to ask Node to calculate node again
  node.h0 = null as unknown as number;
  // in the old version, we should do
  // node._root = null;
  resetNodes(node.left);
  resetNodes(node.right);
}

function createValidator(i: number): Node {
  const nodes: Node[] = [];
  // pubkey, 48 bytes => 2 nodes
  const pubkeyNode1 = newLeafNodeFilled(i);
  const pubkeyNode2 = newLeafNodeFilled(i);
  nodes.push(new BranchNode(pubkeyNode1, pubkeyNode2));
  // withdrawalCredentials, 32 bytes => 1 node
  nodes.push(newLeafNodeFilled(i));
  // effectiveBalance, 8 bytes => 1 node
  nodes.push(newLeafNodeFilled(i));
  // slashed => 1 node
  nodes.push(LeafNode.fromRoot(new Uint8Array(32)));
  // 4 epoch nodes, 8 bytes => 1 node
  nodes.push(newLeafNodeFilled(i));
  nodes.push(newLeafNodeFilled(i));
  nodes.push(newLeafNodeFilled(i));
  nodes.push(newLeafNodeFilled(i));

  return subtreeFillToContents(nodes, countToDepth(BigInt(nodes.length)));
}

function createValidatorList(numValidator: number): Node {
  const validators = Array.from({length: numValidator}, (_, i) => createValidator(i));
  // add 1 to countToDepth for mix_in_length spec
  return subtreeFillToContents(validators, countToDepth(BigInt(numValidator)) + 1);
}

function newLeafNodeFilled(i: number): LeafNode {
  return LeafNode.fromRoot(new Uint8Array(Array.from({length: 32}, () => i % 10)));
}
