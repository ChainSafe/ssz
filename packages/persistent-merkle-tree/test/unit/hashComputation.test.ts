import {describe, it, expect, beforeEach} from "vitest";
import {zeroNode, Node} from "../../src/index.js";
import {HashComputationLevel} from "../../src/hashComputation.js";

describe("HashComputationLevel", () => {
  let hashComputationLevel: HashComputationLevel;

  beforeEach(() => {
    hashComputationLevel = new HashComputationLevel();
    hashComputationLevel.push(zeroNode(0), zeroNode(0), zeroNode(1));
  });

  it("should reset", () => {
    hashComputationLevel.reset();
    expect(hashComputationLevel.length).to.be.equal(0);
    expect(hashComputationLevel.totalLength).to.be.equal(1);
    expect(toArray(hashComputationLevel)).to.be.deep.equal([]);
  });

  it("should push", () => {
    hashComputationLevel.push(zeroNode(0), zeroNode(0), zeroNode(1));
    expect(hashComputationLevel.length).to.be.equal(2);
    expect(hashComputationLevel.totalLength).to.be.equal(2);
    const arr = toArray(hashComputationLevel);
    expect(arr.length).to.be.equal(2);
    expect(arr).toEqual([
      {src0: zeroNode(0), src1: zeroNode(0), dest: zeroNode(1)},
      {src0: zeroNode(0), src1: zeroNode(0), dest: zeroNode(1)},
    ]);
  });

  it("reset then push full", () => {
    hashComputationLevel.push(zeroNode(0), zeroNode(0), zeroNode(1));
    hashComputationLevel.reset();
    hashComputationLevel.push(zeroNode(0), zeroNode(0), zeroNode(1));
    hashComputationLevel.push(zeroNode(0), zeroNode(0), zeroNode(1));
    hashComputationLevel.clean();
    expect(hashComputationLevel.length).to.be.equal(2);
    expect(hashComputationLevel.totalLength).to.be.equal(2);
    const arr = toArray(hashComputationLevel);
    expect(arr).toEqual([
      {src0: zeroNode(0), src1: zeroNode(0), dest: zeroNode(1)},
      {src0: zeroNode(0), src1: zeroNode(0), dest: zeroNode(1)},
    ]);
  });

  it("reset then push partial", () => {
    hashComputationLevel.push(zeroNode(0), zeroNode(0), zeroNode(1));
    // totalLength = 2 now
    hashComputationLevel.reset();
    hashComputationLevel.push(zeroNode(0), zeroNode(0), zeroNode(1));
    hashComputationLevel.clean();
    expect(hashComputationLevel.length).to.be.equal(1);
    expect(hashComputationLevel.totalLength).to.be.equal(2);
    const arr = toArray(hashComputationLevel);
    expect(arr).toEqual([{src0: zeroNode(0), src1: zeroNode(0), dest: zeroNode(1)}]);
  });

  it("clean", () => {
    hashComputationLevel.push(zeroNode(0), zeroNode(0), zeroNode(1));
    hashComputationLevel.reset();
    hashComputationLevel.push(zeroNode(0), zeroNode(0), zeroNode(1));
    hashComputationLevel.clean();
    expect(hashComputationLevel.length).to.be.equal(1);
    expect(hashComputationLevel.totalLength).to.be.equal(2);
    const arr = toArray(hashComputationLevel);
    expect(arr).to.be.deep.equal([{src0: zeroNode(0), src1: zeroNode(0), dest: zeroNode(1)}]);
    const all = hashComputationLevel.dump();
    const last = all[all.length - 1];
    expect(last.src0).toBeNull();
    expect(last.src1).toBeNull();
    expect(last.dest).toBeNull();
  });
});

function toArray(hc: HashComputationLevel): {src0: Node; src1: Node; dest: Node}[] {
  return hc.toArray().map(({src0, src1, dest}) => ({src0, src1, dest}));
}
