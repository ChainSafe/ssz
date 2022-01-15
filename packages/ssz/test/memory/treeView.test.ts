import {LeafNode, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {MutableVector} from "@chainsafe/persistent-ts";
import {testRunnerMemory} from "./testRunnerMemory";

// Results in Linux Dec 2021
//
// Array         - 2056341.5 bytes / instance
// MutableVector - 3651032.8 bytes / instance
// Tree          - 26005073.0 bytes / instance
//
// Mutations
//
// Arrays        cloned x2 100%    - 1108445.2 bytes / instance
// MutableVector cloned x2 0%      - 913630.6 bytes / instance
// MutableVector cloned x2 0.2%    - 979925.1 bytes / instance
// MutableVector cloned x2 3.125%  - 1609173.8 bytes / instance
// Arrays        cloned x4 100%    - 2110825.9 bytes / instance
// MutableVector cloned x4 0%      - 913925.8 bytes / instance
// MutableVector cloned x4 0.2%    - 1108659.1 bytes / instance
// MutableVector cloned x4 3.125%  - 2996949.6 bytes / instance
// Arrays        cloned x8 100%    - 4111017.9 bytes / instance
// MutableVector cloned x8 0%      - 914093.6 bytes / instance
// MutableVector cloned x8 0.2%    - 1367163.2 bytes / instance
// MutableVector cloned x8 3.125%  - 5774389.6 bytes / instance
// Arrays        cloned x16 100%   - 8111401.9 bytes / instance
// MutableVector cloned x16 0%     - 914349.6 bytes / instance
// MutableVector cloned x16 0.2%   - 1891177.6 bytes / instance
// MutableVector cloned x16 3.125% - 11329269.6 bytes / instance
// Arrays        cloned x32 100%   - 16112385.9 bytes / instance
// MutableVector cloned x32 0%     - 915077.6 bytes / instance
// MutableVector cloned x32 0.2%   - 2933555.5 bytes / instance
// MutableVector cloned x32 3.125% - 22439245.6 bytes / instance

// Mainnet numbers for balances
const len = 250_000 / 4;
const depth = 40 - 2;

const testCases: TestCase[] = [
  {id: "Array", getInstance: () => createArray(len)},
  {id: "MutableVector", getInstance: () => createMutableVector(len)},
  {id: "Tree", getInstance: () => createTree(depth, len)},
];

// Mutations

for (let count = 2; count <= 32; count *= 2) {
  testCases.push({
    id: `Arrays        cloned x${count} 100%`,
    getInstance: () => createClonedMutedArrays(len, count),
  });

  for (const fractionChanged of [
    0,
    500 / 250_000, // Sync committees
    1 / 32, // slot attesters
  ]) {
    testCases.push({
      id: `MutableVector cloned x${count} ${100 * fractionChanged}%`,
      getInstance: () => createClonedMutedMutableVectors(len, count, fractionChanged),
    });
  }
}

testRunnerMemoryBpi(testCases);

type TestCase = {
  getInstance: (bytes: number) => unknown;
  id: string;
};

/**
 * Test bytes per instance in different representations of raw binary data
 */
function testRunnerMemoryBpi(testCases: TestCase[]): void {
  const longestId = Math.max(...testCases.map(({id}) => id.length));

  for (const {id, getInstance} of testCases) {
    const bpi = testRunnerMemory({
      getInstance,
      sampleEvery: 5,
      convergeFactor: 0.2 / 100,
    });

    // eslint-disable-next-line no-console
    console.log(`${id.padEnd(longestId)} - ${bpi.toFixed(1)} bytes / instance`);
  }
}

function createArray(len: number): number[] {
  const items: number[] = [];
  for (let i = 0; i < len; i++) {
    items.push(i);
  }
  return items;
}

function createMutableVector(len: number): MutableVector<number> {
  const items = createArray(len);
  return MutableVector.from(items);
}

function createTree(depth: number, len: number): Tree {
  const leaf = LeafNode.fromRoot(Buffer.alloc(32, 1));
  const startIndex = BigInt(2 ** depth);
  const tree = new Tree(zeroNode(depth));
  for (let i = BigInt(0), nB = BigInt(len); i < nB; i++) {
    tree.setNode(startIndex + i, leaf);
  }
  return tree;
}

function createClonedMutedArrays(len: number, count: number): number[][] {
  const arrArr = [createArray(len)];

  for (let i = 1; i < count; i++) {
    const arrPrev = arrArr[i - 1];
    const arrNew = [...arrPrev];

    // No need to mutate some numbers, the memory cost is the same

    arrArr.push(arrNew);
  }
  return arrArr;
}

function createClonedMutedMutableVectors(len: number, count: number, fractionChanged: number): MutableVector<number>[] {
  const changeOneEvery = Math.floor(1 / fractionChanged);
  const arrArr = [createMutableVector(len)];

  for (let i = 1; i < count; i++) {
    const arrPrev = arrArr[i - 1];
    const arrNew = arrPrev.clone();

    if (fractionChanged > 0) {
      for (let i = 0; i < len; i += changeOneEvery) {
        arrNew.set(i, (arrNew.get(i) ?? 0) + 1);
      }
    }

    arrArr.push(arrNew);
  }
  return arrArr;
}
