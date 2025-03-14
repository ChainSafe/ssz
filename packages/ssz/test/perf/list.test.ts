import {LeafNode, subtreeFillToContents, Node} from "@chainsafe/persistent-merkle-tree";
import {describe, bench} from "@chainsafe/benchmark";
import {UintNumberType, ListBasicType} from "../../src/index.js";

describe("list", () => {
  const numBalances = 250_000;

  const tbBalances = createBalanceList(numBalances);

  // using Number64UintType gives 20% improvement
  bench("Number64UintType - get balances list", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances.get(i);
    }
  });

  // using Number64UintType gives 2% - 10% improvement
  bench("Number64UintType - set balances list", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances.set(i, 31217089836);
    }
  });

  bench("Number64UintType - get and increase 10 then set", () => {
    const tbBalance = tbBalances.clone();
    for (let i = 0; i < numBalances; i++) {
      tbBalance.set(i, 10 + tbBalances.get(i));
    }
  });

  // using applyDelta gives 4x improvement to get and set
  // 2.7x improvement compared to set only
  bench("Number64UintType - increase 10 using applyDelta", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances.set(i, 10 + tbBalances.get(i));
    }
  });

  const deltaByIndex = new Map<number, number>();
  for (let i = 0; i < numBalances; i++) {
    deltaByIndex.set(i, 10);
  }

  // same performance to tree_applyUint64Delta, should be a little faster
  // if it operates on a subtree with hook
  bench("Number64UintType - increase 10 using applyDeltaInBatch", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances.set(i, 10 + tbBalances.get(i));
    }
  });
});

describe("subtreeFillToContents", function () {
  const numBalances = 250_000;

  const tbBalances64 = createBalanceList(numBalances);
  const delta = 100;
  const deltas = Array.from({length: numBalances}, () => delta);

  /** tree_newTreeFromUint64Deltas is 17% faster than unsafeUint8ArrayToTree */
  /** ✓ tree_newTreeFromUint64Deltas    28.72705 ops/s    34.81040 ms/op        -       1149 runs   40.0 s */
  bench("tree_newTreeFromUint64Deltas", () => {
    const balances = tbBalances64.getAll();
    for (let i = 0, len = deltas.length; i < len; i++) {
      balances[i] += deltas[i];
    }
    tbBalances64.type.toViewDU(balances as number[]);
  });

  const newBalances = new BigUint64Array(numBalances);
  const cachedBalances64 = tbBalances64.getAll();

  /** ✓ unsafeUint8ArrayToTree    24.51560 ops/s    40.79035 ms/op        -        981 runs   40.0 s */
  bench("unsafeUint8ArrayToTree", () => {
    for (let i = 0; i < numBalances; i++) {
      newBalances[i] = BigInt(cachedBalances64[i] + deltas[i]);
    }
    unsafeUint8ArrayToTree(
      new Uint8Array(newBalances.buffer, newBalances.byteOffset, newBalances.byteLength),
      tbBalances64.type["chunkDepth"]
    );
  });
});


function createBalanceList(count: number) {
  const VALIDATOR_REGISTRY_LIMIT = 1099511627776;

  const balancesList = new ListBasicType(new UintNumberType(8), VALIDATOR_REGISTRY_LIMIT);
  const balancesStruct = Array.from({length: count}, () => 31217089836);
  const viewDU = balancesList.toViewDU(balancesStruct);
  // Prime cache
  viewDU.getAll();
  return viewDU;
}

function unsafeUint8ArrayToTree(data: Uint8Array, depth: number): Node {
  const leaves: LeafNode[] = [];

  // Loop 32 bytes at a time, creating leaves from the backing subarray
  const maxStartIndex = data.length - 31;
  for (let i = 0; i < maxStartIndex; i += 32) {
    leaves.push(LeafNode.fromRoot(data.subarray(i, i + 32)));
  }

  // If there is any extra data at the end (less than 32 bytes), append a final leaf
  const lengthMod32 = data.length % 32;
  if (lengthMod32 !== 0) {
    const finalChunk = new Uint8Array(32);
    finalChunk.set(data.subarray(data.length - lengthMod32));
    leaves.push(LeafNode.fromRoot(finalChunk));
  }

  return subtreeFillToContents(leaves, depth);
}
