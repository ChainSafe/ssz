import {expect} from "chai";
import {ArrayObject, SimpleObject} from "../testTypes";

describe("create proof", () => {
  it("should include all leaves of path to composite type", () => {
    const arrayObj = ArrayObject.toView(ArrayObject.defaultValue);
    const simpleObj = SimpleObject.toView(SimpleObject.defaultValue);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    arrayObj.v.push(simpleObj);
    const proof = arrayObj.createProof([["v"]]);
    const arrayObj2 = ArrayObject.createFromProofUnsafe(proof);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    expect(arrayObj2.v.get(0).toValue()).to.deep.equal(arrayObj.v.get(0).toValue());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    expect(arrayObj2.v.toValue()).to.deep.equal(arrayObj.v.toValue());
  });
});
