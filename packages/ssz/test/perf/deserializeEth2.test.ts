import {itBench} from "@dapplion/benchmark";
import {BeaconState} from "../lodestarTypes/altair/types";
import * as sszPhase0 from "../lodestarTypes/phase0/sszTypes";
import * as sszAltair from "../lodestarTypes/altair/sszTypes";
import {
  getAttestation,
  getOnce,
  getRandomState,
  getSignedAggregateAndProof,
  getSignedContributionAndProof,
} from "../utils/generateEth2Objs";
import {TreeViewDU} from "../../src";

describe("Deserialize frequent eth2 objects", () => {
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
      sszPhase0.Attestation.deserializeToView(bytes);
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
      sszPhase0.SignedAggregateAndProof.deserializeToView(bytes);
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
    const getStateViewDU = getOnce(() => sszAltair.BeaconState.toViewDU(getStateVc()));

    itBench<Uint8Array, Uint8Array>({
      id: `BeaconState vc ${validatorCount} - deserialize tree`,
      before: () => getStateViewDU().serialize(),
      beforeEach: (bytes) => bytes,
      fn: (bytes) => {
        sszAltair.BeaconState.deserializeToViewDU(bytes);
      },
    });

    itBench({
      id: `BeaconState vc ${validatorCount} - serialize tree`,
      fn: () => {
        getStateViewDU().serialize();
      },
    });

    for (const {fieldName, fieldType} of sszAltair.BeaconState.fieldsEntries) {
      // Only benchmark big data structures
      if (fieldType.maxSize < 10e6 || fieldType.isBasic) {
        continue;
      }

      itBench<Uint8Array, Uint8Array>({
        id: `BeaconState.${fieldName} vc ${validatorCount} - deserialize tree`,
        before: () => (getStateViewDU()[fieldName] as TreeViewDU<any>).serialize(),
        beforeEach: (bytes) => bytes,
        fn: (bytes) => {
          fieldType.deserializeToViewDU(bytes);
        },
      });

      itBench<BeaconState, BeaconState>({
        id: `BeaconState.${fieldName} vc ${validatorCount} - serialize tree`,
        fn: () => {
          (getStateViewDU()[fieldName] as TreeViewDU<any>).serialize();
        },
      });
    }
  }
});
