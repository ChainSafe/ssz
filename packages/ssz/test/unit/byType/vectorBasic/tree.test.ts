import {expect} from "chai";
import {UintNumberType, VectorBasicType} from "../../../../src/index.js";
import {runViewTestMutation} from "../runViewTestMutation.js";

const uint64NumInf = new UintNumberType(8, {clipInfinity: true});
const vectorType = new VectorBasicType(uint64NumInf, 8);

runViewTestMutation({
  type: vectorType,
  mutations: [
    {
      id: "set basic",
      valueBefore: [1, 2, 3, 4, 5, 6, 7, 8],
      valueAfter: [0, 1, 2, 3, 4, 5, 6, 7],
      fn: (tv) => {
        tv.set(0, 0);
        tv.set(1, 1);
        tv.set(2, 2);
        tv.set(3, 3);
        tv.set(4, 4);
        tv.set(5, 5);
        tv.set(6, 6);
        tv.set(7, 7);
      },
    },
    {
      id: "swap two indices",
      valueBefore: [1, 2, 3, 4, 5, 6, 7, 8],
      valueAfter: [8, 2, 3, 4, 5, 6, 7, 1],
      fn: (tv) => {
        const i0 = tv.get(0);
        const i7 = tv.get(7);
        tv.set(0, i7);
        tv.set(7, i0);
      },
    },
  ],
});

describe("VectorBasicType batchHashTreeRoot", () => {
  const value = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const expectedRoot = vectorType.hashTreeRoot(value);

  it("fresh ViewDU", () => {
    expect(vectorType.toViewDU(value).batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify", () => {
    const viewDU = vectorType.defaultViewDU();
    viewDU.hashTreeRoot();
    viewDU.set(0, 0);
    viewDU.set(1, 1);
    viewDU.set(2, 2);
    viewDU.set(3, 3);
    viewDU.set(4, 4);
    viewDU.set(5, 5);
    viewDU.set(6, 6);
    viewDU.set(7, 7);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign the same value again, commit() then batchHashTreeRoot()
    viewDU.set(0, 0);
    viewDU.set(7, 7);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });
});
