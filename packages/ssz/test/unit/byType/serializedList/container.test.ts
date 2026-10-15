import {describe, expect, it} from "vitest";
import {
  ByteListType,
  ByteVectorType,
  CompatibleUnionType,
  ContainerNodeStructType,
  ContainerType,
  SerializedList,
  UintNumberType,
  toHexString,
} from "../../../../src/index.ts";
import {
  NewListType,
  OldListType,
  createRng,
  progressiveTransactionsPair,
  randomItems,
  transactionsPair,
  transactionsPairs,
} from "./pairs.ts";

// ExecutionPayload like container, with transactions in the middle of other variable size fields
function createPayloadType<T extends OldListType | NewListType>(
  transactionsType: T
): ContainerType<{
  parentHash: ByteVectorType;
  extraData: ByteListType;
  blockNumber: UintNumberType;
  transactions: T;
  withdrawalsRoot: ByteVectorType;
}> {
  return new ContainerType({
    parentHash: new ByteVectorType(32),
    extraData: new ByteListType(32),
    blockNumber: new UintNumberType(8),
    transactions: transactionsType,
    withdrawalsRoot: new ByteVectorType(32),
  });
}

describe("SerializedList types as a container field", () => {
  for (const {id, oldType, newType} of transactionsPairs) {
    describe(id, () => {
      const oldPayloadType = createPayloadType(oldType);
      const newPayloadType = createPayloadType(newType);
      const items = randomItems(createRng(42), 25, "mixed", 2000);
      const common = {
        parentHash: new Uint8Array(32).fill(1),
        extraData: Uint8Array.from([1, 2, 3]),
        blockNumber: 1234,
        withdrawalsRoot: new Uint8Array(32).fill(2),
      };
      const oldPayload = {...common, transactions: items};
      const newPayload = {...common, transactions: SerializedList.fromArray(items)};

      const serialized = oldPayloadType.serialize(oldPayload);
      const rootHex = toHexString(oldPayloadType.hashTreeRoot(oldPayload));

      it("serialize, hashTreeRoot and JSON", () => {
        expect(toHexString(newPayloadType.serialize(newPayload))).toBe(toHexString(serialized));
        expect(toHexString(newPayloadType.hashTreeRoot(newPayload))).toBe(rootHex);
        expect(newPayloadType.toJson(newPayload)).toEqual(oldPayloadType.toJson(oldPayload));
      });

      it("deserialize, transactions at a non-zero offset of the payload bytes", () => {
        for (const reuseBytes of [false, true]) {
          const payload = newPayloadType.deserialize(serialized, {reuseBytes});
          expect(payload.transactions).toBeInstanceOf(SerializedList);
          expect(payload.transactions.toArray()).toEqual(items);
          expect(newPayloadType.equals(payload, newPayload)).toBe(true);
          expect(payload.extraData).toEqual(common.extraData);
          expect(toHexString(newPayloadType.hashTreeRoot(payload))).toBe(rootHex);
          expect(toHexString(newPayloadType.serialize(payload))).toBe(toHexString(serialized));
        }
      });

      it("fromJson", () => {
        const payload = newPayloadType.fromJson(oldPayloadType.toJson(oldPayload));
        expect(newPayloadType.equals(payload, newPayload)).toBe(true);
      });

      it("defaultValue", () => {
        const defaultValue = newPayloadType.defaultValue();
        expect(defaultValue.transactions.length).toBe(0);
        expect(toHexString(newPayloadType.hashTreeRoot(defaultValue))).toBe(
          toHexString(oldPayloadType.hashTreeRoot(oldPayloadType.defaultValue()))
        );
      });

      it("clone and equals", () => {
        const cloned = newPayloadType.clone(newPayload);
        expect(newPayloadType.equals(cloned, newPayload)).toBe(true);
        const otherTxs = {...newPayload, transactions: SerializedList.fromArray(items.slice(1))};
        expect(newPayloadType.equals(otherTxs, newPayload)).toBe(false);
      });

      it("ViewDU: transactions field is the same view class, mutations give the same root", () => {
        const oldViewDU = oldPayloadType.deserializeToViewDU(serialized);
        const newViewDU = newPayloadType.deserializeToViewDU(serialized);
        expect(toHexString(newViewDU.hashTreeRoot())).toBe(rootHex);
        expect(newViewDU.transactions.constructor).toBe(oldViewDU.transactions.constructor);
        expect(newViewDU.transactions.length).toBe(items.length);
        expect(newViewDU.transactions.get(3)).toEqual(items[3]);

        const extra = Uint8Array.from([9, 9, 9]);
        oldViewDU.transactions.push(extra);
        newViewDU.transactions.push(extra);
        oldViewDU.blockNumber = 5;
        newViewDU.blockNumber = 5;
        expect(toHexString(newViewDU.hashTreeRoot())).toBe(toHexString(oldViewDU.hashTreeRoot()));

        // container value from ViewDU has a SerializedList
        const value = newViewDU.toValue();
        expect(value.transactions).toBeInstanceOf(SerializedList);
        expect(value.transactions.toArray()).toEqual([...items, extra]);
        expect(toHexString(newPayloadType.serialize(value))).toBe(toHexString(oldViewDU.serialize()));
      });

      it("ViewDU: set transactions field from a SerializedList", () => {
        const otherItems = randomItems(createRng(1), 4, "small", 2000);
        const oldViewDU = oldPayloadType.deserializeToViewDU(serialized);
        const newViewDU = newPayloadType.deserializeToViewDU(serialized);
        oldViewDU.transactions = oldType.toViewDU(otherItems);
        newViewDU.transactions = newType.toViewDU(SerializedList.fromArray(otherItems));
        expect(toHexString(newViewDU.hashTreeRoot())).toBe(toHexString(oldViewDU.hashTreeRoot()));
      });

      it("View: transactions field is the same view class", () => {
        const oldView = oldPayloadType.deserializeToView(serialized);
        const newView = newPayloadType.deserializeToView(serialized);
        expect(newView.transactions.constructor).toBe(oldView.transactions.constructor);
        expect(toHexString(newView.hashTreeRoot())).toBe(rootHex);
        expect(newView.toValue().transactions).toBeInstanceOf(SerializedList);
      });

      it("standalone view toValue() returns the inner value type", () => {
        // Known gap: a view of the list itself has `inner` as type, so its own toValue() returns Uint8Array[].
        // Use type.toValueFromViewDU() / type.toValueFromView(), or the parent container toValue(), to get a SerializedList
        const viewDU = newType.toViewDU(SerializedList.fromArray(items));
        expect(viewDU.toValue()).toEqual(items);
        expect(newType.toValueFromViewDU(viewDU)).toBeInstanceOf(SerializedList);
      });

      it("ContainerNodeStructType rejects it, same as the old type", () => {
        const fields = {a: new UintNumberType(8)};
        expect(() => new ContainerNodeStructType({...fields, transactions: oldType})).toThrow();
        expect(() => new ContainerNodeStructType({...fields, transactions: newType})).toThrow();
      });
    });
  }
});

