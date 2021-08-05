import {BigIntUintType, BitListType, ByteVectorType, CompositeType, ContainerType, ListType} from "../../src";

const Gwei = new BigIntUintType({byteLength: 8});
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

const struct: Validator = {
  pubkey: Buffer.alloc(96, 8),
  withdrawalCredentials: Buffer.alloc(32, 9),
  effectiveBalance: BigInt(1),
  activationEligibilityEpoch: BigInt(2),
  activationEpoch: BigInt(3),
  exitEpoch: BigInt(4),
  withdrawableEpoch: BigInt(5),
};

const type = new ContainerType<Validator>({
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

type.struct_convertToTree(struct);
