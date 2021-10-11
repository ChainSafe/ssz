import {VALIDATOR_REGISTRY_LIMIT} from "@chainsafe/lodestar-params";
import {itBench} from "@dapplion/benchmark";
import {byteType, List, ListType, TreeBacked} from "../../src";

describe("processAttestations() epochStatuses", () => {
  const epochParticipationType = new ListType<List<number>>({
    elementType: byteType,
    limit: VALIDATOR_REGISTRY_LIMIT,
  });

  const len = 250_000;
  const readWrites = Math.round(len / 32);
  const indexes = shuffle(linspace(len));

  itBench<TreeBacked<List<number>>, TreeBacked<List<number>>>({
    id: `epochParticipation len ${len} rws ${readWrites}`,
    before: () => {
      const epochParticipation = getEpochParticipation(len, 3);
      return epochParticipationType.createTreeBackedFromStruct(epochParticipation);
    },
    beforeEach: (epochParticipation) => epochParticipation.clone(),
    fn: (epochParticipation) => {
      for (let i = 0; i < readWrites; i++) {
        const idx = indexes[i];
        epochParticipation[idx] = 8;
      }
    },
  });
});

function getEpochParticipation(len: number, value: number): List<number> {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr as List<number>;
}

function linspace(len: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(0);
  }
  return arr;
}

function shuffle<T>(arr: T[]): T[] {
  const _arr: T[] = [...arr];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
  }
  return _arr;
}
