import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {describe, expect, it} from "vitest";
import {
  BitArray,
  ContainerType,
  ProgressiveBitListType,
  ProgressiveByteListType,
  ProgressiveContainerType,
  ProgressiveListBasicType,
  ProgressiveListCompositeType,
  UintNumberType,
  hash64,
  toHexString,
} from "../../../../src/index.ts";
import {Type} from "../../../../src/type/abstract.ts";
import {getNodesAtProgressiveDepth, progressiveSubtreeFillToContents} from "../../../../src/type/progressive.ts";
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

  it("supports incremental TreeViewDU pushes across progressive subtrees", () => {
    const value = Array.from({length: 32 * 5 + 1}, (_, i) => i % 256);
    const view = type.defaultViewDU();
    for (const element of value) {
      view.push(element);
    }

    expect(view.get(32)).to.equal(value[32]);
    expect(view.get(32 * 5)).to.equal(value[32 * 5]);
    expect(view.getAll()).to.deep.equal(value);
    expect(toHexString(view.hashTreeRoot())).to.equal(toHexString(type.hashTreeRoot(value)));
  });

  it("supports TreeViewDU slice helpers", () => {
    const value = Array.from({length: 32 * 5 + 1}, (_, i) => i % 256);
    const view = type.toViewDU(value);

    expect(view.sliceTo(34).getAll()).to.deep.equal(value.slice(0, 35));
    expect(toHexString(view.sliceTo(34).hashTreeRoot())).to.equal(toHexString(type.hashTreeRoot(value.slice(0, 35))));
    expect(view.sliceFrom(34).getAll()).to.deep.equal(value.slice(34));
    expect(toHexString(view.sliceFrom(34).hashTreeRoot())).to.equal(toHexString(type.hashTreeRoot(value.slice(34))));
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

  it("supports incremental TreeViewDU pushes across progressive subtrees", () => {
    const value = Array.from({length: 6}, (_, i) => ({a: i, b: i + 1}));
    const view = type.defaultViewDU();
    for (const element of value) {
      view.push(elementType.toViewDU(element));
    }

    expect(type.toValueFromViewDU(view)).to.deep.equal(value);
    expect(toHexString(view.hashTreeRoot())).to.equal(toHexString(type.hashTreeRoot(value)));
  });

  it("supports TreeViewDU readonly and slice helpers", () => {
    const value = Array.from({length: 6}, (_, i) => ({a: i, b: i + 1}));
    const modified = [...value];
    modified[1] = {a: 1, b: 99};
    const view = type.toViewDU(value);
    view.get(1).b = 99;

    expect(elementType.toValueFromViewDU(view.getReadonly(1))).to.deep.equal(modified[1]);
    expect(view.getAllReadonly().map((item) => elementType.toValueFromViewDU(item))).to.deep.equal(modified);
    expect(view.getReadonlyByRange(1, 2).map((item) => elementType.toValueFromViewDU(item))).to.deep.equal(
      modified.slice(1, 3)
    );
    expect(() => view.getAllReadonlyValues()).toThrow("Must commit changes before reading all nodes");

    const rangeView = type.toViewDU(value);
    expect(rangeView.getReadonlyByRange(1, 2).map((item) => elementType.toValueFromViewDU(item))).to.deep.equal(
      value.slice(1, 3)
    );
    expect(rangeView.cache.nodesPopulated).to.equal(false);
    expect(rangeView.cache.nodes?.length).to.equal(3);

    view.commit();
    expect(view.getAllReadonlyValues()).to.deep.equal(modified);

    const forEachValues: typeof value = [];
    view.forEachValue((item) => forEachValues.push(item));
    expect(forEachValues).to.deep.equal(modified);

    expect(view.sliceTo(2).getAllReadonlyValues()).to.deep.equal(modified.slice(0, 3));
    expect(toHexString(view.sliceTo(2).hashTreeRoot())).to.equal(toHexString(type.hashTreeRoot(modified.slice(0, 3))));
    expect(view.sliceFrom(2).getAllReadonlyValues()).to.deep.equal(modified.slice(2));
    expect(toHexString(view.sliceFrom(2).hashTreeRoot())).to.equal(toHexString(type.hashTreeRoot(modified.slice(2))));
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

describe("ProgressiveByteListType", () => {
  const type = new ProgressiveByteListType();

  it("round-trips byte list serialization and computes progressive roots", () => {
    const value = Uint8Array.from({length: 32 * 5 + 7}, (_, i) => i % 256);
    const equivalentList = new ProgressiveListBasicType(uint8);
    const serialized = type.serialize(value);
    expect(toHexString(serialized)).to.equal(toHexString(value));
    expect(toHexString(serialized)).to.equal(toHexString(equivalentList.serialize(Array.from(value))));
    expect(type.deserialize(serialized)).to.deep.equal(value);
    expect(type.toJson(value)).to.equal(toHexString(value));
    expect(type.fromJson(toHexString(value))).to.deep.equal(value);
    expect(toHexString(type.hashTreeRoot(value))).to.equal(toHexString(progressiveByteListRoot(value)));
    expect(toHexString(type.hashTreeRoot(value))).to.equal(toHexString(equivalentList.hashTreeRoot(Array.from(value))));
  });

  it("accepts byte array JSON for ProgressiveList[byte] fixtures", () => {
    const value = Uint8Array.from([1, 2, 3]);
    expect(type.fromJson([1, "2", 3n])).to.deep.equal(value);
    expect(type.toJson(value)).to.equal("0x010203");
    expect(() => type.fromJson([256])).toThrow("Invalid byte value 256");
  });

  it("supports empty byte lists", () => {
    expect(toHexString(type.serialize(new Uint8Array(0)))).to.equal("0x");
    expect(toHexString(type.hashTreeRoot(new Uint8Array(0)))).to.equal(toHexString(mixInLength(new Uint8Array(32), 0)));
  });

  it("creates and restores proofs for progressive byte chunks", () => {
    const wrapperType = new ContainerType({bytes: type});
    const value = {bytes: Uint8Array.from({length: 32 * 5 + 1}, (_, i) => i % 256)};
    const root = wrapperType.hashTreeRoot(value);
    const proof = wrapperType.toView(value).createProof([["bytes"]]);
    const restored = wrapperType.createFromProof(proof, root);

    expect(toHexString(restored.hashTreeRoot())).to.equal(toHexString(root));
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

describe("getNodesAtProgressiveDepth", () => {
  it("materializes large progressive lists at production scale (regression: #535)", () => {
    // Regression for chainsafe/ssz#535. Progressive subtrees hold 1, 4, 16, ... 65536, 262144, ... chunks.
    // The previous implementation did `nodes.push(...getNodesAtDepth(...))`, spreading a whole subtree as
    // call arguments; on V8 that throws `RangeError: Maximum call stack size exceeded` once a subtree
    // exceeds the argument-spread limit (~125k on Node's default stack), which bricked block import on a
    // Gloas beacon state whose validator registry (~500k) placed 262144 nodes in a single subtree.
    // Exercise that exact shape (9th subtree fully populated) and assert every node is returned, in order.
    const count = 349_525; // (4^10 - 1) / 3 — fills the 9th subtree completely (262144 nodes)
    const subtree9Start = 87_381; // (4^9 - 1) / 3 — sum of subtree capacities 1..65536
    const nodes = Array.from({length: count}, (_, i) => LeafNode.fromUint32(i));
    const rootNode = progressiveSubtreeFillToContents(nodes);

    const result = getNodesAtProgressiveDepth(rootNode, count);

    expect(result.length).to.equal(count);
    // Order and node identity are preserved across the subtree boundary.
    expect(result[0]).to.equal(nodes[0]);
    expect(result[subtree9Start - 1]).to.equal(nodes[subtree9Start - 1]);
    expect(result[subtree9Start]).to.equal(nodes[subtree9Start]);
    expect(result[count - 1]).to.equal(nodes[count - 1]);
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

function progressiveByteListRoot(value: Uint8Array): Uint8Array {
  return mixInLength(progressiveRoot(chunkify(value)), value.length);
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
