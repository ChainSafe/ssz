import {describe, bench} from "@chainsafe/benchmark";
import {BeaconState} from "../../lodestarTypes/altair/types.js";
import * as sszPhase0 from "../../lodestarTypes/phase0/sszTypes.js";
import * as sszAltair from "../../lodestarTypes/altair/sszTypes.js";
import {
  getAttestation,
  getOnce,
  getRandomState,
  getSignedAggregateAndProof,
  getSyncCommitteeMessage,
  getSignedContributionAndProof,
  getSignedBeaconBlockPhase0,
} from "../../utils/generateEth2Objs.js";
import {CompositeType, isCompositeType, TreeViewDU, ValueOf} from "../../../src/index.js";

describe("Deserialize frequent eth2 objects", () => {
  benchDeserialize(sszPhase0.Attestation, getAttestation(0));
  benchDeserialize(sszPhase0.SignedAggregateAndProof, getSignedAggregateAndProof(0));
  benchDeserialize(sszAltair.SyncCommitteeMessage, getSyncCommitteeMessage(0));
  benchDeserialize(sszAltair.SignedContributionAndProof, getSignedContributionAndProof(0));
  benchDeserialize(sszPhase0.SignedBeaconBlock, getSignedBeaconBlockPhase0(0));

  function benchDeserialize<T extends CompositeType<unknown, unknown, unknown>>(type: T, value: ValueOf<T>): void {
    bench<Uint8Array, Uint8Array>({
      id: `deserialize ${type.typeName} - tree`,
      before: () => type.serialize(value),
      beforeEach: (bytes) => bytes,
      fn: (bytes) => {
        type.deserializeToView(bytes);
      },
    });

    bench<Uint8Array, Uint8Array>({
      id: `deserialize ${type.typeName} - struct`,
      before: () => type.serialize(value),
      beforeEach: (bytes) => bytes,
      fn: (bytes) => {
        type.deserialize(bytes);
      },
    });
  }

  for (const validatorCount of [300_000]) {
    // Compute once for all benchmarks only if run
    const getStateVc = getOnce(() => getRandomState(validatorCount));
    const getStateViewDU = getOnce(() => sszAltair.BeaconState.toViewDU(getStateVc()));

    bench<Uint8Array, Uint8Array>({
      id: `BeaconState vc ${validatorCount} - deserialize tree`,
      before: () => getStateViewDU().serialize(),
      beforeEach: (bytes) => bytes,
      fn: (bytes) => {
        sszAltair.BeaconState.deserializeToViewDU(bytes);
      },
    });

    bench({
      id: `BeaconState vc ${validatorCount} - serialize tree`,
      fn: () => {
        getStateViewDU().serialize();
      },
    });

    for (const {fieldName, fieldType} of sszAltair.BeaconState.fieldsEntries) {
      // Only benchmark big data structures
      if (fieldType.maxSize < 10e6 || !isCompositeType(fieldType)) {
        continue;
      }

      bench<Uint8Array, Uint8Array>({
        id: `BeaconState.${fieldName} vc ${validatorCount} - deserialize tree`,
        before: () => (getStateViewDU()[fieldName] as TreeViewDU<any>).serialize(),
        beforeEach: (bytes) => bytes,
        fn: (bytes) => {
          fieldType.deserializeToViewDU(bytes);
        },
      });

      bench<BeaconState, BeaconState>({
        id: `BeaconState.${fieldName} vc ${validatorCount} - serialize tree`,
        fn: () => {
          (getStateViewDU()[fieldName] as TreeViewDU<any>).serialize();
        },
      });
    }
  }
});
