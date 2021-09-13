import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {expect} from "chai";
import {toHexString} from "../../../../src/util/byteArray";
import {UintNumberType} from "../../../../src/v2";

describe("UintNumberType / tree", () => {
  const byteType = new UintNumberType(1);

  it("Single value", () => {
    const leafNode = new LeafNode(Buffer.alloc(32, 0));
    byteType.tree_setToNode(leafNode, 1);

    expect(toHexString(leafNode.root)).to.equal("0x0100000000000000000000000000000000000000000000000000000000000000");

    expect(byteType.tree_getFromNode(leafNode)).to.equal(1);
  });

  it("Packed node of bytes", () => {
    const buf = Buffer.alloc(32, 0);

    const leafNode = new LeafNode(Buffer.alloc(32, 0));
    for (let i = 0; i < 32; i++) {
      const value = i + 1;
      byteType.tree_setToPackedNode(leafNode, i, value);
      buf[i] = value;
    }

    expect(toHexString(leafNode.root)).to.equal(toHexString(buf), "Wrong leafNode.root value");
  });
});
