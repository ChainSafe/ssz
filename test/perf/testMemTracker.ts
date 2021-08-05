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

if (global.gc) {
  global.gc();
  console.log("@@@ called gc");
}
const treeBacked = ValidatorListType.createTreeBackedFromStruct(value);
const tracker = new MemoryTracker();
tracker.logDiff("start");
const start = Date.now();
const root = treeBacked.hashTreeRoot();
console.log("@@@ get root in", Date.now() - start, "ms");
tracker.logDiff("hashTreeRoot");
console.log("@@@ root=", toHexString(root));

// default on Aug 05
// @@@ logDiff start heapUsed 866.96332MB
// start                rss +0.385024MB      heapTotal  0MB             heapUsed +0.003976MB      external +0.00004MB       arrayBuffers  0MB
// @@@ get root in 4392 ms
// @@@ logDiff hashTreeRoot heapUsed 1337.146328MB
// hashTreeRoot         rss -0.9216MB        heapTotal +471.40864MB     heapUsed +470.183008MB    external  0MB             arrayBuffers  0MB
// @@@ root= 0xa5794c15630904169c6c57706cece478aeb313e38ceb543908fbe7dd9615b466

// IHashObject on Aug 05
// @@@ logDiff start heapUsed 675.576088MB
// start                rss  0MB             heapTotal  0MB             heapUsed +0.001888MB      external +0.00004MB       arrayBuffers  0MB
// @@@ get root in 2643 ms
// @@@ logDiff hashTreeRoot heapUsed 671.404736MB
// hashTreeRoot         rss -532.598784MB    heapTotal +8.413184MB      heapUsed -4.171352MB      external  0MB             arrayBuffers  0MB
// @@@ root= 0xa5794c15630904169c6c57706cece478aeb313e38ceb543908fbe7dd9615b466

// @@@ logDiff start heapUsed 470.312304MB
// start                rss +0.004096MB      heapTotal  0MB             heapUsed +0.080592MB      external +0.00004MB       arrayBuffers  0MB
// @@@ get root in 7161 ms
// @@@ logDiff hashTreeRoot heapUsed 576.705656MB
// hashTreeRoot         rss +693.014528MB    heapTotal +112.984064MB    heapUsed +106.393352MB    external +0.090112MB      arrayBuffers +0.090112MB
// @@@ root= 0xa5794c15630904169c6c57706cece478aeb313e38ceb543908fbe7dd9615b466

// summary
// |#|master (Uint8Array)| HashObject (8 numbers)|bigint|
// |-|-------|-----------|------|
// |used heap before hashTreeRoot(MB)|866|675|470|
// |used heap after hashTreeRoot(MB)|1337 (+470)|671 (-4)|576 (+106)|
// |hashTreeRoot (ms)|4392|2643|7161|
