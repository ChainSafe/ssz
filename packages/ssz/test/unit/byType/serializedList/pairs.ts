import {Node} from "@chainsafe/persistent-merkle-tree";
import {
  ByteListType,
  CompositeType,
  CompositeTypeAny,
  ListCompositeType,
  ProgressiveByteListType,
  ProgressiveListCompositeType,
  ProgressiveSerializedListType,
  SerializedList,
  SerializedListElementType,
  SerializedListType,
} from "../../../../src/index.ts";
import {preset} from "../../../lodestarTypes/params.ts";

// 2^30 and 2^20 in both minimal and mainnet presets
const {MAX_BYTES_PER_TRANSACTION, MAX_TRANSACTIONS_PER_PAYLOAD} = preset;

// List and ProgressiveList views have different classes
type ListTypeOf<V> = CompositeType<V, any, any> & {
  readonly limit: number;
  readonly elementType: SerializedListElementType;
  tree_getLength(node: Node): number;
};

/** ListCompositeType or ProgressiveListCompositeType of ByteListType or ProgressiveByteListType */
export type OldListType = ListTypeOf<Uint8Array[]>;
/** SerializedListType or ProgressiveSerializedListType */
export type NewListType = ListTypeOf<SerializedList>;

/**
 * A SerializedList type and the `Uint8Array[]` list type it must be compatible with.
 */
export type TypePair = {
  id: string;
  oldType: OldListType;
  newType: NewListType;
};

// Same as lodestar bellatrix types
export const Transaction = new ByteListType(MAX_BYTES_PER_TRANSACTION);

export const transactionsPair: TypePair = {
  id: "bellatrix Transactions",
  oldType: new ListCompositeType(Transaction, MAX_TRANSACTIONS_PER_PAYLOAD),
  newType: new SerializedListType(Transaction, MAX_TRANSACTIONS_PER_PAYLOAD),
};

// Same as lodestar gloas types
export const ProgressiveTransaction = new ProgressiveByteListType({
  typeName: "Transaction",
  limit: MAX_BYTES_PER_TRANSACTION,
});

export const progressiveTransactionsPair: TypePair = {
  id: "gloas Transactions",
  oldType: new ProgressiveListCompositeType(ProgressiveTransaction, {
    typeName: "Transactions",
    limit: MAX_TRANSACTIONS_PER_PAYLOAD,
  }),
  newType: new ProgressiveSerializedListType(ProgressiveTransaction, {
    typeName: "Transactions",
    limit: MAX_TRANSACTIONS_PER_PAYLOAD,
  }),
};

/** Production types, MAX_TRANSACTIONS_PER_PAYLOAD = 2^20 and MAX_BYTES_PER_TRANSACTION = 2^30 */
export const transactionsPairs = [transactionsPair, progressiveTransactionsPair];

// Small limits so that over-limit inputs are practical to build
export const SMALL_LIMIT = 4;
export const SMALL_LIMIT_BYTES = 8;
const SmallTransaction = new ByteListType(SMALL_LIMIT_BYTES);
const SmallProgressiveTransaction = new ProgressiveByteListType({limit: SMALL_LIMIT_BYTES});

export const smallLimitPairs: TypePair[] = [
  {
    id: "List of ByteList small limit",
    oldType: new ListCompositeType(SmallTransaction, SMALL_LIMIT),
    newType: new SerializedListType(SmallTransaction, SMALL_LIMIT),
  },
  {
    id: "ProgressiveList of ProgressiveByteList small limit",
    oldType: new ProgressiveListCompositeType(SmallProgressiveTransaction, {limit: SMALL_LIMIT}),
    newType: new ProgressiveSerializedListType(SmallProgressiveTransaction, {limit: SMALL_LIMIT}),
  },
  // Not used in production, the other element type of each list type
  {
    id: "List of ProgressiveByteList small limit",
    oldType: new ListCompositeType(SmallProgressiveTransaction, SMALL_LIMIT),
    newType: new SerializedListType(SmallProgressiveTransaction, SMALL_LIMIT),
  },
  {
    id: "ProgressiveList of ByteList small limit",
    oldType: new ProgressiveListCompositeType(SmallTransaction, {limit: SMALL_LIMIT}),
    newType: new ProgressiveSerializedListType(SmallTransaction, {limit: SMALL_LIMIT}),
  },
];

export const zeroLimitProgressivePair: TypePair = {
  id: "ProgressiveList limit 0",
  oldType: new ProgressiveListCompositeType(SmallProgressiveTransaction, {limit: 0}),
  newType: new ProgressiveSerializedListType(SmallProgressiveTransaction, {limit: 0}),
};

/** Deterministic PRNG (mulberry32) so failures are reproducible */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomBytes(rng: () => number, length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(rng() * 256);
  }
  return bytes;
}

export type ElementSizes = "empty" | "small" | "mixed" | "max";

/** Random list of `count` elements, sizes depending on `sizes` and never over `maxBytes` */
export function randomItems(rng: () => number, count: number, sizes: ElementSizes, maxBytes: number): Uint8Array[] {
  const items: Uint8Array[] = [];
  for (let i = 0; i < count; i++) {
    let length: number;
    switch (sizes) {
      case "empty":
        length = 0;
        break;
      case "small":
        length = Math.floor(rng() * 100);
        break;
      case "mixed":
        // include empty, sub-chunk, exactly 1 chunk / block and multi-block elements
        length = [0, 1, 31, 32, 33, 63, 64, 65, 200, 2000][Math.floor(rng() * 10)];
        break;
      case "max":
        length = maxBytes;
        break;
    }
    items.push(randomBytes(rng, Math.min(length, maxBytes)));
  }
  return items;
}

/** Returns the message of the error thrown by `fn`, throws if `fn` does not throw */
export function getErrorMessage(fn: () => unknown): string {
  try {
    fn();
  } catch (e) {
    return (e as Error).message;
  }
  throw Error("Expected function to throw");
}

export function asComposite(type: TypePair["oldType"] | TypePair["newType"]): CompositeTypeAny {
  return type as unknown as CompositeTypeAny;
}
