import {LeafNode, subtreeFillToContents, Node} from "@chainsafe/persistent-merkle-tree";
import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {List, ListType, Number64ListType, Number64UintType, NumberUintType, TreeBacked, Type} from "../../src";

describe("list", () => {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 20 * 1000,
    runs: 1000,
  });

  const numBalances = 250_000;

  const tbBalances = createBalanceList(numBalances, new NumberUintType({byteLength: 8}));
  const tbBalances64 = createBalanceList(numBalances, new Number64UintType());
  // access balances list   1.296884 ops/s    771.0793 ms/op        -         38 runs   30.1 s
  itBench("NumberUintType - get balances list", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances[i];
    }
  });

  // using Number64UintType gives 20% improvement
  itBench("Number64UintType - get balances list", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances64[i];
    }
  });

  itBench("NumberUintType - set balances list", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances[i] = 31217089836;
    }
  });

  // using Number64UintType gives 2% - 10% improvement
  itBench("Number64UintType - set balances list", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances64[i] = 31217089836;
    }
  });

  itBench("Number64UintType - get and increase 10 then set", () => {
    const tbBalance = tbBalances64.clone();
    for (let i = 0; i < numBalances; i++) {
      tbBalance[i] += 10;
    }
  });

  // using applyDelta gives 4x improvement to get and set
  // 2.7x improvement compared to set only
  itBench("Number64UintType - increase 10 using applyDelta", () => {
    const basicArrayType = tbBalances64.type as Number64ListType;
    const tree = tbBalances64.tree.clone();
    for (let i = 0; i < numBalances; i++) {
      basicArrayType.tree_applyDeltaAtIndex(tree, i, 10);
    }
  });

  const deltaByIndex = new Map<number, number>();
  for (let i = 0; i < numBalances; i++) {
    deltaByIndex.set(i, 10);
  }
  // same performance to tree_applyUint64Delta, should be a little faster
  // if it operates on a subtree with hook
  itBench("Number64UintType - increase 10 using applyDeltaInBatch", () => {
    const basicArrayType = tbBalances64.type as Number64ListType;
    const tree = tbBalances64.tree.clone();
    basicArrayType.tree_applyDeltaInBatch(tree, deltaByIndex);
  });
});

describe("subtreeFillToContents", function () {
  setBenchOpts({
    maxMs: 60 * 1000,
    minMs: 40 * 1000,
    runs: 500,
  });

  const numBalances = 250_000;

  const tbBalances64 = createBalanceList(numBalances, new Number64UintType());
  const delta = 100;
  const deltas = Array.from({length: numBalances}, () => delta);
  const tree = tbBalances64.tree;
  const type = tbBalances64.type as Number64ListType;

  /** tree_newTreeFromUint64Deltas is 17% faster than unsafeUint8ArrayToTree */
  /** ✓ tree_newTreeFromUint64Deltas    28.72705 ops/s    34.81040 ms/op        -       1149 runs   40.0 s */
  itBench("tree_newTreeFromUint64Deltas", () => {
    type.tree_newTreeFromDeltas(tree, deltas);
  });

  const newBalances = new BigUint64Array(numBalances);
  const cachedBalances64: number[] = [];
  for (let i = 0; i < tbBalances64.length; i++) {
    cachedBalances64.push(tbBalances64[i]);
  }
  /** ✓ unsafeUint8ArrayToTree    24.51560 ops/s    40.79035 ms/op        -        981 runs   40.0 s */
  itBench("unsafeUint8ArrayToTree", () => {
    for (let i = 0; i < numBalances; i++) {
      newBalances[i] = BigInt(cachedBalances64[i] + deltas[i]);
    }
    unsafeUint8ArrayToTree(
      new Uint8Array(newBalances.buffer, newBalances.byteOffset, newBalances.byteLength),
      type.getChunkDepth()
    );
  });
});

function createBalanceList(count: number, elementType: Type<number>): TreeBacked<List<number>> {
  const VALIDATOR_REGISTRY_LIMIT = 1099511627776;

  const balancesList = new ListType({
    elementType,
    limit: VALIDATOR_REGISTRY_LIMIT,
  });
  const balancesStruct = Array.from({length: count}, () => 31217089836);
  return balancesList.createTreeBackedFromStruct(balancesStruct);
}

function unsafeUint8ArrayToTree(data: Uint8Array, depth: number): Node {
  const leaves: LeafNode[] = [];

  // Loop 32 bytes at a time, creating leaves from the backing subarray
  const maxStartIndex = data.length - 31;
  for (let i = 0; i < maxStartIndex; i += 32) {
    leaves.push(new LeafNode(data.subarray(i, i + 32)));
  }

  // If there is any extra data at the end (less than 32 bytes), append a final leaf
  const lengthMod32 = data.length % 32;
  if (lengthMod32 !== 0) {
    const finalChunk = new Uint8Array(32);
    finalChunk.set(data.subarray(data.length - lengthMod32));
    leaves.push(new LeafNode(finalChunk));
  }

  return subtreeFillToContents(leaves, depth);
}
