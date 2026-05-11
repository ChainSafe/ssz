import {describe, expect, it} from "vitest";
import {
  BitArray,
  ContainerType,
  ProgressiveBitListType,
  ProgressiveContainerType,
  ProgressiveListBasicType,
  ProgressiveListCompositeType,
  UintNumberType,
  hash64,
  toHexString,
} from "../../../../src/index.ts";
import {Type} from "../../../../src/type/abstract.ts";
import {merkleize, mixInLength} from "../../../../src/util/merkleize.ts";

const uint8 = new UintNumberType(1);
const uint16 = new UintNumberType(2);

describe("ProgressiveListBasicType", () => {
  const type = new ProgressiveListBasicType(uint8);

  it("round-trips serialization and computes progressive roots", () => {
    const value = [1, 2, 3, 4, 5];
    const serialized = type.serialize(value);
    expect(toHexString(serialized)).to.equal("0x0102030405");
    expect(type.deserialize(serialized)).to.deep.equal(value);
    expect(toHexString(type.hashTreeRoot(value))).to.equal(toHexString(progressiveListBasicRoot(uint8, value)));
  });

  it("supports empty lists", () => {
    expect(toHexString(type.serialize([]))).to.equal("0x");
    expect(toHexString(type.hashTreeRoot([]))).to.equal(toHexString(mixInLength(new Uint8Array(32), 0)));
  });

  it("supports TreeViewDU mutation beyond the first progressive subtree", () => {
    const value = Array.from({length: 33}, (_, i) => i);
    const view = type.toViewDU(value);
    expect(view.get(32)).to.equal(32);
    view.set(32, 99);
    view.push(100);

    const expected = [...value];
    expected[32] = 99;
    expected.push(100);
    expect(toHexString(view.hashTreeRoot())).to.equal(toHexString(type.hashTreeRoot(expected)));
  });

  it("creates and restores proofs for variable-depth chunks", () => {
    const value = Array.from({length: 33}, (_, i) => i);
    const view = type.toView(value);
    const proof = view.createProof([[32]]);
    const restored = type.createFromProof(proof, type.hashTreeRoot(value));
    expect(toHexString(restored.hashTreeRoot())).to.equal(toHexString(type.hashTreeRoot(value)));
  });
});

describe("ProgressiveListCompositeType", () => {
  const elementType = new ContainerType({a: uint8, b: uint16});
  const type = new ProgressiveListCompositeType(elementType);

  it("round-trips fixed composite elements and computes progressive roots", () => {
    const value = [
      {a: 1, b: 2},
      {a: 3, b: 4},
      {a: 5, b: 6},
      {a: 7, b: 8},
      {a: 9, b: 10},
    ];
    const serialized = type.serialize(value);
    expect(type.deserialize(serialized)).to.deep.equal(value);
    expect(toHexString(type.hashTreeRoot(value))).to.equal(
      toHexString(progressiveListCompositeRoot(elementType, value))
    );
  });

  it("creates nested proofs for variable-size composite elements", () => {
    const variableElementType = new ContainerType({a: uint8, bits: new ProgressiveBitListType()});
    const variableListType = new ProgressiveListCompositeType(variableElementType);
    const wrapperType = new ContainerType({list: variableListType});
    const value = {
      list: [
        {a: 1, bits: BitArray.fromBoolArray([true])},
        {a: 2, bits: BitArray.fromBoolArray([false, true])},
      ],
    };
    const root = wrapperType.hashTreeRoot(value);
    const proof = wrapperType.toView(value).createProof([["list"]]);
    const restored = wrapperType.createFromProof(proof, root);

    expect(toHexString(restored.hashTreeRoot())).to.equal(toHexString(root));
  });
});

describe("ProgressiveBitListType", () => {
  const type = new ProgressiveBitListType();

  it("round-trips bitlist serialization and computes progressive roots", () => {
    const value = BitArray.fromBoolArray([true, false, true, true, false, false, true, false, true]);
    const serialized = type.serialize(value);
    expect(toHexString(serialized)).to.equal("0x4d03");
    const deserialized = type.deserialize(serialized);
    expect(deserialized.toBoolArray()).to.deep.equal(value.toBoolArray());
    expect(toHexString(type.hashTreeRoot(value))).to.equal(toHexString(progressiveBitlistRoot(value)));
  });
});

