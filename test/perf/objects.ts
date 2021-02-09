import { BigIntUintType, ListType } from "../../src";

export const Gwei = new BigIntUintType({byteLength: 8});

export const ValidatorBalances = new ListType({
  elementType: Gwei,
  limit: 200000,
});