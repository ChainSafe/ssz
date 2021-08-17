import {itBench, setBenchOpts} from "@dapplion/benchmark";
import { expect } from "chai";
import { ContainerType, NumberUintType } from "../../src";

describe("Uint64 types", () => {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 20 * 1000,
    runs: 100_000,
  });

  const BeaconState = new ContainerType({
    fields: {
      slot: new NumberUintType({byteLength: 8}),
    }
  });
  type IBeaconState = {
    slot: number,
  };

  const numLoop = 1_000_000;
  itBench(`struct - increase slot to ${numLoop}`, () => {
    const state: IBeaconState = {
      slot: 0
    };
    for (let i = 0; i < numLoop; i++) {
      state.slot ++;
    }
    expect(state.slot).to.be.equal(numLoop);
  });

  itBench(`NumberUintType - increase slot to ${numLoop}`, () => {
    const tbState = BeaconState.createTreeBackedFromStruct({slot: 0});
    for (let i = 0; i < numLoop; i++) {
      tbState.slot ++;
    }
    expect(tbState.slot).to.be.equal(numLoop);
  });

});
