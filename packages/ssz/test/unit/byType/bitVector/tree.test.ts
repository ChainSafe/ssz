import {BitVectorType, BitArray} from "../../../../src";
import {runViewTestMutation} from "../runViewTestMutation";

runViewTestMutation({
  type: new BitVectorType(4),
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

function fromNum(bitLen: number, num: number): BitArray {
  const bitArray = BitArray.fromBitLen(bitLen);
  for (let i = 0; i < bitLen; i++) {
    const mask = 1 << i;
    if ((num & mask) === mask) bitArray.set(i, true);
  }
  return bitArray;
}
