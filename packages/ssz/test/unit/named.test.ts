import {describe, expect, it } from "vitest";
import {
  BitListType,
  BitVectorType,
  BooleanType,
  ByteListType,
  ByteVectorType,
  ContainerNodeStructType,
  ContainerType,
  ListBasicType,
  ListCompositeType,
  UintBigintType,
  UintNumberType,
  UnionType,
  VectorBasicType,
  VectorCompositeType,
} from "../../src/index.js";

describe("Customize object name for all types", () => {
  const typeName = "CustomType1234";
  const basicType = new BooleanType();
  const compositeType = new ByteVectorType(32);
  const fields = {bool: basicType};

  it("BitListType", () => {
    assertClassName(BitListType.named(1, {typeName}));
  });

  it("BitVectorType", () => {
    assertClassName(BitVectorType.named(1, {typeName}));
  });

  it("BooleanType", () => {
    assertClassName(BooleanType.named({typeName}));
  });

  it("ByteListType", () => {
    assertClassName(ByteListType.named(1, {typeName}));
  });

  it("ByteVectorType", () => {
    assertClassName(ByteVectorType.named(1, {typeName}));
  });

  it("ContainerType", () => {
    assertClassName(ContainerType.named(fields, {typeName}));
  });

  it("ContainerNodeStructType", () => {
    assertClassName(ContainerNodeStructType.named(fields, {typeName}));
  });

  it("ListBasicType", () => {
    assertClassName(ListBasicType.named(basicType, 1, {typeName}));
  });

  it("ListCompositeType", () => {
    assertClassName(ListCompositeType.named(compositeType, 1, {typeName}));
  });

  it("UintNumberType", () => {
    assertClassName(UintNumberType.named(1, {typeName}));
  });

  it("UintBigintType", () => {
    assertClassName(UintBigintType.named(1, {typeName}));
  });

  it("UnionType", () => {
    assertClassName(UnionType.named([compositeType], {typeName}));
  });

  it("VectorBasicType", () => {
    assertClassName(VectorBasicType.named(basicType, 1, {typeName}));
  });

  it("VectorCompositeType", () => {
    assertClassName(VectorCompositeType.named(compositeType, 1, {typeName}));
  });

  function assertClassName(obj: unknown): void {
    expect((obj as Record<string, unknown>).constructor.name).equals(typeName);
  }
});
