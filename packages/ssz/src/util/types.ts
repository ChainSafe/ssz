export type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * A snapshot contains the minimum amount of information needed to reconstruct a merkleized list, for the purposes of appending more items.
 * Note: This does not contain list elements, rather only contains intermediate merkle nodes.
 * This is used primarily for PartialListCompositeType.
 */
export type Snapshot = {
  finalized: Uint8Array[];
  root: Uint8Array;
  count: number;
};
