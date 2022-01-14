import {BitVectorType, ContainerType, ListBasicType, ListCompositeType, VectorCompositeType} from "../../../src";
import * as phase0Ssz from "../phase0/sszTypes";
import * as primitiveSsz from "../primitive/sszTypes";
import {preset, FINALIZED_ROOT_DEPTH, NEXT_SYNC_COMMITTEE_DEPTH, SYNC_COMMITTEE_SUBNET_COUNT} from "../params";

const {
  SYNC_COMMITTEE_SIZE,
  SLOTS_PER_HISTORICAL_ROOT,
  HISTORICAL_ROOTS_LIMIT,
  SLOTS_PER_EPOCH,
  VALIDATOR_REGISTRY_LIMIT,
  EPOCHS_PER_SYNC_COMMITTEE_PERIOD,
} = preset;

const {
  Bytes32,
  UintNumber64,
  UintBigint64,
  Slot,
  SubCommitteeIndex,
  ValidatorIndex,
  Root,
  Version,
  BLSPubkey,
  BLSSignature,
  ParticipationFlags,
} = primitiveSsz;

export const SyncSubnets = new BitVectorType(SYNC_COMMITTEE_SUBNET_COUNT);

export const Metadata = new ContainerType(
  {
    seqNumber: UintBigint64,
    attnets: phase0Ssz.AttestationSubnets,
    syncnets: SyncSubnets,
  },
  {
    casingMap: {
      seqNumber: "seq_number",
      attnets: "attnets",
      syncnets: "syncnets",
    },
  }
);

export const SyncCommittee = new ContainerType(
  {
    pubkeys: new VectorCompositeType(BLSPubkey, SYNC_COMMITTEE_SIZE),
    aggregatePubkey: BLSPubkey,
  },
  {
    casingMap: {
      pubkeys: "pubkeys",
      aggregatePubkey: "aggregate_pubkey",
    },
  }
);

export const SyncCommitteeMessage = new ContainerType(
  {
    slot: Slot,
    beaconBlockRoot: Root,
    validatorIndex: ValidatorIndex,
    signature: BLSSignature,
  },
  {
    casingMap: {
      slot: "slot",
      beaconBlockRoot: "beacon_block_root",
      validatorIndex: "validator_index",
      signature: "signature",
    },
  }
);

export const SyncCommitteeContribution = new ContainerType(
  {
    slot: Slot,
    beaconBlockRoot: Root,
    subcommitteeIndex: SubCommitteeIndex,
    aggregationBits: new BitVectorType(SYNC_COMMITTEE_SIZE / SYNC_COMMITTEE_SUBNET_COUNT),
    signature: BLSSignature,
  },
  {
    casingMap: {
      slot: "slot",
      beaconBlockRoot: "beacon_block_root",
      subcommitteeIndex: "subcommittee_index",
      aggregationBits: "aggregation_bits",
      signature: "signature",
    },
  }
);

export const ContributionAndProof = new ContainerType(
  {
    aggregatorIndex: ValidatorIndex,
    contribution: SyncCommitteeContribution,
    selectionProof: BLSSignature,
  },
  {
    casingMap: {
      aggregatorIndex: "aggregator_index",
      contribution: "contribution",
      selectionProof: "selection_proof",
    },
  }
);

export const SignedContributionAndProof = new ContainerType(
  {
    message: ContributionAndProof,
    signature: BLSSignature,
  },
  {typeName: "SignedContributionAndProof"}
);

export const SyncAggregatorSelectionData = new ContainerType(
  {
    slot: Slot,
    subcommitteeIndex: SubCommitteeIndex,
  },
  {
    casingMap: {
      slot: "slot",
      subcommitteeIndex: "subcommittee_index",
    },
  }
);

export const SyncCommitteeBits = new BitVectorType(SYNC_COMMITTEE_SIZE);

export const SyncAggregate = new ContainerType(
  {
    syncCommitteeBits: SyncCommitteeBits,
    syncCommitteeSignature: BLSSignature,
  },
  {
    casingMap: {
      syncCommitteeBits: "sync_committee_bits",
      syncCommitteeSignature: "sync_committee_signature",
    },
  }
);

export const HistoricalBlockRoots = new VectorCompositeType(Root, SLOTS_PER_HISTORICAL_ROOT);
export const HistoricalStateRoots = new VectorCompositeType(Root, SLOTS_PER_HISTORICAL_ROOT);

export const HistoricalBatch = new ContainerType(
  {
    blockRoots: HistoricalBlockRoots,
    stateRoots: HistoricalStateRoots,
  },
  {
    casingMap: phase0Ssz.HistoricalBatch.opts?.casingMap,
  }
);

