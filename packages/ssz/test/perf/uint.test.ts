import {itBench} from "@dapplion/benchmark";
import {ContainerType, UintNumberType, UintBigintType} from "../../src";

describe("Uint64 types", () => {
  const ContainerNumber = new ContainerType({
    slot: new UintNumberType(8),
  });

  const ContainerBigint = new ContainerType({
    slot: new UintBigintType(8),
  });

  type IBeaconState = {
    slot: number;
  };

  const numLoop = 1_000_000;

  itBench(`struct - increase slot to ${numLoop}`, () => {
    const state: IBeaconState = {
      slot: 0,
    };
    for (let i = 0; i < numLoop; i++) {
      state.slot++;
    }
  });

  itBench(`UintNumberType - increase slot to ${numLoop}`, () => {
    const tbState = ContainerNumber.toViewDU({slot: 0});
    for (let i = 0; i < numLoop; i++) {
      tbState.slot++;
    }
  });

  itBench(`UintBigintType - increase slot to ${numLoop}`, () => {
    const tbState = ContainerBigint.toViewDU({slot: BigInt(0)});
    for (let i = 0; i < numLoop; i++) {
      tbState.slot++;
    }
  });
});
