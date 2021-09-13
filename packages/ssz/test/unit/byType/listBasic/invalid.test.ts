import {ListBasicType, UintNumberType} from "../../../../src";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

runTypeTestInvalid({
  type: new ListBasicType(new UintNumberType(1), 2),
  values: [
    {id: "Length over limit", serialized: "01".repeat(3), json: Array(3).fill(1)},

    {id: "Object", json: {}},
    {id: "null", json: null},
    {id: "Object stringified", json: JSON.stringify({})},
  ],
});
