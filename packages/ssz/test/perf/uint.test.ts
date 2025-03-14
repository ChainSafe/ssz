import {bench, describe} from "@chainsafe/benchmark";
import {ContainerType, UintBigintType, UintNumberType} from "../../src/index.js";

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

  bench(`struct - increase slot to ${numLoop}`, () => {
    const state: IBeaconState = {
      slot: 0,
    };
    for (let i = 0; i < numLoop; i++) {
      state.slot++;
    }
  });

  bench(`UintNumberType - increase slot to ${numLoop}`, () => {
    const tbState = ContainerNumber.toViewDU({slot: 0});
    for (let i = 0; i < numLoop; i++) {
      tbState.slot++;
    }
  });

  bench(`UintBigintType - increase slot to ${numLoop}`, () => {
    const tbState = ContainerBigint.toViewDU({slot: BigInt(0)});
    for (let i = 0; i < numLoop; i++) {
      tbState.slot++;
    }
  });
});
