import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {expect} from "chai";
import {toHexString} from "../../../../src/util/byteArray.js";
import {BooleanType} from "../../../../src/index.js";

describe("BooleanType / tree", () => {
  const booleanType = new BooleanType();

  it("Single value", () => {
    const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0));
    booleanType.tree_setToNode(leafNode, true);

    expect(toHexString(leafNode.root)).to.equal("0x0100000000000000000000000000000000000000000000000000000000000000");

    expect(booleanType.tree_getFromNode(leafNode)).to.equal(true);
  });

  it("Packed node", () => {
    const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0));
    booleanType.tree_setToPackedNode(leafNode, 0, true);

    expect(toHexString(leafNode.root)).to.equal("0x0100000000000000000000000000000000000000000000000000000000000000");

    expect(booleanType.tree_getFromPackedNode(leafNode, 0)).to.equal(true);
  });
});
