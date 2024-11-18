import {itBench} from "@dapplion/benchmark";
import type {CompositeViewDU} from "../../src";
import {EpochParticipation} from "../lodestarTypes/altair/sszTypes";
import {fillArray, linspace} from "../utils/misc";

describe("processAttestations() epochStatuses", () => {
  const len = 250_000;
  const readWrites = Math.round(len / 32);
  const indexes = shuffle(linspace(len));

  itBench<CompositeViewDU<typeof EpochParticipation>, CompositeViewDU<typeof EpochParticipation>>({
    id: `epochParticipation len ${len} rws ${readWrites}`,
    before: () => {
      const epochParticipation = fillArray(len, 3);
      return EpochParticipation.toViewDU(epochParticipation);
    },
    beforeEach: (epochParticipation) => epochParticipation.clone(),
    fn: (epochParticipation) => {
      for (let i = 0; i < readWrites; i++) {
        const idx = indexes[i];
        epochParticipation.set(idx, 8);
      }
    },
  });
});

function shuffle<T>(arr: T[]): T[] {
  const _arr: T[] = [...arr];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
  }
  return _arr;
}
