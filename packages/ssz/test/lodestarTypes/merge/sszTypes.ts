import {ByteVectorType, ContainerType, ListBasicType, ListCompositeType, VectorCompositeType} from "../../../src";
import {ssz as primitiveSsz} from "../primitive";
import {ssz as phase0Ssz} from "../phase0";
import {ssz as altairSsz} from "../altair";
import {Uint256} from "../primitive/sszTypes";
import {preset} from "../params";

const {
  BYTES_PER_LOGS_BLOOM,
  HISTORICAL_ROOTS_LIMIT,
  MAX_TRANSACTIONS_PER_PAYLOAD,
  MAX_BYTES_PER_TRANSACTION,
  MAX_EXTRA_DATA_BYTES,
  SLOTS_PER_HISTORICAL_ROOT,
} = preset;

const {Bytes20, Bytes32, Number64, Slot, ValidatorIndex, Root, BLSSignature, Uint8} = primitiveSsz;

/**
 * ByteList[MAX_BYTES_PER_TRANSACTION]
 *
 * Spec v1.0.1
 */
export const Transaction = new ListBasicType(primitiveSsz.Byte, MAX_BYTES_PER_TRANSACTION);

/**
 * Union[OpaqueTransaction]
 *
 * Spec v1.0.1
 */
export const Transactions = new ListCompositeType(Transaction, MAX_TRANSACTIONS_PER_PAYLOAD);

const executionPayloadFields = {
  parentHash: Root,
  coinbase: Bytes20,
  stateRoot: Bytes32,
  receiptRoot: Bytes32,
  logsBloom: new ByteVectorType(BYTES_PER_LOGS_BLOOM),
  random: Bytes32,
  blockNumber: Number64,
  gasLimit: Number64,
  gasUsed: Number64,
  timestamp: Number64,
  // TODO: if there is perf issue, consider making ByteListType
  extraData: new ListBasicType(Uint8, MAX_EXTRA_DATA_BYTES),
  baseFeePerGas: Bytes32,
  // Extra payload fields
  blockHash: Root,
};

const executionPayloadCasingMap = {
  parentHash: "parent_hash",
  coinbase: "coinbase",
  stateRoot: "state_root",
  receiptRoot: "receipt_root",
  logsBloom: "logs_bloom",
  random: "random",
  blockNumber: "block_number",
  gasLimit: "gas_limit",
  gasUsed: "gas_used",
  timestamp: "timestamp",
  extraData: "extra_data",
  baseFeePerGas: "base_fee_per_gas",
  blockHash: "block_hash",
};

/**
 * ```python
 * class ExecutionPayload(Container):
 *     # Execution block header fields
 *     parent_hash: Hash32
 *     coinbase: Bytes20  # 'beneficiary' in the yellow paper
 *     state_root: Bytes32
 *     receipt_root: Bytes32  # 'receipts root' in the yellow paper
 *     logs_bloom: ByteVector[BYTES_PER_LOGS_BLOOM]
 *     random: Bytes32  # 'difficulty' in the yellow paper
 *     block_number: uint64  # 'number' in the yellow paper
 *     gas_limit: uint64
 *     gas_used: uint64
 *     timestamp: uint64
 *     extra_data: ByteList[MAX_EXTRA_DATA_BYTES]
 *     base_fee_per_gas: Bytes32  # base fee introduced in EIP-1559, little-endian serialized
 *     # Extra payload fields
 *     block_hash: Hash32  # Hash of execution block
 *     transactions: List[Transaction, MAX_TRANSACTIONS_PER_PAYLOAD]
 * ```
 *
 * Spec v1.0.1
 */
export const ExecutionPayload = new ContainerType(
  {
    ...executionPayloadFields,
    transactions: Transactions,
  },
  {
    casingMap: {
      ...executionPayloadCasingMap,
      transactions: "transactions",
    },
  }
);

/**
 * ```python
 * class ExecutionPayload(Container):
 *     ...
 *     transactions_root: Root
 * ```
 *
 * Spec v1.0.1
 */
export const ExecutionPayloadHeader = new ContainerType(
  {
    ...executionPayloadFields,
    transactionsRoot: Root,
  },
  {
    casingMap: {
      ...executionPayloadCasingMap,
      transactionsRoot: "transactions_root",
    },
  }
);

export const BeaconBlockBody = new ContainerType(
  {
    ...altairSsz.BeaconBlockBody.fields,
    executionPayload: ExecutionPayload,
  },
  {
    casingMap: {
      ...altairSsz.BeaconBlockBody.opts?.casingMap,
      executionPayload: "execution_payload",
    },
  }
);

export const BeaconBlock = new ContainerType(
  {
    slot: Slot,
    proposerIndex: ValidatorIndex,
    // Reclare expandedType() with altair block and altair state
    parentRoot: Root,
    stateRoot: Root,
    body: BeaconBlockBody,
  },
  {casingMap: altairSsz.BeaconBlock.opts?.casingMap}
);

export const SignedBeaconBlock = new ContainerType({
  message: BeaconBlock,
  signature: BLSSignature,
});

export const PowBlock = new ContainerType(
  {
    blockHash: Root,
    parentHash: Root,
    totalDifficulty: Uint256,
  },
  {
    casingMap: {
      blockHash: "block_hash",
      parentHash: "parent_hash",
      totalDifficulty: "total_difficulty",
    },
  }
);

// Re-declare with the new expanded type
export const HistoricalBlockRoots = new VectorCompositeType(Root, SLOTS_PER_HISTORICAL_ROOT);
export const HistoricalStateRoots = new VectorCompositeType(Root, SLOTS_PER_HISTORICAL_ROOT);

export const HistoricalBatch = new ContainerType(
  {
    blockRoots: Root,
    stateRoots: Root,
  },
  {casingMap: phase0Ssz.HistoricalBatch.opts?.casingMap}
);

// we don't reuse phase0.BeaconState fields since we need to replace some keys
// and we cannot keep order doing that
export const BeaconState = new ContainerType(
  {
    genesisTime: Number64,
    genesisValidatorsRoot: Root,
    slot: primitiveSsz.Slot,
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
    latestExecutionPayloadHeader: ExecutionPayloadHeader, // [New in Merge]
  },
  {
    casingMap: {
      ...altairSsz.BeaconState.opts?.casingMap,
      latestExecutionPayloadHeader: "latest_execution_payload_header",
    },
  }
);
