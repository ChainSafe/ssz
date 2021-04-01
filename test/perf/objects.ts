import { BigIntUintType, BitListType, ContainerType, ListType } from "../../src";

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

const MAX_VALIDATORS_PER_COMMITTEE = 2048;

export const CommitteeBits = new BitListType({
  limit: MAX_VALIDATORS_PER_COMMITTEE,
});

export const PendingAttestation = new ContainerType({
  fields: {
    aggregationBits: CommitteeBits,
  }
});
