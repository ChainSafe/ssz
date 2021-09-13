import {NoneType} from "../../../../src/type/none";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

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
