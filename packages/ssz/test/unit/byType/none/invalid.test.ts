import {NoneType} from "../../../../src/type/none.js";
import {runTypeTestInvalid} from "../runTypeTestInvalid.js";

runTypeTestInvalid({
  type: new NoneType(),
  values: [
    {id: "String null", json: "null"},
    {id: "Zero", json: 0},
    {id: "Object", json: {}},
    {id: "Array", json: []},
    {id: "Object stringified", json: JSON.stringify({})},
  ],
});
