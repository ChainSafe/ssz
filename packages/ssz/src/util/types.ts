import {zeroNode} from "@chainsafe/persistent-merkle-tree";

export type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Snapshot = {
  finalized: Uint8Array[];
  root: Uint8Array;
  count: number;
};

export const ZERO_SNAPSHOT = {
  finalized: [],
  root: zeroNode(0).root,
  count: 0,
};
