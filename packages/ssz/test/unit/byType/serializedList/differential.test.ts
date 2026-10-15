import {Tree} from "@chainsafe/persistent-merkle-tree";
import {describe, expect, it} from "vitest";
import {
  ListCompositeType,
  ProgressiveListCompositeType,
  ProgressiveSerializedListType,
  SerializedList,
  SerializedListType,
  symbolCachedPermanentRoot,
  toHexString,
} from "../../../../src/index.ts";
import {
  ElementSizes,
  ProgressiveTransaction,
  Transaction,
  TypePair,
  asComposite,
  createRng,
  progressiveTransactionsPair,
  randomItems,
  smallLimitPairs,
  transactionsPair,
  transactionsPairs,
} from "./pairs.ts";

// Includes progressive subtree boundaries: subtrees hold 1, 4, 16, 64, 256 chunks -> 1, 5, 21, 85, 341
const counts = [0, 1, 2, 3, 4, 5, 6, 20, 21, 22, 85, 86, 341, 342, 1000];
const sizesList: ElementSizes[] = ["empty", "small", "mixed"];

describe("SerializedList types vs Uint8Array[] list types", () => {
  for (const pair of transactionsPairs) {
    describe(pair.id, () => {
      for (const sizes of sizesList) {
        for (const count of counts) {
          it(`${count} ${sizes} elements`, () => {
            const items = randomItems(createRng(count * 31 + sizes.length), count, sizes, 2000);
            assertCompatible(pair, items);
          });
        }
      }
    });
  }

  for (const pair of smallLimitPairs) {
    describe(pair.id, () => {
      for (let count = 0; count <= pair.oldType.limit; count++) {
        for (const sizes of ["empty", "small", "max"] as ElementSizes[]) {
          it(`${count} ${sizes} elements`, () => {
            const items = randomItems(createRng(count), count, sizes, pair.oldType.elementType.limitBytes);
            assertCompatible(pair, items);
          });
        }
      }
    });
  }
});

/**
 * Asserts that every operation of `newType` on a SerializedList gives the same result as `oldType` on Uint8Array[]
 */
function assertCompatible({oldType, newType}: TypePair, items: Uint8Array[]): void {
  const value = SerializedList.fromArray(items);

  // serialize
  const serialized = oldType.serialize(items);
  expect(toHexString(newType.serialize(value))).toBe(toHexString(serialized));
  expect(newType.value_serializedSize(value)).toBe(oldType.value_serializedSize(items));

  // hashTreeRoot
  const rootHex = toHexString(oldType.hashTreeRoot(items));
  expect(toHexString(newType.hashTreeRoot(value))).toBe(rootHex);

  // deserialize
  const deserialized = newType.deserialize(serialized);
  expect(deserialized.toArray()).toEqual(oldType.deserialize(serialized));
  expect(deserialized.length).toBe(items.length);
  expect(newType.equals(deserialized, value)).toBe(true);
  expect(toHexString(newType.hashTreeRoot(deserialized))).toBe(rootHex);

  // JSON
  const json = oldType.toJson(items);
  expect(newType.toJson(value)).toEqual(json);
  expect(newType.equals(newType.fromJson(json), value)).toBe(true);

  // value <-> tree
  const oldNode = oldType.value_toTree(items);
  const newNode = newType.value_toTree(value);
  expect(toHexString(newNode.root)).toBe(rootHex);
  expect(newType.equals(newType.tree_toValue(oldNode), value)).toBe(true);
  expect(oldType.tree_toValue(newNode)).toEqual(items);
  expect(newType.tree_serializedSize(oldNode)).toBe(serialized.length);
  expect(newType.tree_getLength(oldNode)).toBe(items.length);

  // proofs
  expect(newType.tree_getLeafGindices(BigInt(1), oldNode)).toEqual(oldType.tree_getLeafGindices(BigInt(1), oldNode));
  for (const index of [0, Math.floor(items.length / 2), items.length - 1].filter((i) => i >= 0 && i < items.length)) {
    expect(newType.getPropertyGindex(index)).toBe(oldType.getPropertyGindex(index));
    expect(newType.getIndexProperty(index)).toBe(oldType.getIndexProperty(index));
    expect(newType.getPropertyType(index)).toBe(oldType.getPropertyType(index));

    const proof = asComposite(newType).tree_createProof(newNode, [[index]]);
    expect(proof).toEqual(asComposite(oldType).tree_createProof(oldNode, [[index]]));
    const view = newType.createFromProof(proof, oldNode.root);
    expect(toHexString(view.node.root)).toBe(rootHex);
    expect(view.get(index)).toEqual(items[index]);
  }

  // views
  const newViewDU = newType.deserializeToViewDU(serialized);
  const oldViewDU = oldType.deserializeToViewDU(serialized);
  expect(newViewDU.constructor).toBe(oldViewDU.constructor);
  expect(toHexString(newViewDU.hashTreeRoot())).toBe(rootHex);
  expect(newType.equals(newType.toValueFromViewDU(newViewDU), value)).toBe(true);

  const newView = newType.deserializeToView(serialized);
  expect(newView.constructor).toBe(oldType.deserializeToView(serialized).constructor);
  expect(toHexString(newView.node.root)).toBe(rootHex);
  expect(newType.equals(newType.toValueFromView(newView), value)).toBe(true);

  // mutate through ViewDU, same as old type
  if (items.length < newType.limit) {
    const extra = Uint8Array.from([0xde, 0xad]);
    oldViewDU.push(extra);
    newViewDU.push(extra);
    oldViewDU.commit();
    newViewDU.commit();
    const extendedItems = [...items, extra];
    expect(toHexString(newViewDU.hashTreeRoot())).toBe(toHexString(oldViewDU.hashTreeRoot()));
    expect(toHexString(newViewDU.hashTreeRoot())).toBe(toHexString(oldType.hashTreeRoot(extendedItems)));
    expect(newType.toValueFromViewDU(newViewDU).toArray()).toEqual(extendedItems);
  }
}

