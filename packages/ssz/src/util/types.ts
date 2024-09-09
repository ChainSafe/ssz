export type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Snapshot = {
  finalized: Uint8Array[];
  root: Uint8Array;
  count: number;
};
