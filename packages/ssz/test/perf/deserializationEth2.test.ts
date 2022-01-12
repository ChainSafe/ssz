import {itBench} from "@dapplion/benchmark";
import * as sszPhase0 from "../lodestarTypes/phase0/sszTypes";
import * as sszAltair from "../lodestarTypes/altair/sszTypes";
import {getAttestation, getSignedAggregateAndProof, getSignedContributionAndProof} from "../utils/generateEth2Objs";

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
});
