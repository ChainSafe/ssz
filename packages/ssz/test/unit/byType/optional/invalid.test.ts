import {expect} from "chai";
import {UintNumberType, OptionalType} from "../../../../src";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

const byteType = new UintNumberType(1);

runTypeTestInvalid({
  type: new OptionalType(byteType),
  values: [
    {id: "Bad selector", serialized: "0x02ff"},

    {id: "Array", json: []},
    {id: "incorrect value", json: {}},
    {id: "Object stringified", json: JSON.stringify({})},
  ],
});
