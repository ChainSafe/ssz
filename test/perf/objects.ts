import { BigIntUintType, ContainerType, ListType } from "../../src";

export const Gwei = new BigIntUintType({byteLength: 8});

export const ValidatorBalances = new ListType({
  elementType: Gwei,
  limit: 200000,
});

export const BeaconState = new ContainerType({
  fields: {
    balances: ValidatorBalances,
  }
});
