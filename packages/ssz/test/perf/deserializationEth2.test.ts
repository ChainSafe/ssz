import crypto from "crypto";
import {itBench} from "@dapplion/benchmark";
import * as sszPhase0 from "../lodestarTypes/phase0/sszTypes";
import * as sszAltair from "../lodestarTypes/altair/sszTypes";
import {Attestation, SignedAggregateAndProof} from "../lodestarTypes/phase0/types";
import {SignedContributionAndProof} from "../lodestarTypes/altair/types";
import {BitList} from "../../src";

describe("Deserialization of frequent eth2 objects", () => {
  itBench<Uint8Array, Uint8Array>({
    id: "deserialize Attestation - struct",
    before: () => sszPhase0.Attestation.serialize(getAttestationRandom()),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszPhase0.Attestation.deserialize(bytes);
    },
  });

  itBench<Uint8Array, Uint8Array>({
    id: "deserialize Attestation - tree",
    before: () => sszPhase0.Attestation.serialize(getAttestationRandom()),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszPhase0.Attestation.createTreeBackedFromBytes(bytes);
    },
  });

  itBench<Uint8Array, Uint8Array>({
    id: "deserialize SignedAggregateAndProof - struct",
    before: () => sszPhase0.SignedAggregateAndProof.serialize(getSignedAggregateAndProof()),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszPhase0.SignedAggregateAndProof.deserialize(bytes);
    },
  });

  itBench<Uint8Array, Uint8Array>({
    id: "deserialize SignedAggregateAndProof - tree",
    before: () => sszPhase0.SignedAggregateAndProof.serialize(getSignedAggregateAndProof()),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszPhase0.SignedAggregateAndProof.createTreeBackedFromBytes(bytes);
    },
  });

  itBench<Uint8Array, Uint8Array>({
    id: "deserialize SignedContributionAndProof - struct",
    before: () => sszAltair.SignedContributionAndProof.serialize(getSignedContributionAndProof()),
    beforeEach: (bytes) => bytes,
    fn: (bytes) => {
      sszAltair.SignedContributionAndProof.deserialize(bytes);
    },
  });
});

function getSignedAggregateAndProof(): SignedAggregateAndProof {
  const attestation = getAttestationRandom();
  return {
    message: {
      aggregatorIndex: 123456,
      aggregate: {...attestation, aggregationBits: getBitsMany(120, 90)},
      selectionProof: crypto.randomBytes(96),
    },
    signature: crypto.randomBytes(96),
  };
}

function getSignedContributionAndProof(): SignedContributionAndProof {
  return {
    message: {
      aggregatorIndex: 123456,
      contribution: {
        slot: 1234567,
        beaconBlockRoot: crypto.randomBytes(32),
        subCommitteeIndex: 7,
        aggregationBits: getBitsMany(120, 90),
        signature: crypto.randomBytes(96),
      },
      selectionProof: crypto.randomBytes(96),
    },
    signature: crypto.randomBytes(96),
  };
}

function getAttestationRandom(): Attestation {
  return {
    aggregationBits: getBitsSingle(120, 67),
    data: {
      slot: 1234567,
      index: 7,
      beaconBlockRoot: crypto.randomBytes(32),
      source: {epoch: 123456, root: crypto.randomBytes(32)},
      target: {epoch: 123456, root: crypto.randomBytes(32)},
    },
    signature: crypto.randomBytes(96),
  };
}

function getBitsSingle(len: number, bitSet: number): BitList {
  const bits: boolean[] = [];
  for (let i = 0; i < len; i++) {
    bits.push(i === bitSet);
  }
  return bits as BitList;
}

function getBitsMany(len: number, bitsSet: number): BitList {
  const bits: boolean[] = [];
  for (let i = 0; i < len; i++) {
    bits.push(i <= bitsSet);
  }
  return bits as BitList;
}
