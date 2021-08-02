import { BigIntUintType, booleanType, ByteVector, ByteVectorType, ContainerType, ListType, NumberUintType, toHexString } from "../../src";
import { MemoryTracker } from "./utils/memTracker";

const VALIDATOR_REGISTRY_LIMIT = 1099511627776;

type Bytes48 = ByteVector;
type Bytes32 = ByteVector;
type BLSPubkey = Bytes48;
type Uint64 = bigint;
type Epoch = Number64;
type Number64 = number;
type Gwei = Uint64;

export interface Validator {
  // BLS public key
  pubkey: BLSPubkey;
  // Commitment to pubkey for withdrawals
  withdrawalCredentials: Bytes32;
  // Balance at stake
  effectiveBalance: Gwei;
  // Was the validator slashed
  slashed: boolean;
  // When criteria for activation were met
  activationEligibilityEpoch: Epoch;
  // Epoch when validator activated
  activationEpoch: Epoch;
  // Epoch when validator exited
  exitEpoch: Epoch;
  // When validator can withdraw or transfer funds
  withdrawableEpoch: Epoch;
}

const BLSPubkeyType = new ByteVectorType({length: 48});
const Bytes32Type = new ByteVectorType({length: 32});
const GweiType = new BigIntUintType({byteLength: 8});
const EpochType = new NumberUintType({byteLength: 8});

export const ValidatorType = new ContainerType<Validator>({
  fields: {
    pubkey: BLSPubkeyType,
    withdrawalCredentials: Bytes32Type,
    effectiveBalance: GweiType,
    slashed: booleanType,
    activationEligibilityEpoch: EpochType,
    activationEpoch: EpochType,
    exitEpoch: EpochType,
    withdrawableEpoch: EpochType,
  },
});

const ValidatorListType = new ListType({elementType: ValidatorType, limit: VALIDATOR_REGISTRY_LIMIT})

const numValidator = 250000;
const value = Array.from({length: numValidator}, (_, i) => ({
  pubkey: Buffer.alloc(0, i % 10),
  withdrawalCredentials: Buffer.alloc(32, i),
  effectiveBalance: BigInt(31000000000),
  slashed: false,
  activationEligibilityEpoch: 0,
  activationEpoch: 0,
  exitEpoch: Infinity,
  withdrawableEpoch: Infinity,
}));
const treeBacked = ValidatorListType.createTreeBackedFromStruct(value);
const tracker = new MemoryTracker();
tracker.logDiff("start");
const root = treeBacked.hashTreeRoot();
tracker.logDiff("hashTreeRoot");
console.log("@@@ root=", toHexString(root));

// default
// start                rss  0MB             heapTotal  0MB             heapUsed +0.00484MB       external +0.00004MB       arrayBuffers  0MB
// hashTreeRoot         rss +7.200768MB      heapTotal +474.570752MB    heapUsed +460.123896MB    external  0MB             arrayBuffers  0MB
// @@@ root= 0xa5794c15630904169c6c57706cece478aeb313e38ceb543908fbe7dd9615b466

// IHashObject
// @@@ logDiff start heapUsed 1067814056
// start                rss  0MB             heapTotal  0MB             heapUsed +0.001888MB      external +0.00004MB       arrayBuffers  0MB
// @@@ logDiff hashTreeRoot heapUsed 1072769680
// hashTreeRoot         rss +7.442432MB      heapTotal +7.340032MB      heapUsed +4.955624MB      external  0MB             arrayBuffers  0MB
// @@@ root= 0xa5794c15630904169c6c57706cece478aeb313e38ceb543908fbe7dd9615b466