describe("ProgressiveContainerType", () => {
  const type = new ProgressiveContainerType(
    {
      side: uint16,
      color: uint8,
      radius: uint16,
    },
    [true, false, true, true]
  );

  it("serializes like a container over active fields and computes progressive roots", () => {
    const value = {side: 0x42, color: 1, radius: 0x42};
    const serialized = type.serialize(value);
    expect(toHexString(serialized)).to.equal("0x4200014200");
    expect(type.deserialize(serialized)).to.deep.equal(value);
    expect(toHexString(type.hashTreeRoot(value))).to.equal(
      toHexString(
        progressiveContainerRoot(type, [uint16.hashTreeRoot(0x42), uint8.hashTreeRoot(1), uint16.hashTreeRoot(0x42)])
      )
    );
  });

  it("supports TreeViewDU mutation through inactive-field gaps", () => {
    const view = type.toViewDU({side: 0x42, color: 1, radius: 0x42});
    view.color = 7;
    view.radius = 0x99;

    expect(toHexString(view.hashTreeRoot())).to.equal(
      toHexString(type.hashTreeRoot({side: 0x42, color: 7, radius: 0x99}))
    );
  });

  it("reuses generated view classes", () => {
    const value = {side: 0x42, color: 1, radius: 0x42};
    expect(type.toView(value).constructor).to.equal(type.toView(value).constructor);
    expect(type.toViewDU(value).constructor).to.equal(type.toViewDU(value).constructor);
  });

  it("creates and restores proofs through inactive-field gaps", () => {
    const value = {side: 0x42, color: 1, radius: 0x42};
    const view = type.toView(value);
    const proof = view.createProof([["color"]]);
    const restored = type.createFromProof(proof, type.hashTreeRoot(value));
    expect(toHexString(restored.hashTreeRoot())).to.equal(toHexString(type.hashTreeRoot(value)));
  });
});

function progressiveListBasicRoot<T>(elementType: UintNumberType, value: T[]): Uint8Array {
  const serialized = new Uint8Array(value.length * elementType.byteLength);
  const dataView = new DataView(serialized.buffer, serialized.byteOffset, serialized.byteLength);
  for (let i = 0; i < value.length; i++) {
    elementType.value_serializeToBytes(
      {uint8Array: serialized, dataView},
      i * elementType.byteLength,
      value[i] as number
    );
  }
  return mixInLength(progressiveRoot(chunkify(serialized)), value.length);
}

function progressiveListCompositeRoot<T>(elementType: Type<T>, value: T[]): Uint8Array {
  return mixInLength(progressiveRoot(value.map((element) => elementType.hashTreeRoot(element))), value.length);
}

function progressiveBitlistRoot(value: BitArray): Uint8Array {
  return mixInLength(progressiveRoot(chunkify(value.uint8Array)), value.bitLen);
}

function progressiveContainerRoot(type: {activeFields: BitArray}, fieldRoots: Uint8Array[]): Uint8Array {
  const chunks = [fieldRoots[0], new Uint8Array(32), fieldRoots[1], fieldRoots[2]];
  const activeFieldsChunk = new Uint8Array(32);
  activeFieldsChunk.set(type.activeFields.uint8Array);
  return hash64(progressiveRoot(chunks), activeFieldsChunk);
}

function progressiveRoot(chunks: Uint8Array[]): Uint8Array {
  if (chunks.length === 0) {
    return new Uint8Array(32);
  }

  const subtreeRoots: Uint8Array[] = [];
  let offset = 0;
  let subtreeLength = 1;
  while (offset < chunks.length) {
    const subtreeChunks = chunks.slice(offset, offset + subtreeLength).map((chunk) => new Uint8Array(chunk));
    subtreeRoots.push(merkleize(subtreeChunks, subtreeLength));
    offset += subtreeLength;
    subtreeLength *= 4;
  }

  const root = new Uint8Array(32);
  for (let i = subtreeRoots.length - 1; i >= 0; i--) {
    root.set(hash64(subtreeRoots[i], root));
  }
  return root;
}

function chunkify(bytes: Uint8Array): Uint8Array[] {
  const chunkCount = Math.ceil(bytes.length / 32);
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < chunkCount; i++) {
    const chunk = new Uint8Array(32);
    chunk.set(bytes.subarray(i * 32, (i + 1) * 32));
    chunks.push(chunk);
  }
  return chunks;
}
