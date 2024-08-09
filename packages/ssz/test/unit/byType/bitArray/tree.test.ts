import {expect} from "chai";
import {BitVectorType, BitListType, BitArray} from "../../../../src";
import {runViewTestMutation} from "../runViewTestMutation";

for (const type of [new BitVectorType(4), new BitListType(4)]) {
  runViewTestMutation({
    type,
    mutations: [
      {
        id: "Set one bit",
        valueBefore: fromNum(4, 0b0000),
        valueAfter: fromNum(4, 0b0010),
        fn: (tv) => {
          tv.set(1, true);
        },
      },
      {
        id: "Unset one bit",
        valueBefore: fromNum(4, 0b1111),
        valueAfter: fromNum(4, 0b1101),
        fn: (tv) => {
          tv.set(1, false);
        },
      },
      {
        id: "Set all bits",
        valueBefore: fromNum(4, 0b0000),
        valueAfter: fromNum(4, 0b1111),
        fn: (tv) => {
          for (let i = 0; i < 4; i++) tv.set(i, true);
        },
      },
      {
        id: "Unset all bits",
        valueBefore: fromNum(4, 0b1111),
        valueAfter: fromNum(4, 0b0000),
        fn: (tv) => {
          for (let i = 0; i < 4; i++) tv.set(i, false);
        },
      },
      {
        id: "Switch bits",
        valueBefore: fromNum(4, 0b0100),
        valueAfter: fromNum(4, 0b0010),
        fn: (tv) => {
          tv.set(2, false);
          tv.set(1, true);
        },
      },
    ],
  });
}

describe("BitArray batchHashTreeRoot", () => {
  const sszType = new BitListType(4);
  const value = fromNum(4, 0b0010);
  const expectedRoot = sszType.toView(value).hashTreeRoot();

  it("fresh ViewDU", () => {
    expect(sszType.toViewDU(value).batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("set then hashTreeRoot", () => {
    const viewDU = sszType.toViewDU(fromNum(4, 0b0011));
    viewDU.set(0, false);
    expect(sszType.toViewDU(value).batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });
});

function fromNum(bitLen: number, num: number): BitArray {
  const bitArray = BitArray.fromBitLen(bitLen);
  for (let i = 0; i < bitLen; i++) {
    const mask = 1 << i;
    if ((num & mask) === mask) bitArray.set(i, true);
  }
  return bitArray;
}