export const BeaconBlockBody = new ContainerType(
  {
    ...phase0Ssz.BeaconBlockBody.fields,
    syncAggregate: SyncAggregate,
  },
  {
    casingMap: {
      ...phase0Ssz.BeaconBlockBody.opts?.casingMap,
      syncAggregate: "sync_aggregate",
    },
  }
);

export const BeaconBlock = new ContainerType(
  {
    slot: Slot,
    proposerIndex: ValidatorIndex,
    parentRoot: Root,
    stateRoot: Root,
    body: BeaconBlockBody,
  },
  {casingMap: phase0Ssz.BeaconBlock.opts?.casingMap}
);

export const SignedBeaconBlock = new ContainerType({
  message: BeaconBlock,
  signature: BLSSignature,
});

export const EpochParticipation = new ListBasicType(ParticipationFlags, VALIDATOR_REGISTRY_LIMIT);
export const InactivityScores = new ListBasicType(UintNumber64, VALIDATOR_REGISTRY_LIMIT);

// we don't reuse phase0.BeaconState fields since we need to replace some keys
// and we cannot keep order doing that
export const BeaconState = new ContainerType(
  {
    genesisTime: UintNumber64,
    genesisValidatorsRoot: Root,
    slot: Slot,
    fork: phase0Ssz.Fork,
    // History
    latestBlockHeader: phase0Ssz.BeaconBlockHeader,
    blockRoots: HistoricalBlockRoots,
    stateRoots: HistoricalStateRoots,
    historicalRoots: new ListCompositeType(Root, HISTORICAL_ROOTS_LIMIT),
    // Eth1
    eth1Data: phase0Ssz.Eth1Data,
    eth1DataVotes: phase0Ssz.Eth1DataVotes,
    eth1DepositIndex: UintNumber64,
    // Registry
    validators: phase0Ssz.Validators,
    balances: phase0Ssz.Balances,
    randaoMixes: phase0Ssz.RandaoMixes,
    // Slashings
    slashings: phase0Ssz.Slashings,
    // Participation
    previousEpochParticipation: EpochParticipation,
    currentEpochParticipation: EpochParticipation,
    // Finality
    justificationBits: phase0Ssz.JustificationBits,
    previousJustifiedCheckpoint: phase0Ssz.Checkpoint,
    currentJustifiedCheckpoint: phase0Ssz.Checkpoint,
    finalizedCheckpoint: phase0Ssz.Checkpoint,
    // Inactivity
    inactivityScores: InactivityScores,
    // Sync
    currentSyncCommittee: SyncCommittee,
    nextSyncCommittee: SyncCommittee,
  },
  {
    casingMap: {
      ...phase0Ssz.BeaconState.opts?.casingMap,
      previousEpochParticipation: "previous_epoch_participation",
      currentEpochParticipation: "current_epoch_participation",
      inactivityScores: "inactivity_scores",
      currentSyncCommittee: "current_sync_committee",
      nextSyncCommittee: "next_sync_committee",
    },
  }
);

export const LightClientSnapshot = new ContainerType(
  {
    header: phase0Ssz.BeaconBlockHeader,
    currentSyncCommittee: SyncCommittee,
    nextSyncCommittee: SyncCommittee,
  },
  {
    casingMap: {
      header: "header",
      currentSyncCommittee: "current_sync_committee",
      nextSyncCommittee: "next_sync_committee",
    },
  }
);

export const LightClientUpdate = new ContainerType(
  {
    attestedHeader: phase0Ssz.BeaconBlockHeader,
    nextSyncCommittee: SyncCommittee,
    nextSyncCommitteeBranch: new VectorCompositeType(Bytes32, NEXT_SYNC_COMMITTEE_DEPTH),
    finalizedHeader: phase0Ssz.BeaconBlockHeader,
    finalityBranch: new VectorCompositeType(Bytes32, FINALIZED_ROOT_DEPTH),
    syncCommitteeAggregate: SyncAggregate,
    forkVersion: Version,
  },
  {
    casingMap: {
      attestedHeader: "attested_header",
      nextSyncCommittee: "next_sync_committee",
      nextSyncCommitteeBranch: "next_sync_committee_branch",
      finalizedHeader: "finalized_header",
      finalityBranch: "finality_branch",
      syncCommitteeAggregate: "sync_committee_aggregate",
      forkVersion: "fork_version",
    },
  }
);

export const LightClientStore = new ContainerType(
  {
    snapshot: LightClientSnapshot,
    validUpdates: new ListCompositeType(LightClientUpdate, EPOCHS_PER_SYNC_COMMITTEE_PERIOD * SLOTS_PER_EPOCH),
  },
  {
    casingMap: {
      snapshot: "snapshot",
      validUpdates: "valid_updates",
    },
  }
);
