import {
  BitListType,
  BitVectorType,
  ContainerType,
  ListBasicType,
  ListCompositeType,
  VectorBasicType,
  VectorCompositeType,
} from "../../../src/v2";
import {
  ATTESTATION_SUBNET_COUNT,
  DEPOSIT_CONTRACT_TREE_DEPTH,
  EPOCHS_PER_ETH1_VOTING_PERIOD,
  EPOCHS_PER_HISTORICAL_VECTOR,
  EPOCHS_PER_SLASHINGS_VECTOR,
  HISTORICAL_ROOTS_LIMIT,
  JUSTIFICATION_BITS_LENGTH,
  MAX_ATTESTATIONS,
  MAX_ATTESTER_SLASHINGS,
  MAX_DEPOSITS,
  MAX_PROPOSER_SLASHINGS,
  MAX_REQUEST_BLOCKS,
  MAX_VALIDATORS_PER_COMMITTEE,
  MAX_VOLUNTARY_EXITS,
  SLOTS_PER_EPOCH,
  SLOTS_PER_HISTORICAL_ROOT,
  VALIDATOR_REGISTRY_LIMIT,
} from "@chainsafe/lodestar-params";
import * as primitiveSsz from "../primitive/sszTypes";
import {LazyVariable} from "../utils/lazyVar";

const {
  Boolean,
  Bytes32,
  Number64,
  Uint64,
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

// So the expandedRoots can be referenced, and break the circular dependency
const typesRef = new LazyVariable<{
  BeaconBlock: ContainerType<any>;
  BeaconState: ContainerType<any>;
}>();

// Misc types
// ==========

export const AttestationSubnets = new BitVectorType(ATTESTATION_SUBNET_COUNT);

export const BeaconBlockHeader = new ContainerType({
  slot: Slot,
  proposerIndex: ValidatorIndex,
  parentRoot: Root,
  stateRoot: Root,
  bodyRoot: Root,
});

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

export const DepositMessage = new ContainerType({
  pubkey: BLSPubkey,
  withdrawalCredentials: Bytes32,
  amount: Number64,
});

export const DepositData = new ContainerType({
  pubkey: BLSPubkey,
  withdrawalCredentials: Bytes32,
  amount: Number64,
  signature: BLSSignature,
});

export const DepositDataRootList = new ListCompositeType(Root, 2 ** DEPOSIT_CONTRACT_TREE_DEPTH);

export const DepositEvent = new ContainerType({
  depositData: DepositData,
  blockNumber: Number64,
  index: Number64,
});

export const Eth1Data = new ContainerType({
  depositRoot: Root,
  depositCount: Number64,
  blockHash: Bytes32,
});

export const Eth1DataVotes = new ListCompositeType(Eth1Data, EPOCHS_PER_ETH1_VOTING_PERIOD * SLOTS_PER_EPOCH);

export const Eth1DataOrdered = new ContainerType({
  depositRoot: Root,
  depositCount: Number64,
  blockHash: Bytes32,
  blockNumber: Number64,
});

export const Fork = new ContainerType({
  previousVersion: Version,
  currentVersion: Version,
  epoch: Epoch,
});

export const ForkData = new ContainerType({
  currentVersion: Version,
  genesisValidatorsRoot: Root,
});

export const ENRForkID = new ContainerType({
  forkDigest: ForkDigest,
  nextForkVersion: Version,
  nextForkEpoch: Epoch,
});

export const HistoricalBlockRoots = new VectorCompositeType(Root, SLOTS_PER_HISTORICAL_ROOT);
export const HistoricalStateRoots = new VectorCompositeType(Root, SLOTS_PER_HISTORICAL_ROOT);

export const HistoricalBatch = new ContainerType({
  blockRoots: HistoricalBlockRoots,
  stateRoots: HistoricalStateRoots,
});

export const Validator = new ContainerType({
  pubkey: BLSPubkey,
  withdrawalCredentials: Bytes32,
  effectiveBalance: Number64,
  slashed: Boolean,
  activationEligibilityEpoch: Epoch,
  activationEpoch: Epoch,
  exitEpoch: Epoch,
  withdrawableEpoch: Epoch,
});

// Export as stand-alone for direct tree optimizations
export const Validators = new ListCompositeType(Validator, VALIDATOR_REGISTRY_LIMIT);
export const Balances = new ListBasicType(Number64, VALIDATOR_REGISTRY_LIMIT);
export const RandaoMixes = new VectorCompositeType(Bytes32, EPOCHS_PER_HISTORICAL_VECTOR);
export const Slashings = new VectorBasicType(Gwei, EPOCHS_PER_SLASHINGS_VECTOR);
export const JustificationBits = new BitVectorType(JUSTIFICATION_BITS_LENGTH);

// Misc dependants

export const AttestationData = new ContainerType({
  slot: Slot,
  index: CommitteeIndex,
  beaconBlockRoot: Root,
  source: Checkpoint,
  target: Checkpoint,
});

export const IndexedAttestation = new ContainerType({
  attestingIndices: CommitteeIndices,
  data: AttestationData,
  signature: BLSSignature,
});

export const PendingAttestation = new ContainerType({
  aggregationBits: CommitteeBits,
  data: AttestationData,
  inclusionDelay: Slot,
  proposerIndex: ValidatorIndex,
});

export const SigningData = new ContainerType({
  objectRoot: Root,
  domain: Domain,
});

// Operations types
// ================

export const Attestation = new ContainerType({
  aggregationBits: CommitteeBits,
  data: AttestationData,
  signature: BLSSignature,
});

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
  }
);

