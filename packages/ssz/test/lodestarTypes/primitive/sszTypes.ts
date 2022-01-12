import {ByteVectorType, UintNumberType, BooleanType} from "../../../src";

export const Boolean = new BooleanType();
export const Byte = new UintNumberType(1);
export const Bytes4 = new ByteVectorType(4);
export const Bytes8 = new ByteVectorType(8);
export const Bytes20 = new ByteVectorType(20);
export const Bytes32 = new ByteVectorType(32);
export const Bytes48 = new ByteVectorType(48);
export const Bytes96 = new ByteVectorType(96);
export const Uint8 = new UintNumberType(1);
export const Uint16 = new UintNumberType(2);
export const Uint32 = new UintNumberType(4);
// TODO
// export const Number64 = new Number64UintType();
export const Number64 = new UintNumberType(8);
// TODO
// export const Uint64 = new BigIntUintType({byteLength: 8});
// export const Uint128 = new BigIntUintType({byteLength: 16});
// export const Uint256 = new BigIntUintType({byteLength: 32});
export const Uint64 = new UintNumberType(8);
export const Uint128 = new UintNumberType(16);
export const Uint256 = new UintNumberType(32);

// Custom types, defined for type hinting and readability
export const Slot = Number64;
export const Epoch = Number64;
export const CommitteeIndex = Number64;
export const SubCommitteeIndex = Number64;
export const ValidatorIndex = Number64;
export const Gwei = Uint64;
export const Root = new ByteVectorType(32);
// TODO
// export const Root = new RootType({
//   expandedType: () => {
//     throw new Error("Generic Root type has no expanded type");
//   },
// });
export const Version = Bytes4;
export const DomainType = Bytes4;
export const ForkDigest = Bytes4;
export const BLSPubkey = Bytes48;
export const BLSSignature = Bytes96;
export const Domain = Bytes32;
export const ParticipationFlags = Uint8;
export const ExecutionAddress = Bytes20;
