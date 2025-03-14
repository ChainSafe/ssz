import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {describe, expect, it} from "vitest";
import {fromHexString, toHexString} from "../../../../src/util/byteArray.js";
import {byteType, uint64NumInfType} from "../../../utils/primitiveTypes.js";

describe("UintNumberType / tree", () => {
  it("Single value", () => {
    const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0));
    byteType.tree_setToNode(leafNode, 1);

    expect(toHexString(leafNode.root)).to.equal("0x0100000000000000000000000000000000000000000000000000000000000000");

    expect(byteType.tree_getFromNode(leafNode)).to.equal(1);
  });

  it("Packed node of bytes", () => {
    const buf = Buffer.alloc(32, 0);

    const leafNode = LeafNode.fromRoot(Buffer.alloc(32, 0));
    for (let i = 0; i < 32; i++) {
      const value = i + 1;
      byteType.tree_setToPackedNode(leafNode, i, value);
      buf[i] = value;
    }

    expect(toHexString(leafNode.root)).to.equal(toHexString(buf), "Wrong leafNode.root value");
  });
});

// Ensure UintNumberType can deal with Infinity value
describe("UintType - Infinity with clipInfinity", () => {
  const hexOffset0 = "0xffffffffffffffff000000000000000000000000000000000000000000000000";
  const hexOffset2 = "0x00000000000000000000000000000000ffffffffffffffff0000000000000000";

  it("Infinity getFromNode", () => {
    const node = LeafNode.fromRoot(fromHexString(hexOffset0));
    expect(uint64NumInfType.tree_getFromNode(node)).to.equal(Number.POSITIVE_INFINITY);
  });

  it("Infinity getFromPackedNode", () => {
    const node = LeafNode.fromRoot(fromHexString(hexOffset2));
    expect(uint64NumInfType.tree_getFromPackedNode(node, 2)).to.equal(Number.POSITIVE_INFINITY);
  });

  it("Infinity setToNode", () => {
    const node = LeafNode.fromRoot(Buffer.alloc(32, 0));
    uint64NumInfType.tree_setToNode(node, Number.POSITIVE_INFINITY);
    expect(toHexString(node.root)).to.equal(hexOffset0);
  });

  it("Infinity setToPackedNode", () => {
    const node = LeafNode.fromRoot(Buffer.alloc(32, 0));
    uint64NumInfType.tree_setToPackedNode(node, 2, Number.POSITIVE_INFINITY);
    expect(toHexString(node.root)).to.equal(hexOffset2);
  });
});
