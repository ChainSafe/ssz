import {expect} from "chai";
import {ListUintNum64Type} from "../../../../src/type/listUintNum64";

describe("ListUintNum64Type.toViewDU", () => {
  const type = new ListUintNum64Type(1024);
  // seed ViewDU contains 16 leaf nodes = 64 uint64
  // we test all cases
  for (const seedLength of [61, 62, 63, 64]) {
    const value = Array.from({length: seedLength}, (_, i) => i);
    const unusedViewDU = type.toViewDU(value);

    it(`should create ViewDU from a seedViewDU with ${seedLength} uint64`, () => {
      for (let i = seedLength; i < 1024; i++) {
        const newValue = Array.from({length: i + 1}, (_, j) => j);
        const expectedRoot = type.toViewDU(newValue).hashTreeRoot();
        const viewDU = type.toViewDU(newValue, unusedViewDU);
        expect(viewDU.hashTreeRoot()).to.deep.equal(expectedRoot);
      }
    });
  }
});
