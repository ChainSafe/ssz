import {expect} from "chai";

import {number16List100Type} from "./objects";

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
});
