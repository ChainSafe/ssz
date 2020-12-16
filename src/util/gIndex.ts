export const GINDEX_LEN_PATH = "__len__";
export const FULL_HASH_LENGTH = 32;

type Keys<TRecord> = keyof TRecord;

// Atempt to make Gindex path typesafe
// Idea is to use conditional type to take all keys from all objects.
// Trouble is transition container -> array -> container where it's
// hard to recourse like that to get all keys of all containers

// export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

// export type GIndexContainerPathKeys<TRecord extends ObjectLike, TChild = TRecord[keyof TRecord]> =
//   | Keys<TRecord>
//   | TChild extends ObjectLike
//   ? keyof TChild
//   : never | TChild extends ArrayLike<unknown>
//   ? GindexArrayPathKeys
//   : never;

// export type GindexArrayPathKeys<TArray extends ArrayLike<unknown>> =
//   | typeof GINDEX_LEN_PATH
//   | number
//   | ArrayElement<TArray> extends ObjectLike
//   ? GIndexContainerPathKeys<ArrayElement<TArray>>
//   : never;

// export type GIndexPathKeys<T extends ObjectLike | ArrayLike<unknown>> = T extends (infer E)[]
//   ? GindexArrayPathKeys<T>
//   : GIndexContainerPathKeys<T>;

export type GIndexPathKeys = string | number | typeof GINDEX_LEN_PATH;
