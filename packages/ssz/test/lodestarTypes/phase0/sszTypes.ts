import {
  BitListType,
  BitVectorType,
  ContainerType,
  ContainerNodeStructType,
  ListBasicType,
  ListCompositeType,
  VectorBasicType,
  VectorCompositeType,
} from "../../../src";
import * as primitiveSsz from "../primitive/sszTypes";
import {
  preset,
  MAX_REQUEST_BLOCKS,
  DEPOSIT_CONTRACT_TREE_DEPTH,
  JUSTIFICATION_BITS_LENGTH,
  ATTESTATION_SUBNET_COUNT,
} from "../params";

const {
  EPOCHS_PER_ETH1_VOTING_PERIOD,
  EPOCHS_PER_HISTORICAL_VECTOR,
  EPOCHS_PER_SLASHINGS_VECTOR,
  HISTORICAL_ROOTS_LIMIT,
  MAX_ATTESTATIONS,
  MAX_ATTESTER_SLASHINGS,
  MAX_DEPOSITS,
  MAX_PROPOSER_SLASHINGS,
  MAX_VALIDATORS_PER_COMMITTEE,
  MAX_VOLUNTARY_EXITS,
  SLOTS_PER_EPOCH,
  SLOTS_PER_HISTORICAL_ROOT,
  VALIDATOR_REGISTRY_LIMIT,
} = preset;

const {
  Boolean,
  Bytes32,
  UintNumber64,
  UintBigint64,
  Slot,
  Epoch,
  CommitteeIndex,
  ValidatorIndex,
  Gwei,
  Root,
  Version,
  ForkDigest,
  BLSPubkey,
  BLSSignature,
  Domain,
} = primitiveSsz;

// Misc types
// ==========

export const AttestationSubnets = new BitVectorType(ATTESTATION_SUBNET_COUNT);

export const BeaconBlockHeader = new ContainerType(
  {
    slot: Slot,
    proposerIndex: ValidatorIndex,
    parentRoot: Root,
    stateRoot: Root,
    bodyRoot: Root,
  },
  {
    casingMap: {
      slot: "slot",
      proposerIndex: "proposer_index",
      parentRoot: "parent_root",
      stateRoot: "state_root",
      bodyRoot: "body_root",
    },
  }
);

export const SignedBeaconBlockHeader = new ContainerType({
  message: BeaconBlockHeader,
  signature: BLSSignature,
});

export const Checkpoint = new ContainerType({
  epoch: Epoch,
  root: Root,
});

export const CommitteeBits = new BitListType(MAX_VALIDATORS_PER_COMMITTEE);

export const CommitteeIndices = new ListBasicType(ValidatorIndex, MAX_VALIDATORS_PER_COMMITTEE);

export const DepositMessage = new ContainerType(
  {
    pubkey: BLSPubkey,
    withdrawalCredentials: Bytes32,
    amount: UintNumber64,
  },
  {
    casingMap: {
      pubkey: "pubkey",
      withdrawalCredentials: "withdrawal_credentials",
      amount: "amount",
    },
  }
);

export const DepositData = new ContainerType(
  {
    pubkey: BLSPubkey,
    withdrawalCredentials: Bytes32,
    amount: UintNumber64,
    signature: BLSSignature,
  },
  {
    casingMap: {
      pubkey: "pubkey",
      withdrawalCredentials: "withdrawal_credentials",
      amount: "amount",
      signature: "signature",
    },
  }
);

export const DepositDataRootList = new ListCompositeType(Root, 2 ** DEPOSIT_CONTRACT_TREE_DEPTH);

export const DepositEvent = new ContainerType(
  {
    depositData: DepositData,
    blockNumber: UintNumber64,
    index: UintNumber64,
  },
  {
    casingMap: {
      depositData: "deposit_data",
      blockNumber: "block_number",
      index: "index",
    },
  }
);

export const Eth1Data = new ContainerType(
  {
    depositRoot: Root,
    depositCount: UintNumber64,
    blockHash: Bytes32,
  },
  {
    casingMap: {
      depositRoot: "deposit_root",
      depositCount: "deposit_count",
      blockHash: "block_hash",
    },
  }
);

