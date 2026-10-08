import {Tree} from "@chainsafe/persistent-merkle-tree";
import {describe, expect, expectTypeOf, it} from "vitest";
import {ContainerNodeStructType, ContainerType, ListBasicType, UintNumberType} from "../../../../src/index.ts";
import {byteType, uint64NumInfType} from "../../../utils/primitiveTypes.ts";

const uint16 = new UintNumberType(2);

// Run the same suite for both ContainerType and ContainerNodeStructType to confirm both honor
// the "ephemerals are excluded from consensus, included on value/View/ViewDU" contract.
for (const Variant of [ContainerType, ContainerNodeStructType] as const) {
  const variantName = Variant === ContainerType ? "ContainerType" : "ContainerNodeStructType";

  describe(`${variantName} ephemeralFields`, () => {
    const consensusFields = {a: uint64NumInfType, b: uint64NumInfType};
    const ephemeralFields = {total: uint64NumInfType, tag: byteType};

    const typeWith = new Variant(consensusFields, {
      typeName: `${variantName}WithEphemerals`,
      ephemeralFields,
    });
    const typeWithout = new Variant(consensusFields, {typeName: `${variantName}NoEphemerals`});

    it("does not advertise ephemeral fields as consensus fields", () => {
      expect(typeWith.fieldsEntries).toHaveLength(2);
      expect(typeWith.maxChunkCount).toBe(2);
      expect(typeWith.depth).toBe(typeWithout.depth);
      expect(typeWith.fixedSize).toBe(typeWithout.fixedSize);

      expect(typeWith.ephemeralFieldsEntries).toHaveLength(2);
      expect(typeWith.ephemeralFieldsEntries.map((e) => e.fieldName)).toEqual(["total", "tag"]);
    });

    it("rejects ephemeral field names that collide with consensus fields", () => {
      expect(
        () =>
          new Variant(consensusFields, {
            ephemeralFields: {a: uint64NumInfType},
          })
      ).toThrow(/collides/);
    });

    it("serialize is identical to a sibling type without ephemeralFields", () => {
      const consensusValue = {a: 1, b: 2};
      const valueWithEphemerals = {...consensusValue, total: 999, tag: 7};

      const bytesWith = typeWith.serialize(valueWithEphemerals);
      const bytesWithout = typeWithout.serialize(consensusValue);
      expect(bytesWith).toEqual(bytesWithout);
    });

    it("hashTreeRoot ignores ephemerals", () => {
      const v1 = {a: 1, b: 2, total: 100, tag: 1};
      const v2 = {a: 1, b: 2, total: 999, tag: 9};
      const v3 = {a: 1, b: 2};
      expect(typeWith.hashTreeRoot(v1)).toEqual(typeWith.hashTreeRoot(v2));
      expect(typeWith.hashTreeRoot(v1)).toEqual(typeWith.hashTreeRoot(v3));
      // and same as the consensus-only sibling
      expect(typeWith.hashTreeRoot(v1)).toEqual(typeWithout.hashTreeRoot({a: 1, b: 2}));
    });

    it("equals ignores ephemerals (consensus-only)", () => {
      expect(typeWith.equals({a: 1, b: 2, total: 1}, {a: 1, b: 2, total: 99})).toBe(true);
      expect(typeWith.equals({a: 1, b: 2}, {a: 1, b: 3})).toBe(false);
    });

    it("clone copies present ephemerals through (using each ephemeral type's clone)", () => {
      const src = {a: 1, b: 2, total: 42, tag: 9};
      const cloned = typeWith.clone(src);
      expect(cloned).toEqual(src);
      // Distinct object reference
      expect(cloned).not.toBe(src);

      const srcNoEphemeral = {a: 1, b: 2};
      const clonedNoEphemeral = typeWith.clone(srcNoEphemeral);
      expect(Object.prototype.hasOwnProperty.call(clonedNoEphemeral, "total")).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(clonedNoEphemeral, "tag")).toBe(false);
    });

    it("defaultValue does not include ephemeral keys", () => {
      const dv = typeWith.defaultValue();
      expect(Object.prototype.hasOwnProperty.call(dv, "total")).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(dv, "tag")).toBe(false);
    });

    it("fromJson(toJson(value)) drops ephemerals", () => {
      const value = {a: 1, b: 2, total: 999, tag: 5};
      const json = typeWith.toJson(value);
      expect(Object.prototype.hasOwnProperty.call(json, "total")).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(json, "tag")).toBe(false);

      const back = typeWith.fromJson(json);
      expect(back).toEqual({a: 1, b: 2});
    });

    it("View accepts and returns ephemerals via property accessors", () => {
      const view = typeWith.toView({a: 1, b: 2, total: 77, tag: 3});
      expect(view.a).toBe(1);
      expect(view.b).toBe(2);
      expect(view.total).toBe(77);
      expect(view.tag).toBe(3);

      view.total = 88;
      expect(view.total).toBe(88);
      // Setting an ephemeral does not affect the consensus root.
      expect(view.hashTreeRoot()).toEqual(typeWithout.hashTreeRoot({a: 1, b: 2}));
    });

    it("ViewDU accepts and returns ephemerals via property accessors", () => {
      const viewDU = typeWith.toViewDU({a: 1, b: 2, total: 77, tag: 3});
      expect(viewDU.a).toBe(1);
      expect(viewDU.b).toBe(2);
      expect(viewDU.total).toBe(77);
      expect(viewDU.tag).toBe(3);

      viewDU.total = 88;
      expect(viewDU.total).toBe(88);
      expect(viewDU.hashTreeRoot()).toEqual(typeWithout.hashTreeRoot({a: 1, b: 2}));
    });

    it("getView(tree) starts with empty ephemerals (no value source)", () => {
      const node = typeWith.value_toTree({a: 1, b: 2});
      const view = typeWith.getView(new Tree(node));
      expect(view.total).toBeUndefined();
      expect(view.tag).toBeUndefined();
    });

    it("re-deserializing serialized bytes produces no ephemeral keys", () => {
      const value = {a: 1, b: 2, total: 77, tag: 3};
      const bytes = typeWith.serialize(value);
      const back = typeWith.deserialize(bytes);
      expect(back).toEqual({a: 1, b: 2});
      expect(Object.prototype.hasOwnProperty.call(back, "total")).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(back, "tag")).toBe(false);
    });
  });
}

