import {expect} from "chai";
import {ArrayObject, SimpleObject} from "../testTypes";

describe("create proof", () => {
  it("should include all leaves of path to composite type", () => {
    const arrayObj = ArrayObject.defaultTreeBacked();
    const simpleObj = SimpleObject.defaultTreeBacked();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    arrayObj.v.push(simpleObj);
    const proof = arrayObj.createProof([["v"]]);
    const arrayObj2 = ArrayObject.createTreeBackedFromProofUnsafe(proof);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    expect(arrayObj2.v[0].valueOf()).to.deep.equal(arrayObj.v[0].valueOf());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    expect(arrayObj2.v.valueOf()).to.deep.equal(arrayObj.v.valueOf());
  });
});
