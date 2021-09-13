import {expect} from "chai";
import {VectorBasicType, VectorCompositeType} from "../../../../src";
import {uint16NumType} from "../../../utils/primitiveTypes";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

runTypeTestInvalid({
  type: new VectorBasicType(uint16NumType, 2),
  values: [
    {id: "Length over length", serialized: "01".repeat(3), json: Array(3).fill(1)},
    {id: "Length under length", serialized: "01".repeat(1), json: Array(1).fill(1)},
    {id: "Empty", serialized: "", json: []},

    {id: "Object", json: {}},
    {id: "null", json: null},
    {id: "Object stringified", json: JSON.stringify({})},
  ],
});

describe("VectorType constructor errors", () => {
  it("length must be > 0", () => {
    expect(() => new VectorBasicType(uint16NumType, 0)).to.throw();
    expect(() => new VectorCompositeType(new VectorBasicType(uint16NumType, 2), 0)).to.throw();
  });
});
