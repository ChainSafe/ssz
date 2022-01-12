import {BitVectorType, ContainerType, ListBasicType, ListCompositeType, VectorCompositeType} from "../../../src";
import {
  FINALIZED_ROOT_INDEX_FLOORLOG2,
  NEXT_SYNC_COMMITTEE_INDEX_FLOORLOG2,
  SYNC_COMMITTEE_SUBNET_COUNT,
  SYNC_COMMITTEE_SIZE,
  SLOTS_PER_HISTORICAL_ROOT,
  HISTORICAL_ROOTS_LIMIT,
  SLOTS_PER_EPOCH,
  VALIDATOR_REGISTRY_LIMIT,
  EPOCHS_PER_SYNC_COMMITTEE_PERIOD,
} from "@chainsafe/lodestar-params";
import * as phase0Ssz from "../phase0/sszTypes";
import * as primitiveSsz from "../primitive/sszTypes";

const {
  Bytes32,
  Number64,
  Uint64,
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

export const Metadata = new ContainerType({
  seqNumber: Uint64,
  attnets: phase0Ssz.AttestationSubnets,
  syncnets: SyncSubnets,
});

export const SyncCommittee = new ContainerType({
  pubkeys: new VectorCompositeType(BLSPubkey, SYNC_COMMITTEE_SIZE),
  aggregatePubkey: BLSPubkey,
});

export const SyncCommitteeMessage = new ContainerType({
  slot: Slot,
  beaconBlockRoot: Root,
  validatorIndex: ValidatorIndex,
  signature: BLSSignature,
});

export const SyncCommitteeContribution = new ContainerType({
  slot: Slot,
  beaconBlockRoot: Root,
  subCommitteeIndex: SubCommitteeIndex,
  aggregationBits: new BitVectorType(SYNC_COMMITTEE_SIZE / SYNC_COMMITTEE_SUBNET_COUNT),
  signature: BLSSignature,
});

export const ContributionAndProof = new ContainerType({
  aggregatorIndex: ValidatorIndex,
  contribution: SyncCommitteeContribution,
  selectionProof: BLSSignature,
});

export const SignedContributionAndProof = new ContainerType({
  message: ContributionAndProof,
  signature: BLSSignature,
});

export const SyncAggregatorSelectionData = new ContainerType({
  slot: Slot,
  subCommitteeIndex: SubCommitteeIndex,
});

export const SyncCommitteeBits = new BitVectorType(SYNC_COMMITTEE_SIZE);

export const SyncAggregate = new ContainerType({
  syncCommitteeBits: SyncCommitteeBits,
  syncCommitteeSignature: BLSSignature,
});

export const HistoricalBlockRoots = new VectorCompositeType(Root, SLOTS_PER_HISTORICAL_ROOT);
export const HistoricalStateRoots = new VectorCompositeType(Root, SLOTS_PER_HISTORICAL_ROOT);

export const HistoricalBatch = new ContainerType({
  blockRoots: Root,
  stateRoots: Root,
});

export const BeaconBlockBody = new ContainerType({
  ...phase0Ssz.BeaconBlockBody.fields,
  syncAggregate: SyncAggregate,
});

export const BeaconBlock = new ContainerType({
  slot: Slot,
  proposerIndex: ValidatorIndex,
  parentRoot: Root,
  stateRoot: Root,
  body: BeaconBlockBody,
});

export const SignedBeaconBlock = new ContainerType({
  message: BeaconBlock,
  signature: BLSSignature,
});

export const EpochParticipation = new ListBasicType(ParticipationFlags, VALIDATOR_REGISTRY_LIMIT);
export const InactivityScores = new ListBasicType(Number64, VALIDATOR_REGISTRY_LIMIT);

// we don't reuse phase0.BeaconState fields since we need to replace some keys
// and we cannot keep order doing that
export const BeaconState = new ContainerType({
  genesisTime: Number64,
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
  eth1DepositIndex: Number64,
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
});

export const LightClientSnapshot = new ContainerType({
  header: phase0Ssz.BeaconBlockHeader,
  nextSyncCommittee: SyncCommittee,
  currentSyncCommittee: SyncCommittee,
});

export const LightClientUpdate = new ContainerType({
  header: phase0Ssz.BeaconBlockHeader,
  nextSyncCommittee: SyncCommittee,
  nextSyncCommitteeBranch: new VectorCompositeType(Bytes32, NEXT_SYNC_COMMITTEE_INDEX_FLOORLOG2),
  finalityHeader: phase0Ssz.BeaconBlockHeader,
  finalityBranch: new VectorCompositeType(Bytes32, FINALIZED_ROOT_INDEX_FLOORLOG2),
  syncCommitteeBits: new BitVectorType(SYNC_COMMITTEE_SIZE),
  syncCommitteeSignature: BLSSignature,
  forkVersion: Version,
});

export const LightClientStore = new ContainerType({
  snapshot: LightClientSnapshot,
  validUpdates: new ListCompositeType(LightClientUpdate, EPOCHS_PER_SYNC_COMMITTEE_PERIOD * SLOTS_PER_EPOCH),
});
