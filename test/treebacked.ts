import {Node} from "@chainsafe/persistent-merkle-tree";
import {ContainerType, ByteVectorType, BigIntUintType} from "../src";

const Pubkey = new ByteVectorType({length: 96});
const Bytes32 = new ByteVectorType({length: 32});
const Uint64 = new BigIntUintType({byteLength: 8});

interface Validator {
  // BLS public key
  pubkey: Uint8Array;
  // Commitment to pubkey for withdrawals
  withdrawalCredentials: Uint8Array;
  // Balance at stake
  effectiveBalance: bigint;
  // When criteria for activation were met
  activationEligibilityEpoch: bigint;
  // Epoch when validator activated
  activationEpoch: bigint;
  // Epoch when validator exited
  exitEpoch: bigint;
  // When validator can withdraw or transfer funds
  withdrawableEpoch: bigint;
}

const ValidatorSsz = new ContainerType<Validator>({
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

const validator = ValidatorSsz.createTreeBackedFromStruct({
  pubkey: Buffer.alloc(96, 8),
  withdrawalCredentials: Buffer.alloc(32, 9),
  effectiveBalance: BigInt(1),
  activationEligibilityEpoch: BigInt(2),
  activationEpoch: BigInt(3),
  exitEpoch: BigInt(4),
  withdrawableEpoch: BigInt(5),
});

//     1
//  2     3
// 4 5   6 7
//   ...

for (let i = 1; i < 100; i++) {
  try {
    const node = validator.tree.getNode(BigInt(i));
    if (node.isLeaf()) {
      console.log(i, node);
    } else {
      console.log(i, "node");
    }
  } catch (e) {
    //
  }
}

// let node: Node = validator.tree.getNode(BigInt(2));
// while (true) {
//   node = node.left;
//   console.log(node);
// }
