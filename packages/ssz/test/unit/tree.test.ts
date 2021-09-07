import {expect} from "chai";
import {
  BasicListType,
  byteType,
  ContainerType,
  List,
  ListType,
  Number64ListType,
  Number64UintType,
  NumberUintType,
  toHexString,
} from "../../src";

import {number16List100Type, VariableSizeSimpleObject, number16Type} from "./objects";

describe("tree simple list/vector", () => {
  const type = number16List100Type;
  const struct = type.struct_defaultValue();
  const tree = type.tree_defaultValue();

  it("struct_defaultValue, tree_defaultValue", () => {
    expect(type.struct_hashTreeRoot(struct)).to.deep.equal(type.tree_hashTreeRoot(tree));
  });

  it("struct_convertToTree", () => {
    expect(type.tree_hashTreeRoot(type.struct_convertToTree(struct))).to.deep.equal(type.tree_hashTreeRoot(tree));
  });

  it("struct_convertToTree", () => {
    const v = 908;
    struct.push(v);
    type.tree_push(tree, v as any);
    expect(struct.length).to.deep.equal(type.tree_getLength(tree));
    expect(struct[0]).to.deep.equal(type.tree_getProperty(tree, 0));
    expect(type.struct_hashTreeRoot(struct)).to.deep.equal(type.tree_hashTreeRoot(tree));
  });

  it("struct_convertToTree - properties as TreeBacked values", () => {
    const v = 908;
    const list = number16List100Type.struct_defaultValue();
    list.push(v);
    const a = number16Type.defaultValue();
    const b = byteType.defaultValue();
    // tree1 has all of its properties as struct
    const tree1 = VariableSizeSimpleObject.struct_convertToTree({a, b, list});
    const list2 = number16List100Type.createTreeBackedFromStruct(list);
    // tree2 has the list as TreeBacked value
    const tree2 = VariableSizeSimpleObject.struct_convertToTree({a, b, list: list2});
    expect(tree1.root).to.be.deep.equal(tree2.root);
  });

  it("Container - Number64UintType vs NumberUintType", () => {
    const BeaconStateType = new ContainerType({
      fields: {
        slot: new NumberUintType({byteLength: 8}),
      },
    });
    const BeaconState64Type = new ContainerType({
      fields: {
        slot: new Number64UintType(),
      },
    });
    type BeaconState = {
      slot: number;
    };
    const state: BeaconState = {slot: 0};
    const tbState64 = BeaconState64Type.createTreeBackedFromStruct(state);
    tbState64.tree.setHashObject(BigInt(1), {h0: -1, h1: -1, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0});
    const tbState = BeaconStateType.createTreeBackedFromStruct(state);
    tbState.tree.setHashObject(BigInt(1), {h0: -1, h1: -1, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0});
    expect(tbState.slot).to.be.equal(tbState64.slot);
    tbState64.slot = 31217089836;
    expect(tbState64.slot).to.be.equal(31217089836);
    tbState.slot = 31217089836;
    expect(tbState.slot).to.be.equal(31217089836);
    expect(toHexString(tbState.hashTreeRoot())).to.be.equal(toHexString(tbState64.hashTreeRoot()));
  });

  it("BasicList - Number64UintType vs NumberUintType", () => {
    const BalancesList64 = new ListType({elementType: new Number64UintType(), limit: 1000});
    const BalancesList = new ListType({elementType: new NumberUintType({byteLength: 8}), limit: 1000});
    const length = 200;
    const struct = Array.from({length}, () => 99);
    const tbBalancesList = BalancesList.createTreeBackedFromStruct(struct);
    const tbBalancesList64 = BalancesList64.createTreeBackedFromStruct(struct);
    expect(toHexString(tbBalancesList.tree.root)).to.be.equal(toHexString(tbBalancesList64.tree.root));
    // setter
    tbBalancesList[100] = 31217089836;
    // getter
    expect(tbBalancesList[100]).to.be.equal(31217089836);
    // setter
    tbBalancesList64[100] = 31217089836;
    // getter
    expect(tbBalancesList64[100]).to.be.equal(31217089836);
    const deltas = [1_000_000_000_000, 999, 0, -1_000_000];
    for (const delta of deltas) {
      tbBalancesList64[100] = 31217089836;
      const newBalance = (tbBalancesList64.type as Number64ListType).tree_applyDeltaAtIndex(
        tbBalancesList64.tree,
        100,
        delta
      );
      expect(newBalance).to.be.equal(31217089836 + delta);
      expect(tbBalancesList64[100]).to.be.equal(31217089836 + delta);
    }
  });

  it("tree_applyDeltaInBatch", () => {
    const BalancesList = new ListType<List<number>>({elementType: new NumberUintType({byteLength: 8}), limit: 1000});
    const BalancesList64 = new ListType<List<number>>({elementType: new Number64UintType(), limit: 1000});
    const length = 200;
    const struct = Array.from({length}, () => 31217089836);
    const tbBalancesList = BalancesList.createTreeBackedFromStruct(struct as List<number>);
    const tbBalancesList64 = BalancesList64.createTreeBackedFromStruct(struct as List<number>);
    const delta = 100;
    // increase delta for BalancesList
    for (let i = 0; i < length; i++) {
      tbBalancesList[i] = tbBalancesList[i] + delta;
    }
    // same operation for BalancesList64 using tree_applyDeltaInBatch
    const deltaByIndex = new Map<number, number>();
    for (let i = 0; i < length; i++) {
      deltaByIndex.set(i, delta);
    }
    const newValues = (tbBalancesList64.type as Number64ListType).tree_applyDeltaInBatch(
      tbBalancesList64.tree,
      deltaByIndex
    );
    for (const value of newValues) {
      expect(value).to.be.equal(31217089836 + delta);
    }
    expect(toHexString(tbBalancesList.tree.root)).to.be.equal(
      toHexString(tbBalancesList64.tree.root),
      "incorrect result from tree_applyDeltaInBatch"
    );
  });

  it("tree_newTreeFromDeltas", () => {
    const lengths = [200, 201, 202, 203];
    for (const length of lengths) {
      const BalancesList64 = new ListType({elementType: new Number64UintType(), limit: 1000});
      const struct = Array.from({length}, () => 31217089836);
      const tbBalancesList64 = BalancesList64.createTreeBackedFromStruct(struct);
      const delta = 100;
      const deltas = struct.map(() => delta);
      const [newTree, newValues] = (tbBalancesList64.type as Number64ListType).tree_newTreeFromDeltas(
        tbBalancesList64.tree,
        deltas
      );
      for (let i = 0; i < length; i++) {
        expect(newValues[i]).to.be.equal(31217089836 + delta);
      }
      (tbBalancesList64.type as BasicListType<List<number>>).tree_setLength(newTree, length);
      const newTBalancesList64 = BalancesList64.createTreeBacked(newTree);
      for (let i = 0; i < length; i++) {
        expect(newTBalancesList64[i]).to.be.equal(31217089836 + delta);
      }
      // build a tree from scratch with deltas to confirm
      const expectedStruct = Array.from({length}, () => 31217089836 + delta);
      // Number64UintType
      const expectedTBBalancesList64 = BalancesList64.createTreeBackedFromStruct(expectedStruct);
      expect(toHexString(newTree.root)).to.be.equal(toHexString(expectedTBBalancesList64.tree.root));
      // NumberUintType
      const BalancesList = new ListType({elementType: new NumberUintType({byteLength: 8}), limit: 1000});
      const expectedTBBalancesList = BalancesList.createTreeBackedFromStruct(expectedStruct);
      expect(toHexString(newTree.root)).to.be.equal(toHexString(expectedTBBalancesList.tree.root));
    }
  });
});