describe("CompatibleUnion", () => {
  it("SerializedList types are compatible with their old types", () => {
    expect(() => new CompatibleUnionType({1: transactionsPair.oldType, 2: transactionsPair.newType})).not.toThrow();
    expect(
      () => new CompatibleUnionType({1: progressiveTransactionsPair.oldType, 2: progressiveTransactionsPair.newType})
    ).not.toThrow();
  });

  it("List and ProgressiveList are not compatible", () => {
    expect(
      () => new CompatibleUnionType({1: transactionsPair.newType, 2: progressiveTransactionsPair.newType})
    ).toThrow("not compatible");
  });

  it("serializes the same as the old type", () => {
    const items = randomItems(createRng(2), 3, "small", 2000);
    for (const {oldType, newType} of transactionsPairs) {
      const oldUnion = new CompatibleUnionType({1: oldType});
      const newUnion = new CompatibleUnionType({1: newType});
      const oldValue = {selector: 1, data: items};
      const newValue = {selector: 1, data: SerializedList.fromArray(items)};
      expect(toHexString(newUnion.serialize(newValue))).toBe(toHexString(oldUnion.serialize(oldValue)));
      expect(toHexString(newUnion.hashTreeRoot(newValue))).toBe(toHexString(oldUnion.hashTreeRoot(oldValue)));
    }
  });
});