// Composite ephemeral field — exercise that types containing children work too.
describe("ContainerType ephemeralFields with composite ephemeral type", () => {
  const totalList = new ListBasicType(uint64NumInfType, 4);
  const consensusFields = {a: uint64NumInfType};

  const containerType = new ContainerType(consensusFields, {
    typeName: "ContainerWithListEphemeral",
    ephemeralFields: {totalList},
  });

  it("clone deep-copies the ephemeral list value", () => {
    const original = [10, 20];
    const src = {a: 1, totalList: [...original]};
    const cloned = containerType.clone(src);
    expect(cloned.totalList).toEqual(original);
    expect(cloned.totalList).not.toBe(src.totalList);
  });

  it("toView/toViewDU carry over composite ephemerals as raw values", () => {
    const src = {a: 1, totalList: [10, 20]};
    const view = containerType.toView(src);
    expect(view.totalList).toEqual([10, 20]);

    const viewDU = containerType.toViewDU(src);
    expect(viewDU.totalList).toEqual([10, 20]);
  });
});

// Compile-time assertions on the public type surface.
describe("ContainerType ephemeralFields type-level surface", () => {
  const consensusFields = {a: uint64NumInfType, b: uint16};
  const ephemeralFields = {total: uint64NumInfType};

  const typeWith = new ContainerType(consensusFields, {ephemeralFields});

  it("consensus fields are required, ephemerals are optional on the value type", () => {
    const v = typeWith.defaultValue();
    expectTypeOf(v.a).toEqualTypeOf<number>();
    expectTypeOf(v.b).toEqualTypeOf<number>();
    expectTypeOf(v.total).toEqualTypeOf<number | undefined>();
  });

  it("View getter returns T | undefined for ephemerals; setter accepts T", () => {
    const view = typeWith.toView({a: 1, b: 2, total: 7});
    expectTypeOf(view.a).toEqualTypeOf<number>();
    expectTypeOf(view.total).toEqualTypeOf<number | undefined>();
    // Setter accepts T (not undefined)
    view.total = 99;
  });

  it("ViewDU getter/setter shape mirrors View", () => {
    const viewDU = typeWith.toViewDU({a: 1, b: 2, total: 7});
    expectTypeOf(viewDU.a).toEqualTypeOf<number>();
    expectTypeOf(viewDU.total).toEqualTypeOf<number | undefined>();
    viewDU.total = 88;
  });

  it("a ContainerType without ephemeralFields keeps its existing value type unchanged", () => {
    const plain = new ContainerType(consensusFields);
    const v = plain.defaultValue();
    expectTypeOf(v.a).toEqualTypeOf<number>();
    expectTypeOf(v.b).toEqualTypeOf<number>();
    // No `total` key on the type
    // @ts-expect-error - total is not declared
    v.total;
  });
});
