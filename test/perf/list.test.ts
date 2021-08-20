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

  // using applyDelta gives 70% - 100% improvement
  itBench("Number64UintType - increase 10 using applyDelta", () => {
    const basicArrayType = tbBalances64.type as Number64ListType;
    const tree = tbBalances64.tree.clone();
    for (let i = 0; i < numBalances; i++) {
      basicArrayType.tree_applyUint64Delta(tree, i, 10);
    }
  });
});

describe("subtreeFillToContents", function () {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 20 * 1000,
    runs: 100,
  });

  const numBalances = 250_000;

  const tbBalances64 = createBalanceList(numBalances, new Number64UintType());
  const delta = 100;
  const deltas = Array.from({length: numBalances}, () => delta);
  const tree = tbBalances64.tree;
  const type = tbBalances64.type as Number64ListType;

  /** tree_newTreeFromUint64Deltas is 20x faster than unsafeUint8ArrayToTree */
  itBench("tree_newTreeFromUint64Deltas", () => {
    type.tree_newTreeFromUint64Deltas(tree, deltas);
  });

  itBench("unsafeUint8ArrayToTree", () => {
    const newBalances = new BigUint64Array(numBalances);
    for (let i = 0; i < numBalances; i++) {
      newBalances[i] = BigInt(tbBalances64[i] + deltas[i]);
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
