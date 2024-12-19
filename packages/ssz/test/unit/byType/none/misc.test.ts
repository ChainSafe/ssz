import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {expect} from "chai";
import {NoneType, toHexString} from "../../../../src/index.js";

describe("None type", () => {
  const noneType = new NoneType();
  const leafNode = LeafNode.fromZero();

  it("tree_getFromNode do nothing", () => {
    expect(noneType.tree_getFromNode(leafNode)).to.equal(null);
  });
  it("tree_setToNode do nothing", () => {
    const node = LeafNode.fromZero();
    noneType.tree_setToNode(node, null);
    expect(toHexString(node.root)).equal(toHexString(leafNode.root));
  });
  it("tree_getFromPackedNode do nothing", () => {
    expect(noneType.tree_getFromPackedNode(leafNode, 0)).to.equal(null);
  });
  it("tree_setToPackedNode do nothing", () => {
    const node = LeafNode.fromZero();
    noneType.tree_setToPackedNode(node, 0, null);
    expect(toHexString(node.root)).equal(toHexString(leafNode.root));
  });
});