export const Eth1DataVotes = new ListCompositeType(Eth1Data, EPOCHS_PER_ETH1_VOTING_PERIOD * SLOTS_PER_EPOCH);

export const Eth1DataOrdered = new ContainerType(
  {
    depositRoot: Root,
    depositCount: UintNumber64,
    blockHash: Bytes32,
    blockNumber: UintNumber64,
  },
  {
    casingMap: {
      depositRoot: "deposit_root",
      depositCount: "deposit_count",
      blockHash: "block_hash",
      blockNumber: "block_number",
    },
  }
);

export const Fork = new ContainerType(
  {
    previousVersion: Version,
    currentVersion: Version,
    epoch: Epoch,
  },
  {
    casingMap: {
      previousVersion: "previous_version",
      currentVersion: "current_version",
      epoch: "epoch",
    },
  }
);

export const ForkData = new ContainerType(
  {
    currentVersion: Version,
    genesisValidatorsRoot: Root,
  },
  {
    casingMap: {
      currentVersion: "current_version",
      genesisValidatorsRoot: "genesis_validators_root",
    },
  }
);

export const ENRForkID = new ContainerType(
  {
    forkDigest: ForkDigest,
    nextForkVersion: Version,
    nextForkEpoch: Epoch,
  },
  {
    casingMap: {
      forkDigest: "fork_digest",
      nextForkVersion: "next_fork_version",
      nextForkEpoch: "next_fork_epoch",
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
    casingMap: {
      blockRoots: "block_roots",
      stateRoots: "state_roots",
    },
  }
);

export const Validator = new ContainerType(
  {
    pubkey: BLSPubkey,
    withdrawalCredentials: Bytes32,
    effectiveBalance: UintNumber64,
    slashed: Boolean,
    activationEligibilityEpoch: Epoch,
    activationEpoch: Epoch,
    exitEpoch: Epoch,
    withdrawableEpoch: Epoch,
  },
  {
    casingMap: {
      pubkey: "pubkey",
      withdrawalCredentials: "withdrawal_credentials",
      effectiveBalance: "effective_balance",
      slashed: "slashed",
      activationEligibilityEpoch: "activation_eligibility_epoch",
      activationEpoch: "activation_epoch",
      exitEpoch: "exit_epoch",
      withdrawableEpoch: "withdrawable_epoch",
    },
  }
);

export const ValidatorContainer = new ContainerType(Validator.fields, Validator.opts);
export const ValidatorNodeStruct = new ContainerNodeStructType(Validator.fields, Validator.opts);

// Export as stand-alone for direct tree optimizations
export const Validators = new ListCompositeType(ValidatorNodeStruct, VALIDATOR_REGISTRY_LIMIT);
export const Balances = new ListBasicType(UintNumber64, VALIDATOR_REGISTRY_LIMIT);
export const RandaoMixes = new VectorCompositeType(Bytes32, EPOCHS_PER_HISTORICAL_VECTOR);
export const Slashings = new VectorBasicType(Gwei, EPOCHS_PER_SLASHINGS_VECTOR);
export const JustificationBits = new BitVectorType(JUSTIFICATION_BITS_LENGTH);

// Misc dependants

export const AttestationData = new ContainerType(
  {
    slot: Slot,
    index: CommitteeIndex,
    beaconBlockRoot: Root,
    source: Checkpoint,
    target: Checkpoint,
  },
  {
    casingMap: {
      slot: "slot",
      index: "index",
      beaconBlockRoot: "beacon_block_root",
      source: "source",
      target: "target",
    },
  }
);

export const IndexedAttestation = new ContainerType(
  {
    attestingIndices: CommitteeIndices,
    data: AttestationData,
    signature: BLSSignature,
  },
  {
    casingMap: {
      attestingIndices: "attesting_indices",
      data: "data",
      signature: "signature",
    },
  }
);

export const PendingAttestation = new ContainerType(
  {
    aggregationBits: CommitteeBits,
    data: AttestationData,
    inclusionDelay: Slot,
    proposerIndex: ValidatorIndex,
  },
  {
    casingMap: {
      aggregationBits: "aggregation_bits",
      data: "data",
      inclusionDelay: "inclusion_delay",
      proposerIndex: "proposer_index",
    },
  }
);

export const SigningData = new ContainerType(
  {
    objectRoot: Root,
    domain: Domain,
  },
  {
    casingMap: {
      objectRoot: "object_root",
      domain: "domain",
    },
  }
);

// Operations types
// ================

export const Attestation = new ContainerType(
  {
    aggregationBits: CommitteeBits,
    data: AttestationData,
    signature: BLSSignature,
  },
  {
    casingMap: {
      aggregationBits: "aggregation_bits",
      data: "data",
      signature: "signature",
    },
  }
);

export const AttesterSlashing = new ContainerType(
  {
    attestation1: IndexedAttestation,
    attestation2: IndexedAttestation,
  },
  {
    // Declaration time casingMap for toJson/fromJson for container <=> json data
    casingMap: {
      attestation1: "attestation_1",
      attestation2: "attestation_2",
    },
  }
);

export const Deposit = new ContainerType({
  proof: new VectorCompositeType(Bytes32, DEPOSIT_CONTRACT_TREE_DEPTH + 1),
  data: DepositData,
});

export const ProposerSlashing = new ContainerType(
  {
    signedHeader1: SignedBeaconBlockHeader,
    signedHeader2: SignedBeaconBlockHeader,
  },
  {
    // Declaration time casingMap for toJson/fromJson for container <=> json data
    casingMap: {
      signedHeader1: "signed_header_1",
      signedHeader2: "signed_header_2",
    },
    typeName: "ProposerSlashing",
  }
);

export const VoluntaryExit = new ContainerType(
  {
    epoch: Epoch,
    validatorIndex: ValidatorIndex,
  },
  {
    casingMap: {
      epoch: "epoch",
      validatorIndex: "validator_index",
    },
  }
);

export const SignedVoluntaryExit = new ContainerType({
  message: VoluntaryExit,
  signature: BLSSignature,
});

// Block types
// ===========

export const BeaconBlockBody = new ContainerType(
  {
    randaoReveal: BLSSignature,
    eth1Data: Eth1Data,
    graffiti: Bytes32,
    proposerSlashings: new ListCompositeType(ProposerSlashing, MAX_PROPOSER_SLASHINGS),
    attesterSlashings: new ListCompositeType(AttesterSlashing, MAX_ATTESTER_SLASHINGS),
    attestations: new ListCompositeType(Attestation, MAX_ATTESTATIONS),
    deposits: new ListCompositeType(Deposit, MAX_DEPOSITS),
    voluntaryExits: new ListCompositeType(SignedVoluntaryExit, MAX_VOLUNTARY_EXITS),
  },
  {
    casingMap: {
      randaoReveal: "randao_reveal",
      eth1Data: "eth1_data",
      graffiti: "graffiti",
      proposerSlashings: "proposer_slashings",
      attesterSlashings: "attester_slashings",
      attestations: "attestations",
      deposits: "deposits",
      voluntaryExits: "voluntary_exits",
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
  {
    casingMap: {
      slot: "slot",
      proposerIndex: "proposer_index",
      parentRoot: "parent_root",
      stateRoot: "state_root",
      body: "body",
    },
  }
);

export const SignedBeaconBlock = new ContainerType({
  message: BeaconBlock,
  signature: BLSSignature,
});

// State types
// ===========

export const EpochAttestations = new ListCompositeType(PendingAttestation, MAX_ATTESTATIONS * SLOTS_PER_EPOCH);

export const BeaconState = new ContainerType(
  {
    // Misc
    genesisTime: UintNumber64,
    genesisValidatorsRoot: Root,
    slot: Slot,
    fork: Fork,
    // History
    latestBlockHeader: BeaconBlockHeader,
    blockRoots: HistoricalBlockRoots,
    stateRoots: HistoricalStateRoots,
    historicalRoots: new ListCompositeType(Root, HISTORICAL_ROOTS_LIMIT),
    // Eth1
    eth1Data: Eth1Data,
    eth1DataVotes: Eth1DataVotes,
    eth1DepositIndex: UintNumber64,
    // Registry
    validators: Validators,
    balances: Balances,
    randaoMixes: RandaoMixes,
    // Slashings
    slashings: Slashings,
    // Attestations
    previousEpochAttestations: EpochAttestations,
    currentEpochAttestations: EpochAttestations,
    // Finality
    justificationBits: JustificationBits,
    previousJustifiedCheckpoint: Checkpoint,
    currentJustifiedCheckpoint: Checkpoint,
    finalizedCheckpoint: Checkpoint,
  },
  {
    casingMap: {
      genesisTime: "genesis_time",
      genesisValidatorsRoot: "genesis_validators_root",
      slot: "slot",
      fork: "fork",
      latestBlockHeader: "latest_block_header",
      blockRoots: "block_roots",
      stateRoots: "state_roots",
      historicalRoots: "historical_roots",
      eth1Data: "eth1_data",
      eth1DataVotes: "eth1_data_votes",
      eth1DepositIndex: "eth1_deposit_index",
      validators: "validators",
      balances: "balances",
      randaoMixes: "randao_mixes",
      slashings: "slashings",
      previousEpochAttestations: "previous_epoch_attestations",
      currentEpochAttestations: "current_epoch_attestations",
      justificationBits: "justification_bits",
      previousJustifiedCheckpoint: "previous_justified_checkpoint",
      currentJustifiedCheckpoint: "current_justified_checkpoint",
      finalizedCheckpoint: "finalized_checkpoint",
    },
  }
);

// Validator types
// ===============

export const CommitteeAssignment = new ContainerType(
  {
    validators: CommitteeIndices,
    committeeIndex: CommitteeIndex,
    slot: Slot,
  },
  {
    casingMap: {
      validators: "validators",
      committeeIndex: "committee_index",
      slot: "slot",
    },
  }
);

export const AggregateAndProof = new ContainerType(
  {
    aggregatorIndex: ValidatorIndex,
    aggregate: Attestation,
    selectionProof: BLSSignature,
  },
  {
    casingMap: {
      aggregatorIndex: "aggregator_index",
      aggregate: "aggregate",
      selectionProof: "selection_proof",
    },
  }
);

export const SignedAggregateAndProof = new ContainerType({
  message: AggregateAndProof,
  signature: BLSSignature,
});

// ReqResp types
// =============

export const Status = new ContainerType(
  {
    forkDigest: ForkDigest,
    finalizedRoot: Root,
    finalizedEpoch: Epoch,
    headRoot: Root,
    headSlot: Slot,
  },
  {
    casingMap: {
      forkDigest: "fork_digest",
      finalizedRoot: "finalized_root",
      finalizedEpoch: "finalized_epoch",
      headRoot: "head_root",
      headSlot: "head_slot",
    },
  }
);

export const Goodbye = UintBigint64;

export const Ping = UintBigint64;

export const Metadata = new ContainerType(
  {
    seqNumber: UintBigint64,
    attnets: AttestationSubnets,
  },
  {
    casingMap: {
      seqNumber: "seq_number",
      attnets: "attnets",
    },
  }
);

export const BeaconBlocksByRangeRequest = new ContainerType(
  {
    startSlot: Slot,
    count: UintNumber64,
    step: UintNumber64,
  },
  {
    casingMap: {
      startSlot: "start_slot",
      count: "count",
      step: "step",
    },
  }
);

export const BeaconBlocksByRootRequest = new ListCompositeType(Root, MAX_REQUEST_BLOCKS);

// Api types
// =========

export const Genesis = new ContainerType(
  {
    genesisValidatorsRoot: Root,
    genesisTime: UintNumber64,
    genesisForkVersion: Version,
  },
  {
    casingMap: {
      genesisValidatorsRoot: "genesis_validators_root",
      genesisTime: "genesis_time",
      genesisForkVersion: "genesis_fork_version",
    },
  }
);
