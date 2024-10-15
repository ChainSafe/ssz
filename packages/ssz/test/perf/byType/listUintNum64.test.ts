import {itBench} from "@dapplion/benchmark";
import {ListUintNum64Type} from "../../../src/type/listUintNum64";

describe("ListUintNum64Type.toViewDU", () => {
  const balancesType = new ListUintNum64Type(1099511627776);
  const seedLength = 1_900_000;
  const seedViewDU = balancesType.toViewDU(Array.from({length: seedLength}, () => 0));

  const vc = 2_000_000;
  const value = Array.from({length: vc}, (_, i) => 32 * 1e9 + i);

  itBench({
    id: `ListUintNum64Type.toViewDU ${seedLength} -> ${vc}`,
    fn: () => {
      balancesType.toViewDU(value, seedViewDU);
    },
  });

  itBench({
    id: "ListUintNum64Type.toViewDU()",
    fn: () => {
      balancesType.toViewDU(value);
    },
  });
});
