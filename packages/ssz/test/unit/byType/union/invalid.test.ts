import {expect} from "chai";
import {UintNumberType, UnionType, NoneType} from "../../../../src";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

const byteType = new UintNumberType(1);
const noneType = new NoneType();

runTypeTestInvalid({
  type: new UnionType([noneType, byteType]),
  values: [
    {id: "Selector too high", serialized: "0x02ff"},

    {id: "No selector", json: {}},
    {id: "Bad selector", json: {selector: "1"}},
    {id: "Selector to high JSON", json: {selector: 2}},
    {id: "Array", json: []},
    {id: "null", json: null},
    {id: "Object stringified", json: JSON.stringify({})},
  ],
});

// Invalid types at constructor time

describe("Invalid UnionType at constructor", () => {
  it("UnionType over 128 types", () => {
    expect(() => new UnionType(new Array(128).fill(byteType))).to.throw();
  });
  it("UnionType 0 types", () => {
    expect(() => new UnionType([])).to.throw();
  });
  it("UnionType only None", () => {
    expect(() => new UnionType([noneType])).to.throw();
  });
  it("UnionType None second", () => {
    expect(() => new UnionType([byteType, noneType])).to.throw();
  });
});
