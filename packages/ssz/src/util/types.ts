export type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Snapshot for PartialListCompositeType */
export type Snapshot = {
  finalized: Uint8Array[];
  root: Uint8Array;
  count: number;
};
