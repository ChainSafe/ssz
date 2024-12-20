import {BooleanType} from "../../../../src/index.js";
import {runTypeTestInvalid} from "../runTypeTestInvalid.js";

runTypeTestInvalid({
  type: new BooleanType(),
  values: [
    {id: "Over 1", serialized: "0x02"},
    {id: "Max byte", serialized: "0xff"},
    {id: "Longer than 1 byte", serialized: "0x0001"},

    {id: "Number", json: 1},
    {id: "String 'true'", json: "true"},
    {id: "Object", json: {}},
    {id: "Array", json: []},
    {id: "null", json: null},
    {id: "Object stringified", json: JSON.stringify({})},
  ],
});
