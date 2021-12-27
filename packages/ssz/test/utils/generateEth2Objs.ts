import {Attestation, SignedAggregateAndProof, SignedBeaconBlock} from "../lodestarTypes/phase0/types";
import {SignedContributionAndProof} from "../lodestarTypes/altair/types";
import {BitList} from "../../src";

// Typical mainnet numbers
const BITS_PER_ATTESTATION = 90;
const ATTESTATIONS_PER_BLOCK = 90;

export function getAttestation(i: number): Attestation {
  return {
    aggregationBits: getBitsSingle(120, i % 120),
    data: {
      slot: 1234567 + i,
      index: i % 16,
      beaconBlockRoot: randomBytes(32),
      source: {epoch: 123456 + i, root: randomBytes(32)},
      target: {epoch: 123456 + i, root: randomBytes(32)},
    },
    signature: randomBytes(96),
  };
}

export function getSignedAggregateAndProof(i: number): SignedAggregateAndProof {
  const attestation = getAttestation(i);
  return {
    message: {
      aggregatorIndex: 123456 + i,
      aggregate: {...attestation, aggregationBits: getBitsMany(120, BITS_PER_ATTESTATION)},
      selectionProof: randomBytes(96),
    },
    signature: randomBytes(96),
  };
}

export function getSignedContributionAndProof(i: number): SignedContributionAndProof {
  return {
    message: {
      aggregatorIndex: 123456 + i,
      contribution: {
        slot: 1234567 + i,
        beaconBlockRoot: randomBytes(32),
        subCommitteeIndex: i % 16,
        aggregationBits: getBitsMany(120, BITS_PER_ATTESTATION),
        signature: randomBytes(96),
      },
      selectionProof: randomBytes(96),
    },
    signature: randomBytes(96),
  };
}

export function getSignedBeaconBlockPhase0(i: number): SignedBeaconBlock {
  const attestations: Attestation[] = [];
  for (let j = 0; j < ATTESTATIONS_PER_BLOCK; j++) {
    attestations.push(getAttestation(i + j));
  }

  return {
    message: {
      slot: 1000000 + i,
      proposerIndex: 240000 + i,
      parentRoot: randomBytes(32),
      // TODO: Compute the state root properly!
      stateRoot: randomBytes(32),
      body: {
        randaoReveal: randomBytes(96),
        eth1Data: {
          depositRoot: randomBytes(32),
          depositCount: 250000 + i,
          blockHash: randomBytes(32),
        },
        graffiti: randomBytes(32),

        // Operations
        proposerSlashings: [],
        attesterSlashings: [],
        attestations: attestations,
        deposits: [],
        voluntaryExits: [],
      },
    },
    signature: randomBytes(96),
  };
}

export function getBitsSingle(len: number, bitSet: number): BitList {
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

function randomBytes(bytes: number): Uint8Array {
  const uint8Arr = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    uint8Arr[i] = i;
  }

  // // Wrapping with Buffer, reduced memory WTF
  // return Buffer.from(uint8Arr);

  return uint8Arr;
}
