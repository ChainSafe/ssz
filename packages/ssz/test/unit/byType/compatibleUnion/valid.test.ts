import {describe, expect, it} from "vitest";
import {
  BitArray,
  ByteListType,
  ByteVectorType,
  CompatibleUnionType,
  ContainerType,
  ListBasicType,
  ProgressiveBitListType,
  ProgressiveByteListType,
  ProgressiveContainerType,
  ProgressiveListBasicType,
  StableContainerType,
  UintNumberType,
  VectorBasicType,
  hash64,
  toHexString,
} from "../../../../src/index.ts";

const byte = new UintNumberType(1);

describe("CompatibleUnionType", () => {
  const Single = new ProgressiveContainerType({A: byte}, [true]);
  const WithGap = new ProgressiveContainerType({A: byte, C: new ProgressiveBitListType()}, [true, false, true]);
  const type = new CompatibleUnionType({
    1: Single,
    3: WithGap,
  });

  it("serializes selector plus selected data", () => {
    const value = {selector: 1, data: {A: 7}};
    expect(toHexString(type.serialize(value))).to.equal("0x0107");
    expect(type.deserialize(type.serialize(value))).to.deep.equal(value);
  });

  it("uses selector-object JSON with data", () => {
    const value = type.fromJson({selector: "1", data: {A: "7"}});
    expect(value).to.deep.equal({selector: 1, data: {A: 7}});
    expect(type.toJson(value)).to.deep.equal({selector: "1", data: {A: "7"}});
  });

  it("mixes the selector into the selected value root", () => {
    const value = {selector: 1, data: {A: 7}};
    const selectorChunk = new Uint8Array(32);
    selectorChunk[0] = 1;
    expect(toHexString(type.hashTreeRoot(value))).to.equal(
      toHexString(hash64(Single.hashTreeRoot(value.data), selectorChunk))
    );
  });

  it("has no default value", () => {
    expect(() => type.defaultValue()).toThrow("does not define a default value");
  });

  it("creates and restores proofs for selector and selected data paths", () => {
    const value = {selector: 1, data: {A: 7}};
    const root = type.hashTreeRoot(value);
    const view = type.toView(value);

    expect(view.selector).to.equal(value.selector);
    expect(view.data).to.deep.equal(value.data);
    expect(type.toValueFromView(view)).to.deep.equal(value);

    for (const path of [[["selector"]], [["data"]], [["data", "A"]]]) {
      const proof = view.createProof(path);
      const restored = type.createFromProof(proof, root);
      expect(toHexString(restored.hashTreeRoot())).to.equal(toHexString(root));
    }
  });

  it("creates and restores selected data proofs when nested in a container", () => {
    const wrapperType = new ContainerType({shape: type});
    const value = {shape: {selector: 1, data: {A: 7}}};
    const root = wrapperType.hashTreeRoot(value);
    const proof = wrapperType.toView(value).createProof([["shape", "data", "A"]]);
    const restored = wrapperType.createFromProof(proof, root);

    expect(toHexString(restored.hashTreeRoot())).to.equal(toHexString(root));
  });

  it("creates nested selected data proofs using the active selector type", () => {
    const wrapperType = new ContainerType({shape: type});
    const value = {
      shape: {
        selector: 3,
        data: {
          A: 7,
          C: BitArray.fromBoolArray([true, false, true]),
        },
      },
    };
    const root = wrapperType.hashTreeRoot(value);
    const proof = wrapperType.toView(value).createProof([["shape", "data", "C"]]);
    const restored = wrapperType.createFromProof(proof, root);

    expect(toHexString(restored.hashTreeRoot())).to.equal(toHexString(root));
  });

  it("creates selected data proofs when nested in a StableContainer", () => {
    const CommonOnly = new ProgressiveContainerType({common: byte}, [true]);
    const WithExtra = new ProgressiveContainerType({common: byte, fieldOnlyInB: byte}, [true, true]);
    const unionType = new CompatibleUnionType({
      1: CommonOnly,
      2: WithExtra,
    });
    const wrapperType = new StableContainerType({shape: unionType}, 4);
    const value = {
      shape: {
        selector: 2,
        data: {
          common: 7,
          fieldOnlyInB: 9,
        },
      },
    };
    const root = wrapperType.hashTreeRoot(value);

    for (const path of [[["shape", "data", "common"]], [["shape", "data", "fieldOnlyInB"]]]) {
      const proof = wrapperType.toView(value).createProof(path);
      const restored = wrapperType.createFromProof(proof, root);

      expect(toHexString(restored.hashTreeRoot())).to.equal(toHexString(root));
    }
  });

  it("allows byte list and vector aliases to match uint8 arrays", () => {
    expect(() => new CompatibleUnionType({1: new ByteListType(4), 2: new ListBasicType(byte, 4)})).not.toThrow();
    expect(() => new CompatibleUnionType({1: new ByteVectorType(4), 2: new VectorBasicType(byte, 4)})).not.toThrow();
    expect(
      () => new CompatibleUnionType({1: new ProgressiveByteListType(), 2: new ProgressiveListBasicType(byte)})
    ).not.toThrow();
  });
});
