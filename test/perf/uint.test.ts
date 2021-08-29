import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {expect} from "chai";
import {ContainerType, Number64UintType, NumberUintType} from "../../src";

describe("Uint64 types", () => {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 20 * 1000,
    runs: 100_000,
  });

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

  const TWO_POWER_32 = 2 ** 32;
  const numTwoPower32Loop = TWO_POWER_32 + numLoop;
  itBench(`struct - increase slot from 2**32 to 2**32 + ${numLoop}`, () => {
    const state: IBeaconState = {
      slot: TWO_POWER_32,
    };
    for (let i = TWO_POWER_32; i < numTwoPower32Loop; i++) {
      state.slot++;
    }
    expect(state.slot).to.be.equal(numTwoPower32Loop);
  });

  itBench(`NumberUintType - increase slot from 2**32 to 2**32 + ${numLoop}`, () => {
    const tbState = BeaconState.createTreeBackedFromStruct({slot: TWO_POWER_32});
    for (let i = TWO_POWER_32; i < numTwoPower32Loop; i++) {
      tbState.slot++;
    }
    expect(tbState.slot).to.be.equal(numTwoPower32Loop);
  });

  itBench(`Number64UintType - increase slot from 2**32 to 2**32 + ${numLoop}`, () => {
    const tbState = BeaconState2.createTreeBackedFromStruct({slot: TWO_POWER_32});
    for (let i = TWO_POWER_32; i < numTwoPower32Loop; i++) {
      tbState.slot++;
    }
    expect(tbState.slot).to.be.equal(numTwoPower32Loop);
  });
});
