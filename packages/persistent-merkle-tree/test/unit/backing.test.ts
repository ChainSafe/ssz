import {assert} from "chai";
import {describe, it} from "mocha";
import {Tree, LeafNode, subtreeFillToDepth} from "../../src/index.js";

describe("get", () => {
  it("should return the right node", () => {
    const n = subtreeFillToDepth(LeafNode.fromRoot(Buffer.alloc(32, 1)), 3);
    const backing = new Tree(n);
    assert.deepEqual(backing.getRoot(8n), Buffer.alloc(32, 1));
  });
});

describe("set", () => {
  it("should return the right node", () => {
    const n = subtreeFillToDepth(LeafNode.fromRoot(Buffer.alloc(32, 1)), 3);
    const n2 = LeafNode.fromRoot(Buffer.alloc(32, 2));
    const backing = new Tree(n);
    backing.setNode(15n, n2);
    assert.deepEqual(backing.getRoot(15n), Buffer.alloc(32, 2));
  });
});
