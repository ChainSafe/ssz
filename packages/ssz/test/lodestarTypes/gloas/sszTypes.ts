/**
 * Gloas types ported from lodestar `packages/types/src/gloas/sszTypes.ts`.
 * Only `BeaconState` and the types it references are ported.
 */
import {
  BitVectorType,
  ContainerType,
  ListCompositeType,
  ProgressiveContainerType,
  ProgressiveListBasicType,
  ProgressiveListCompositeType,
  VectorBasicType,
  VectorCompositeType,
} from "../../../src/index.ts";
import {ssz as altairSsz} from "../altair/index.ts";
import {ssz as capellaSsz} from "../capella/index.ts";
import {ssz as denebSsz} from "../deneb/index.ts";
import {ssz as electraSsz} from "../electra/index.ts";
import {ssz as fuluSsz} from "../fulu/index.ts";
import {preset} from "../params.ts";
import {ssz as phase0Ssz} from "../phase0/index.ts";
import {ssz as primitiveSsz} from "../primitive/index.ts";

const {
  HISTORICAL_ROOTS_LIMIT,
  MAX_BLOB_COMMITMENTS_PER_BLOCK,
  MAX_WITHDRAWALS_PER_PAYLOAD,
  MIN_SEED_LOOKAHEAD,
  PENDING_CONSOLIDATIONS_LIMIT,
  PENDING_DEPOSITS_LIMIT,
  PENDING_PARTIAL_WITHDRAWALS_LIMIT,
  PTC_SIZE,
  SLOTS_PER_EPOCH,
  SLOTS_PER_HISTORICAL_ROOT,
  VALIDATOR_REGISTRY_LIMIT,
} = preset;

const {
  Gwei,
  ExecutionAddress,
  ValidatorIndex,
  Epoch,
  EpochInf,
  BLSPubkey,
  Bytes32,
  Root,
  Slot,
  UintBn64,
  UintNum64,
  Uint8,
  BuilderIndex,
  ParticipationFlags,
} = primitiveSsz;

function activeFields(count: number): boolean[] {
  return Array.from({length: count}, () => true);
}

export const Withdrawals = new ProgressiveListCompositeType(capellaSsz.Withdrawal, {
  typeName: "Withdrawals",
  limit: MAX_WITHDRAWALS_PER_PAYLOAD,
});
export const BlobKzgCommitments = new ProgressiveListCompositeType(denebSsz.KZGCommitment, {
  typeName: "BlobKzgCommitments",
  limit: MAX_BLOB_COMMITMENTS_PER_BLOCK,
});

export const Validators = new ProgressiveListCompositeType(phase0Ssz.Validator, {
  typeName: "Validators",
  limit: VALIDATOR_REGISTRY_LIMIT,
});
export const Balances = new ProgressiveListBasicType(UintNum64, {
  typeName: "Balances",
  limit: VALIDATOR_REGISTRY_LIMIT,
});
export const EpochParticipation = new ProgressiveListBasicType(ParticipationFlags, {
  typeName: "EpochParticipation",
  limit: VALIDATOR_REGISTRY_LIMIT,
});
export const InactivityScores = new ProgressiveListBasicType(UintNum64, {
  typeName: "InactivityScores",
  limit: VALIDATOR_REGISTRY_LIMIT,
});
export const PendingDeposits = new ProgressiveListCompositeType(electraSsz.PendingDeposit, {
  typeName: "PendingDeposits",
  limit: PENDING_DEPOSITS_LIMIT,
});
export const PendingPartialWithdrawals = new ProgressiveListCompositeType(electraSsz.PendingPartialWithdrawal, {
  typeName: "PendingPartialWithdrawals",
  limit: PENDING_PARTIAL_WITHDRAWALS_LIMIT,
});
export const PendingConsolidations = new ProgressiveListCompositeType(electraSsz.PendingConsolidation, {
  typeName: "PendingConsolidations",
  limit: PENDING_CONSOLIDATIONS_LIMIT,
});

export const Builder = new ContainerType(
  {
    pubkey: BLSPubkey,
    version: Uint8,
    executionAddress: ExecutionAddress,
    balance: UintNum64,
    depositEpoch: EpochInf,
    withdrawableEpoch: EpochInf,
  },
  {typeName: "Builder", jsonCase: "eth2"}
);

export const BuilderPendingWithdrawal = new ContainerType(
  {
    feeRecipient: ExecutionAddress,
    amount: UintNum64,
    builderIndex: BuilderIndex,
  },
  {typeName: "BuilderPendingWithdrawal", jsonCase: "eth2"}
);

