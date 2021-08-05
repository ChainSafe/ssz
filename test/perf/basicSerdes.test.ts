import {zeroNode} from "@chainsafe/persistent-merkle-tree/lib/zeroNode";
import {BranchNode, LeafNode} from "@chainsafe/persistent-merkle-tree/lib/node";
import {Tree} from "@chainsafe/persistent-merkle-tree/lib/tree";
import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {
  BigIntUintType,
  BitListType,
  ByteVectorType,
  CompositeType,
  ContainerType,
  NumberUintType,
  ListType,
} from "../../src";

const zeroBuf = Buffer.alloc(32, 0);
const infBuf = Buffer.alloc(32, 0xff);

describe("SSZ (de)serialize", () => {
  setBenchOpts({
    maxMs: 60 * 1000,
    minMs: 2 * 1000,
    runs: 1024,
  });

  interface Validator {
    pubkey: Uint8Array;
    withdrawalCredentials: Uint8Array;
    effectiveBalance: bigint;
    activationEligibilityEpoch: bigint;
    activationEpoch: bigint;
    exitEpoch: bigint;
    withdrawableEpoch: bigint;
  }

  const Gwei = new BigIntUintType({byteLength: 8});
  const Pubkey = new ByteVectorType({length: 96});
  const Bytes32 = new ByteVectorType({length: 32});
  const Uint64 = new BigIntUintType({byteLength: 8});
  const Num64 = new NumberUintType({byteLength: 8});

  const ValidatorType = new ContainerType<Validator>({
    fields: {
      pubkey: Pubkey,
      withdrawalCredentials: Bytes32,
      effectiveBalance: Uint64,
      activationEligibilityEpoch: Uint64,
      activationEpoch: Uint64,
      exitEpoch: Uint64,
      withdrawableEpoch: Uint64,
    },
  });

  // Raw transformations

  const pubkey = Buffer.alloc(96, 5);
  const validator: Validator = {
    pubkey: Buffer.alloc(96, 8),
    withdrawalCredentials: Buffer.alloc(32, 9),
    effectiveBalance: BigInt(32e9),
    activationEligibilityEpoch: BigInt(1_500_000),
    activationEpoch: BigInt(1_550_000),
    exitEpoch: BigInt(0xffffffff),
    withdrawableEpoch: BigInt(0xffffffff),
  };

  // All:             1.45 us
  // All - pubkey:    1.05 us
  // All - Uint:      0.99 us

  const validatorNum = {
    pubkey: Buffer.alloc(96, 8),
    withdrawalCredentials: Buffer.alloc(32, 9),
    effectiveBalance: 32e9,
    activationEligibilityEpoch: 1_500_000,
    activationEpoch: 1_550_000,
    exitEpoch: Infinity,
    withdrawableEpoch: Infinity,
  };

  // itBench(`Validator - createTreeBackedFromStruct`, () => {
  //   ValidatorType.createTreeBackedFromStruct(validator);
  // });

  // itBench(`Validator - custom to tree bigint`, () => {
  const pubkey_n4 = new LeafNode(validator.pubkey.slice(0, 32));
  const pubkey_n5 = new LeafNode(validator.pubkey.slice(32, 64));
  const pubkey_n6 = new LeafNode(validator.pubkey.slice(64, 96));
  const pubkey_n2 = new BranchNode(pubkey_n4, pubkey_n5);
  const pubkey_n3 = new BranchNode(pubkey_n6, zeroNode(0));
  const pubkey_n1 = new BranchNode(pubkey_n2, pubkey_n3);

  const v_8 = pubkey_n1;
  const v_9 = new LeafNode(validator.withdrawalCredentials);
  const v_10 = new LeafNode(bigintToBuffer(validator.effectiveBalance));
  const v_11 = new LeafNode(bigintToBuffer(validator.activationEligibilityEpoch));
  const v_12 = new LeafNode(bigintToBuffer(validator.activationEpoch));
  const v_13 = new LeafNode(bigintToBuffer(validator.exitEpoch));
  const v_14 = new LeafNode(bigintToBuffer(validator.withdrawableEpoch));

  const v_4 = new BranchNode(v_8, v_9);
  const v_5 = new BranchNode(v_10, v_11);
  const v_6 = new BranchNode(v_12, v_13);
  const v_7 = new BranchNode(v_14, zeroNode(0));

  const v_2 = new BranchNode(v_4, v_5);
  const v_3 = new BranchNode(v_6, v_7);

  const v_1 = new BranchNode(v_2, v_3);
  const tree = new Tree(v_1);
  // });

  itBench(`Validator - custom to tree number`, () => {
    const pubkey_n4 = new LeafNode(validatorNum.pubkey.slice(0, 32));
    const pubkey_n5 = new LeafNode(validatorNum.pubkey.slice(32, 64));
    const pubkey_n6 = new LeafNode(validatorNum.pubkey.slice(64, 96));
    const pubkey_n2 = new BranchNode(pubkey_n4, pubkey_n5);
    const pubkey_n3 = new BranchNode(pubkey_n6, zeroNode(0));
    const pubkey_n1 = new BranchNode(pubkey_n2, pubkey_n3);

    const v_8 = pubkey_n1;
    const v_9 = new LeafNode(validatorNum.withdrawalCredentials);
    const v_10 = new LeafNode(numToBuffer(validatorNum.effectiveBalance));
    const v_11 = new LeafNode(numToBuffer(validatorNum.activationEligibilityEpoch));
    const v_12 = new LeafNode(numToBuffer(validatorNum.activationEpoch));
    const v_13 = new LeafNode(numToBuffer(validatorNum.exitEpoch));
    const v_14 = new LeafNode(numToBuffer(validatorNum.withdrawableEpoch));

    const v_4 = new BranchNode(v_8, v_9);
    const v_5 = new BranchNode(v_10, v_11);
    const v_6 = new BranchNode(v_12, v_13);
    const v_7 = new BranchNode(v_14, zeroNode(0));

    const v_2 = new BranchNode(v_4, v_5);
    const v_3 = new BranchNode(v_6, v_7);

    const v_1 = new BranchNode(v_2, v_3);
    const tree = new Tree(v_1);
  });

  // for (const uint of [15, 150_000, 15_000_000]) {
  //   itBench(`Uint8 -> bytes ${uint} - writeInt32LE`, () => {
  //     const buf = Buffer.alloc(32, 0);
  //     buf.writeInt32LE(uint, 0);
  //   });

  //   itBench(`Uint8 -> bytes ${uint} - Num64.serialize`, () => {
  //     Num64.serialize(uint);
  //   });
  // }
});

function bigintToBuffer(bigint: bigint): Buffer {
  const buf = Buffer.alloc(32, 0);
  buf.writeBigUInt64LE(bigint);
  return buf;
}

function numToBuffer(num: number): Buffer {
  if (num === 0) return zeroBuf;
  if (num === Infinity) return infBuf;

  const buf = Buffer.alloc(32, 0);
  if (num > 4294967295) {
    buf.writeDoubleLE(num, 0);
  } else {
    buf.writeUInt32LE(num, 0);
  }
  return buf;
}
