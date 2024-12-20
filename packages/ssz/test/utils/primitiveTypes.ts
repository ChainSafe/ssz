// Adapted from https://github.com/prysmaticlabs/prysm/blob/master/shared/ssz/encode_test.go#L296
import {UintBigintType, ByteVectorType, UintNumberType} from "../../src/index.js";

export const byteType = new UintNumberType(1);
export const bytes2Type = new ByteVectorType(2);
export const bytes4Type = new ByteVectorType(4);
export const bytes8Type = new ByteVectorType(8);
export const bytes32Type = new ByteVectorType(32);

export const uint16BnType = new UintBigintType(2);
export const uint64BnType = new UintBigintType(8);
export const uint128BnType = new UintBigintType(16);
export const uint256BnType = new UintBigintType(32);

export const uint16NumType = new UintNumberType(2);
export const uint32NumType = new UintNumberType(4);
export const uint64NumType = new UintNumberType(8);
export const uint64NumInfType = new UintNumberType(8, {clipInfinity: true});