export const BuilderPendingPayment = new ContainerType(
  {
    weight: UintNum64,
    withdrawal: BuilderPendingWithdrawal,
    proposerIndex: ValidatorIndex,
  },
  {typeName: "BuilderPendingPayment", jsonCase: "eth2"}
);

export const Builders = new ProgressiveListCompositeType(Builder, {typeName: "Builders"});
export const BuilderPendingPayments = new VectorCompositeType(BuilderPendingPayment, 2 * SLOTS_PER_EPOCH);
export const BuilderPendingWithdrawals = new ProgressiveListCompositeType(BuilderPendingWithdrawal, {
  typeName: "BuilderPendingWithdrawals",
});

export const PayloadTimelinessCommittee = new VectorBasicType(ValidatorIndex, PTC_SIZE);
export const PayloadTimelinessCommitteeWindow = new VectorCompositeType(
  PayloadTimelinessCommittee,
  (2 + MIN_SEED_LOOKAHEAD) * SLOTS_PER_EPOCH
);

export const ExecutionPayloadBid = new ProgressiveContainerType(
  {
    parentBlockHash: Bytes32,
    parentBlockRoot: Root,
    blockHash: Bytes32,
    prevRandao: Bytes32,
    feeRecipient: ExecutionAddress,
    gasLimit: UintBn64,
    builderIndex: BuilderIndex,
    slot: Slot,
    value: UintNum64,
    executionPayment: UintBn64,
    blobKzgCommitments: BlobKzgCommitments,
    executionRequestsRoot: Root,
  },
  activeFields(12),
  {typeName: "ExecutionPayloadBid", jsonCase: "eth2"}
);

export const BeaconState = new ProgressiveContainerType(
  {
    genesisTime: UintNum64,
    genesisValidatorsRoot: Root,
    slot: Slot,
    fork: phase0Ssz.Fork,
    // History
    latestBlockHeader: phase0Ssz.BeaconBlockHeader,
    blockRoots: phase0Ssz.HistoricalBlockRoots,
    stateRoots: phase0Ssz.HistoricalStateRoots,
    // historical_roots Frozen in Capella, replaced by historical_summaries
    historicalRoots: new ListCompositeType(Root, HISTORICAL_ROOTS_LIMIT),
    // Eth1
    eth1Data: phase0Ssz.Eth1Data,
    eth1DataVotes: phase0Ssz.Eth1DataVotes,
    eth1DepositIndex: UintNum64,
    // Registry
    validators: Validators,
    balances: Balances,
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
    currentSyncCommittee: altairSsz.SyncCommittee,
    nextSyncCommittee: altairSsz.SyncCommittee,
    // Execution
    latestBlockHash: Bytes32, // New in GLOAS:EIP7732
    // Withdrawals
    nextWithdrawalIndex: capellaSsz.BeaconState.fields.nextWithdrawalIndex,
    nextWithdrawalValidatorIndex: capellaSsz.BeaconState.fields.nextWithdrawalValidatorIndex,
    // Deep history valid from Capella onwards
    historicalSummaries: capellaSsz.BeaconState.fields.historicalSummaries,
    depositRequestsStartIndex: UintBn64,
    depositBalanceToConsume: Gwei,
    exitBalanceToConsume: Gwei,
    earliestExitEpoch: Epoch,
    consolidationBalanceToConsume: Gwei,
    earliestConsolidationEpoch: Epoch,
    pendingDeposits: PendingDeposits,
    pendingPartialWithdrawals: PendingPartialWithdrawals,
    pendingConsolidations: PendingConsolidations,
    proposerLookahead: fuluSsz.BeaconState.fields.proposerLookahead,
    builders: Builders, // New in GLOAS:EIP7732
    nextWithdrawalBuilderIndex: BuilderIndex, // New in GLOAS:EIP7732
    executionPayloadAvailability: new BitVectorType(SLOTS_PER_HISTORICAL_ROOT), // New in GLOAS:EIP7732
    builderPendingPayments: BuilderPendingPayments, // New in GLOAS:EIP7732
    builderPendingWithdrawals: BuilderPendingWithdrawals, // New in GLOAS:EIP7732
    latestExecutionPayloadBid: ExecutionPayloadBid, // New in GLOAS:EIP7732
    payloadExpectedWithdrawals: Withdrawals, // New in GLOAS:EIP7732
    ptcWindow: PayloadTimelinessCommitteeWindow, // New in GLOAS:EIP7732
  },
  activeFields(46),
  {typeName: "BeaconState", jsonCase: "eth2"}
);
