import {expect} from "chai";
import { byteType } from "../../src";

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
    const v = 908
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
});
