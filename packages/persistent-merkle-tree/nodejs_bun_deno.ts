import { LeafNode, subtreeFillToContents, Node, toGindex } from "./src";
import { Tree, setNodesAtDepth } from "./src/tree";

/**
 * Bun `bun ./nodejs_bun_deno.ts`: Time taken to modify 100000 per 2000000: 4.727 ms
 * NodeJS `tsx ./nodejs_bun_deno.ts`: Time taken to modify 100000 per 2000000: 23.86 ms
 * Deno `deno --allow-env --unstable-sloppy-imports ./nodejs_bun_deno.ts`: Time taken to modify 100000 per 2000000: 15.889 ms
 */
const vc = 2_000_000;
const vcRegistryLimit = 1099511627776;
const depth = maxChunksToDepth(vcRegistryLimit);

let tree: Tree;
const initialNode = LeafNode.fromRoot(new Uint8Array(32).fill(0xaa));
const changedNode = LeafNode.fromRoot(new Uint8Array(32).fill(0xbb));

const initialNodes = new Array<Node>(vc);
for (let i = 0; i < vc; i++) {
  initialNodes[i] = initialNode;
}

tree = new Tree(subtreeFillToContents(initialNodes, depth));

const numChangedNodes = 100_000;
const indexesSet = new Set<number>();
for (let i = 0; i < numChangedNodes; i++) {
  indexesSet.add(i * 2);
}

// New data to add to tree with setNodes()
const indexes: number[] = [];
const nodes: Node[] = [];
const gindexes: bigint[] = [];

for (const index of indexesSet) {
  indexes.push(index);
  nodes.push(changedNode);
  gindexes.push(toGindex(depth, BigInt(index)));
}

const start = Date.now();
const runsFactor = 1000;
for (let i = 0; i < runsFactor; i++) {
  setNodesAtDepth(tree.rootNode, depth, indexes, nodes);
}
console.log(`Time taken to modify ${numChangedNodes} per ${vc}:`, (Date.now() - start) / runsFactor, "ms");

export function maxChunksToDepth(n: number): number {
  if (n === 0) return 0;
  return Math.ceil(Math.log2(n));
}