import {BitArray} from "../../src/index.ts";
import * as sszAltair from "../lodestarTypes/altair/sszTypes.ts";
import {BeaconState, SignedContributionAndProof, SyncCommitteeMessage} from "../lodestarTypes/altair/types.ts";
import {Attestation, SignedAggregateAndProof, SignedBeaconBlock, Validator} from "../lodestarTypes/phase0/types.ts";

// Typical mainnet numbers
const BITS_PER_ATTESTATION = 90;
const ATTESTATIONS_PER_BLOCK = 90;

export function getRandomState(validatorCount: number): BeaconState {
  const state = sszAltair.BeaconState.defaultValue();
  for (let i = 0; i < validatorCount; i++) {
    state.balances.push(34788813514 + i);
    state.currentEpochParticipation.push(3);
    state.previousEpochParticipation.push(7);
    state.inactivityScores.push(0);
    state.validators.push({
      pubkey: new Uint8Array(48),
      withdrawalCredentials: new Uint8Array(32),
      effectiveBalance: 32e9,
      slashed: false,
      activationEligibilityEpoch: i,
      activationEpoch: i,
      exitEpoch: Infinity,
      withdrawableEpoch: Infinity,
    });
  }
  return state;
}

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

export function getSyncCommitteeMessage(i: number): SyncCommitteeMessage {
  return {
    slot: 1234567 + i,
    beaconBlockRoot: randomBytes(32),
    validatorIndex: 1e6 + i,
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
        subcommitteeIndex: i % 16,
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

export function getValidator(i: number): Validator {
  return {
    pubkey: randomBytes(48),
    withdrawalCredentials: randomBytes(32),
    effectiveBalance: 32e9 + i,
    slashed: false,
    activationEligibilityEpoch: 1e6 + i,
    activationEpoch: 1e6 + i,
    exitEpoch: Infinity,
    withdrawableEpoch: Infinity,
  };
}

export function getBitsSingle(len: number, bitSet: number): BitArray {
  const bits = BitArray.fromBitLen(len);
  bits.set(bitSet, true);
  return bits;
}

function getBitsMany(len: number, bitsSet: number): BitArray {
  const bits = BitArray.fromBitLen(len);
  for (let i = 0; i <= bitsSet; i++) {
    bits.set(i, true);
  }
  return bits;
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

export function getOnce<T>(fn: () => T): () => T {
  let value: T | null = null;
  return () => {
    if (value === null) {
      value = fn();
    }
    return value;
  };
}