export const VoluntaryExit = new ContainerType({
  epoch: Epoch,
  validatorIndex: ValidatorIndex,
});

export const SignedVoluntaryExit = new ContainerType({
  message: VoluntaryExit,
  signature: BLSSignature,
});

// Block types
// ===========

export const BeaconBlockBody = new ContainerType({
  randaoReveal: BLSSignature,
  eth1Data: Eth1Data,
  graffiti: Bytes32,
  proposerSlashings: new ListCompositeType(ProposerSlashing, MAX_PROPOSER_SLASHINGS),
  attesterSlashings: new ListCompositeType(AttesterSlashing, MAX_ATTESTER_SLASHINGS),
  attestations: new ListCompositeType(Attestation, MAX_ATTESTATIONS),
  deposits: new ListCompositeType(Deposit, MAX_DEPOSITS),
  voluntaryExits: new ListCompositeType(SignedVoluntaryExit, MAX_VOLUNTARY_EXITS),
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

// State types
// ===========

export const EpochAttestations = new ListCompositeType(PendingAttestation, MAX_ATTESTATIONS * SLOTS_PER_EPOCH);

export const BeaconState = new ContainerType({
  // Misc
  genesisTime: Number64,
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
  eth1DepositIndex: Number64,
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
});

// Validator types
// ===============

export const CommitteeAssignment = new ContainerType({
  validators: CommitteeIndices,
  committeeIndex: CommitteeIndex,
  slot: Slot,
});

export const AggregateAndProof = new ContainerType({
  aggregatorIndex: ValidatorIndex,
  aggregate: Attestation,
  selectionProof: BLSSignature,
});

export const SignedAggregateAndProof = new ContainerType({
  message: AggregateAndProof,
  signature: BLSSignature,
});

// ReqResp types
// =============

export const Status = new ContainerType({
  forkDigest: ForkDigest,
  finalizedRoot: Root,
  finalizedEpoch: Epoch,
  headRoot: Root,
  headSlot: Slot,
});

export const Goodbye = Uint64;

export const Ping = Uint64;

export const Metadata = new ContainerType({
  seqNumber: Uint64,
  attnets: AttestationSubnets,
});

export const BeaconBlocksByRangeRequest = new ContainerType({
  startSlot: Slot,
  count: Number64,
  step: Number64,
});

export const BeaconBlocksByRootRequest = new ListCompositeType(Root, MAX_REQUEST_BLOCKS);

// Api types
// =========

export const Genesis = new ContainerType({
  genesisValidatorsRoot: Root,
  genesisTime: Uint64,
  genesisForkVersion: Version,
});

// MUST set typesRef here, otherwise expandedType() calls will throw
typesRef.set({BeaconBlock, BeaconState});