describe("SerializedList value is shared by List and ProgressiveList types", () => {
  const items = randomItems(createRng(7), 30, "mixed", 2000);
  const value = SerializedList.fromArray(items);
  const {oldType: oldList, newType: newList} = transactionsPair;
  const {oldType: oldProg, newType: newProg} = progressiveTransactionsPair;

  it("a value deserialized by one type serializes and hashes with the other", () => {
    const fromList = newList.deserialize(oldList.serialize(items));
    const fromProg = newProg.deserialize(oldProg.serialize(items));

    expect(toHexString(newProg.serialize(fromList))).toBe(toHexString(oldProg.serialize(items)));
    expect(toHexString(newProg.hashTreeRoot(fromList))).toBe(toHexString(oldProg.hashTreeRoot(items)));
    expect(toHexString(newList.hashTreeRoot(fromProg))).toBe(toHexString(oldList.hashTreeRoot(items)));
    expect(newList.equals(fromList, fromProg)).toBe(true);
    expect(newProg.equals(fromList, value)).toBe(true);
  });

  it("List and ProgressiveList roots differ, as for the old types", () => {
    expect(toHexString(newList.hashTreeRoot(value))).not.toBe(toHexString(newProg.hashTreeRoot(value)));
  });
});

describe("cachePermanentRootStruct", () => {
  const pairs = [
    {
      oldType: new ListCompositeType(Transaction, 1024, {cachePermanentRootStruct: true}),
      newType: new SerializedListType(Transaction, 1024, {cachePermanentRootStruct: true}),
    },
    {
      oldType: new ProgressiveListCompositeType(ProgressiveTransaction, {cachePermanentRootStruct: true}),
      newType: new ProgressiveSerializedListType(ProgressiveTransaction, {cachePermanentRootStruct: true}),
    },
  ];

  for (const {oldType, newType} of pairs) {
    it(newType.typeName, () => {
      // fresh items per type, the old type caches the root in the items array
      const items = randomItems(createRng(3), 10, "small", 2000);
      const value = SerializedList.fromArray(items);
      const root = newType.hashTreeRoot(value);
      expect(toHexString(root)).toBe(toHexString(oldType.hashTreeRoot(items)));
      expect((value as unknown as Record<symbol, Uint8Array>)[symbolCachedPermanentRoot]).toBe(root);
      // returns the cached root
      expect(newType.hashTreeRoot(value)).toBe(root);
      const output = new Uint8Array(40);
      newType.hashTreeRootInto(value, output, 8);
      expect(toHexString(output.subarray(8))).toBe(toHexString(root));
    });
  }
});

describe("hashTreeRootInto at an offset", () => {
  for (const {oldType, newType} of transactionsPairs) {
    it(newType.typeName, () => {
      const items = randomItems(createRng(11), 9, "mixed", 2000);
      const output = new Uint8Array(96).fill(0xff);
      newType.hashTreeRootInto(SerializedList.fromArray(items), output, 32);
      expect(toHexString(output.subarray(32, 64))).toBe(toHexString(oldType.hashTreeRoot(items)));
      expect(output.subarray(0, 32).every((b) => b === 0xff)).toBe(true);
      expect(output.subarray(64).every((b) => b === 0xff)).toBe(true);
    });
  }
});

describe("MAX_TRANSACTIONS_PER_PAYLOAD empty transactions", () => {
  for (const {oldType, newType} of transactionsPairs) {
    it(`${newType.typeName} - limit and limit + 1`, () => {
      const limit = newType.limit;
      const emptyTx = new Uint8Array(0);
      const items = new Array<Uint8Array>(limit).fill(emptyTx);

      const serialized = oldType.serialize(items);
      const value = newType.deserialize(serialized);
      expect(value.length).toBe(limit);
      expect(value.bytes.length).toBe(serialized.length);
      expect(toHexString(newType.hashTreeRoot(value))).toBe(toHexString(oldType.hashTreeRoot(items)));

      // one more element than the limit
      const overLimit = new Uint8Array(serialized.length + 4);
      const dataView = new DataView(overLimit.buffer);
      for (let i = 0; i <= limit; i++) {
        dataView.setUint32(i * 4, (limit + 1) * 4, true);
      }
      expect(() => newType.deserialize(overLimit)).toThrow(`Invalid list length ${limit + 1} over limit ${limit}`);
    }, 60_000);
  }
});

describe("tree from proof", () => {
  for (const {oldType, newType} of transactionsPairs) {
    it(`${newType.typeName} - createFromProof whole list`, () => {
      const items = randomItems(createRng(5), 6, "small", 2000);
      const node = newType.value_toTree(SerializedList.fromArray(items));
      const proof = asComposite(newType).tree_createProof(node, [[]]);
      const view = newType.createFromProof(proof, node.root);
      expect(newType.equals(newType.toValueFromView(view), SerializedList.fromArray(items))).toBe(true);
      expect(toHexString(new Tree(view.node).root)).toBe(toHexString(oldType.hashTreeRoot(items)));
    });
  }
});
