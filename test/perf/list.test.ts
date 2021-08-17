import { itBench, setBenchOpts } from "@dapplion/benchmark";
import { List, ListType, NumberUintType } from "../../src";


describe("list", () => {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 20 * 1000,
    runs: 1000,
  });

  const numBalances = 250_000;
  const tbBalances = createBalanceList(numBalances);
  // access balances list                                                1.296884 ops/s    771.0793 ms/op        -         38 runs   30.1 s
  itBench("get balances list", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances[i];
    }
  });

  itBench("set balances list", () => {
    for (let i = 0; i < numBalances; i++) {
      tbBalances[i] = 31217089836;
    }
  });
});

function createBalanceList(count: number): List<number> {
  const VALIDATOR_REGISTRY_LIMIT = 1099511627776;

  const balancesList = new ListType({
    elementType: new NumberUintType({byteLength: 8}),
    limit: VALIDATOR_REGISTRY_LIMIT,
  });
  const balancesStruct = Array.from({length: count}, () => 31217089836);
  return balancesList.createTreeBackedFromStruct(balancesStruct);
}
