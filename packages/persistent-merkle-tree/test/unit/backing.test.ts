import {describe, it, expect} from "vitest";
import {Tree, LeafNode, subtreeFillToDepth} from "../../src";

describe("get", () => {
  it("should return the right node", () => {
    const n = subtreeFillToDepth(LeafNode.fromRoot(Buffer.alloc(32, 1)), 3);
    const backing = new Tree(n);
    expect(backing.getRoot(8n)).toEqual(Uint8Array.from(Buffer.alloc(32, 1)));
  });
});

describe("set", () => {
  it("should return the right node", () => {
    const n = subtreeFillToDepth(LeafNode.fromRoot(Buffer.alloc(32, 1)), 3);
    const n2 = LeafNode.fromRoot(Buffer.alloc(32, 2));
    const backing = new Tree(n);
    backing.setNode(15n, n2);
    expect(backing.getRoot(15n)).toEqual(Uint8Array.from(Buffer.alloc(32, 2)));
  });
});
