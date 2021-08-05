import {BranchNode, LeafNode, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";

interface Validator {
  pubkey: Uint8Array;
  withdrawalCredentials: Uint8Array;
  effectiveBalance: number;
  activationEligibilityEpoch: number;
  activationEpoch: number;
  exitEpoch: number;
  withdrawableEpoch: number;
}

const zeroBuf = Buffer.alloc(32, 0);
const infBuf = Buffer.alloc(32, 0xff);

const validator: Validator = {
  pubkey: Buffer.alloc(96, 8),
  withdrawalCredentials: Buffer.alloc(32, 9),
  effectiveBalance: 32e9,
  activationEligibilityEpoch: 1_500_000,
  activationEpoch: 1_550_000,
  exitEpoch: Infinity,
  withdrawableEpoch: Infinity,
};

while (true) {
  validatorToTree(validator);
}

function validatorToTree(validator: Validator): Tree {
  const pubkey_n4 = new LeafNode(validator.pubkey.slice(0, 32));
  const pubkey_n5 = new LeafNode(validator.pubkey.slice(32, 64));
  const pubkey_n6 = new LeafNode(validator.pubkey.slice(64, 96));
  const pubkey_n2 = new BranchNode(pubkey_n4, pubkey_n5);
  const pubkey_n3 = new BranchNode(pubkey_n6, zeroNode(0));
  const pubkey_n1 = new BranchNode(pubkey_n2, pubkey_n3);

  const v_8 = pubkey_n1;
  const v_9 = new LeafNode(validator.withdrawalCredentials);
  const v_10 = new LeafNode(numToBuffer(validator.effectiveBalance));
  const v_11 = new LeafNode(numToBuffer(validator.activationEligibilityEpoch));
  const v_12 = new LeafNode(numToBuffer(validator.activationEpoch));
  const v_13 = new LeafNode(numToBuffer(validator.exitEpoch));
  const v_14 = new LeafNode(numToBuffer(validator.withdrawableEpoch));

  const v_4 = new BranchNode(v_8, v_9);
  const v_5 = new BranchNode(v_10, v_11);
  const v_6 = new BranchNode(v_12, v_13);
  const v_7 = new BranchNode(v_14, zeroNode(0));

  const v_2 = new BranchNode(v_4, v_5);
  const v_3 = new BranchNode(v_6, v_7);

  const v_1 = new BranchNode(v_2, v_3);
  return new Tree(v_1);
}

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
