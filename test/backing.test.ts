import {assert} from "chai";
import {describe, it} from "mocha";
import {Tree, subtreeFillToDepth, BranchNode, LeafNode} from "../src";

describe("get", () => {
  it("should return the right node", () => {
    const n = subtreeFillToDepth(new LeafNode(Buffer.alloc(32, 1)), 3);
    const backing = new Tree(n);
    assert.deepEqual(backing.getRoot(8n), Buffer.alloc(32, 1));
  });
});

describe("set", () => {
  it("should return the right node", () => {
    const n = subtreeFillToDepth(new LeafNode(Buffer.alloc(32, 1)), 3);
    const n2 = new LeafNode(Buffer.alloc(32, 2));
    const backing = new Tree(n);
    backing.setNode(15n, n2, true);
    assert.deepEqual(backing.getRoot(15n), Buffer.alloc(32, 2));
  });
});
