import {itBench} from "@dapplion/benchmark";
import * as sszPhase0 from "../lodestarTypes/phase0/sszTypes";
import * as sszAltair from "../lodestarTypes/altair/sszTypes";
import {BeaconState} from "../lodestarTypes/altair/types";
import {
  getAttestation,
  getOnce,
  getRandomState,
  getSignedAggregateAndProof,
  getSignedContributionAndProof,
} from "../utils/generateEth2Objs";
import {CompositeType, TreeBacked, Type} from "../../src";

describe("Deserialization of frequent eth2 objects", () => {
  itBench<Uint8Array, Uint8Array>({
    id: "deserialize Attestation - struct",
    before: () => sszPhase0.Attestation.serialize(getAttestation(0)),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszPhase0.Attestation.deserialize(bytes);
    },
  });

  itBench<Uint8Array, Uint8Array>({
    id: "deserialize Attestation - tree",
    before: () => sszPhase0.Attestation.serialize(getAttestation(0)),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszPhase0.Attestation.createTreeBackedFromBytes(bytes);
    },
  });

  itBench<Uint8Array, Uint8Array>({
    id: "deserialize SignedAggregateAndProof - struct",
    before: () => sszPhase0.SignedAggregateAndProof.serialize(getSignedAggregateAndProof(0)),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszPhase0.SignedAggregateAndProof.deserialize(bytes);
    },
  });

  itBench<Uint8Array, Uint8Array>({
    id: "deserialize SignedAggregateAndProof - tree",
    before: () => sszPhase0.SignedAggregateAndProof.serialize(getSignedAggregateAndProof(0)),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszPhase0.SignedAggregateAndProof.createTreeBackedFromBytes(bytes);
    },
  });

  itBench<Uint8Array, Uint8Array>({
    id: "deserialize SignedContributionAndProof - struct",
    before: () => sszAltair.SignedContributionAndProof.serialize(getSignedContributionAndProof(0)),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszAltair.SignedContributionAndProof.deserialize(bytes);
    },
  });

  for (const validatorCount of [300_000]) {
    // Compute once for all benchmarks only if run
    const getStateVc = getOnce(() => getRandomState(validatorCount));
    const getStateTreeBacked = getOnce(() => sszAltair.BeaconState.createTreeBackedFromStruct(getStateVc()));

    itBench<Uint8Array, Uint8Array>({
      id: `BeaconState vc ${validatorCount} - deserialize tree`,
      before: () => getStateTreeBacked().serialize(),
      beforeEach: (bytes) => bytes,
      fn: (bytes) => {
        sszAltair.BeaconState.createTreeBackedFromBytes(bytes);
      },
    });

    itBench({
      id: `BeaconState vc ${validatorCount} - serialize tree`,
      fn: () => {
        getStateTreeBacked().serialize();
      },
    });

    for (const [fieldName, fieldType] of Object.entries(sszAltair.BeaconState.fields)) {
      // Only benchmark big data structures
      if (fieldType.getMaxSerializedLength() < 10e6) {
        continue;
      }

      itBench<Uint8Array, Uint8Array>({
        id: `BeaconState.${fieldName} vc ${validatorCount} - deserialize tree`,
        before: () =>
          (getStateTreeBacked()[fieldName as keyof BeaconState] as unknown as TreeBacked<Type<unknown>>).serialize(),
        beforeEach: (bytes) => bytes,
        fn: (bytes) => {
          (fieldType as CompositeType<any>).createTreeBackedFromBytes(bytes);
        },
      });

      itBench<BeaconState, BeaconState>({
        id: `BeaconState.${fieldName} vc ${validatorCount} - serialize tree`,
        fn: () => {
          (getStateTreeBacked()[fieldName as keyof BeaconState] as unknown as TreeBacked<Type<unknown>>).serialize();
        },
      });
    }
  }
});
