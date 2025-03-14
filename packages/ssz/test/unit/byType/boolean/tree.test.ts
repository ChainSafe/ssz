import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {describe, expect, it } from "vitest";
import {BooleanType} from "../../../../src/index.js";
import {toHexString} from "../../../../src/util/byteArray.js";

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
