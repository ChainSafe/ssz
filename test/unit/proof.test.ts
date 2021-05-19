import { expect } from "chai";
import { ArrayObject, SimpleObject } from "./objects";

describe("create proof", () => {
  it("should include all leaves of path to composite type", () => {
    const arrayObj = ArrayObject.defaultTreeBacked();
    const simpleObj = SimpleObject.defaultTreeBacked();
    arrayObj.v.push(simpleObj);
    const proof = arrayObj.createProof([["v"]]);
    const arrayObj2 = ArrayObject.createTreeBackedFromProofUnsafe(proof);
    expect(arrayObj2.v[0].valueOf()).to.deep.equal(arrayObj.v[0].valueOf());
    expect(arrayObj2.v.valueOf()).to.deep.equal(arrayObj.v.valueOf());
  });
});
