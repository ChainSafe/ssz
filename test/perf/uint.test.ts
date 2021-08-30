import {itBench} from "@dapplion/benchmark";
import {expect} from "chai";
import {ContainerType, Number64UintType, NumberUintType} from "../../src";

describe("Uint64 types", () => {
  const BeaconState = new ContainerType({
    fields: {
      slot: new NumberUintType({byteLength: 8}),
    },
  });

  const BeaconState2 = new ContainerType({
    fields: {
      slot: new Number64UintType(),
    },
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
    expect(state.slot).to.be.equal(numLoop);
  });

  itBench(`NumberUintType - increase slot to ${numLoop}`, () => {
    const tbState = BeaconState.createTreeBackedFromStruct({slot: 0});
    for (let i = 0; i < numLoop; i++) {
      tbState.slot++;
    }
    expect(tbState.slot).to.be.equal(numLoop);
  });

  itBench(`Number64UintType - increase slot to ${numLoop}`, () => {
    const tbState = BeaconState2.createTreeBackedFromStruct({slot: 0});
    for (let i = 0; i < numLoop; i++) {
      tbState.slot++;
    }
    expect(tbState.slot).to.be.equal(numLoop);
  });
});
