/**
 * Electra types ported from lodestar `packages/types/src/electra/sszTypes.ts`.
 * Only `BeaconState` and the types it references are ported.
 */
import {ContainerNodeStructType, ContainerType, ListCompositeType} from "../../../src/index.ts";
import {ssz as altairSsz} from "../altair/index.ts";
import {ssz as capellaSsz} from "../capella/index.ts";
import {ssz as denebSsz} from "../deneb/index.ts";
import {preset} from "../params.ts";
import {ssz as phase0Ssz} from "../phase0/index.ts";
import {ssz as primitiveSsz} from "../primitive/index.ts";

const {
  HISTORICAL_ROOTS_LIMIT,
  PENDING_CONSOLIDATIONS_LIMIT,
  PENDING_DEPOSITS_LIMIT,
  PENDING_PARTIAL_WITHDRAWALS_LIMIT,
} = preset;

const {Epoch, Gwei, UintNum64, Slot, Root, BLSSignature, Bytes32, BLSPubkey, UintBn64, ValidatorIndex} = primitiveSsz;

export const ExecutionPayloadHeader = denebSsz.ExecutionPayloadHeader;

export const PendingDeposit = new ContainerNodeStructType(
  {
    pubkey: BLSPubkey,
    withdrawalCredentials: Bytes32,
    // this is actually gwei uintbn64 type, but super unlikely to get a high amount here
    // to warrant a bn type
    amount: UintNum64,
    signature: BLSSignature,
    slot: Slot,
  },
  {typeName: "PendingDeposit", jsonCase: "eth2"}
);

export const PendingDeposits = new ListCompositeType(PendingDeposit, PENDING_DEPOSITS_LIMIT);

export const PendingPartialWithdrawal = new ContainerType(
  {
    validatorIndex: ValidatorIndex,
    amount: Gwei,
    withdrawableEpoch: Epoch,
  },
  {typeName: "PendingPartialWithdrawal", jsonCase: "eth2"}
);

export const PendingPartialWithdrawals = new ListCompositeType(
  PendingPartialWithdrawal,
  PENDING_PARTIAL_WITHDRAWALS_LIMIT
);

export const PendingConsolidation = new ContainerType(
  {
    sourceIndex: ValidatorIndex,
    targetIndex: ValidatorIndex,
  },
  {typeName: "PendingConsolidation", jsonCase: "eth2"}
);

export const PendingConsolidations = new ListCompositeType(PendingConsolidation, PENDING_CONSOLIDATIONS_LIMIT);

// In EIP-7251, we spread deneb fields as new fields are appended at the end
export const BeaconState = new ContainerType(
  {
    genesisTime: UintNum64,
    genesisValidatorsRoot: Root,
    slot: primitiveSsz.Slot,
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
    validators: phase0Ssz.Validators,
    balances: phase0Ssz.Balances,
    randaoMixes: phase0Ssz.RandaoMixes,
    // Slashings
    slashings: phase0Ssz.Slashings,
    // Participation
    previousEpochParticipation: altairSsz.EpochParticipation,
    currentEpochParticipation: altairSsz.EpochParticipation,
    // Finality
    justificationBits: phase0Ssz.JustificationBits,
    previousJustifiedCheckpoint: phase0Ssz.Checkpoint,
    currentJustifiedCheckpoint: phase0Ssz.Checkpoint,
    finalizedCheckpoint: phase0Ssz.Checkpoint,
    // Inactivity
    inactivityScores: altairSsz.InactivityScores,
    // Sync
    currentSyncCommittee: altairSsz.SyncCommittee,
    nextSyncCommittee: altairSsz.SyncCommittee,
    // Execution
    latestExecutionPayloadHeader: ExecutionPayloadHeader,
    // Withdrawals
    nextWithdrawalIndex: capellaSsz.BeaconState.fields.nextWithdrawalIndex,
    nextWithdrawalValidatorIndex: capellaSsz.BeaconState.fields.nextWithdrawalValidatorIndex,
    // Deep history valid from Capella onwards
    historicalSummaries: capellaSsz.BeaconState.fields.historicalSummaries,
    depositRequestsStartIndex: UintBn64, // New in ELECTRA:EIP6110
    depositBalanceToConsume: Gwei, // New in ELECTRA:EIP7251
    exitBalanceToConsume: Gwei, // New in ELECTRA:EIP7251
    earliestExitEpoch: Epoch, // New in ELECTRA:EIP7251
    consolidationBalanceToConsume: Gwei, // New in ELECTRA:EIP7251
    earliestConsolidationEpoch: Epoch, // New in ELECTRA:EIP7251
    pendingDeposits: PendingDeposits, // New in ELECTRA:EIP7251
    pendingPartialWithdrawals: PendingPartialWithdrawals, // New in ELECTRA:EIP7251
    pendingConsolidations: PendingConsolidations, // New in ELECTRA:EIP7251
  },
  {typeName: "BeaconState", jsonCase: "eth2"}
);
