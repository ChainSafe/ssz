import {assert} from "chai";
import {describe, it} from "mocha";
import {TreeBacking, subtreeFillToDepth, BranchNode, LeafNode} from "../src";

describe("get", () => {
  it ("should return the right node", () => {
    const n = subtreeFillToDepth(new LeafNode(Buffer.alloc(32, 1)), 3);
    const backing = new TreeBacking(n);
    assert.deepEqual(backing.get(8n).merkleRoot, Buffer.alloc(32, 1));
  });
});

describe("set", () => {
  it ("should return the right node", () => {
    const n = subtreeFillToDepth(new LeafNode(Buffer.alloc(32, 1)), 3);
    const n2 = new LeafNode(Buffer.alloc(32, 2));
    const backing = new TreeBacking(n);
    backing.set(15n, n2, true);
    assert.deepEqual(backing.get(15n).merkleRoot, Buffer.alloc(32, 2));
  });
});
