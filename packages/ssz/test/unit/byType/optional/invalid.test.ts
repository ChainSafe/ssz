import {OptionalType, UintNumberType} from "../../../../src/index.ts";
import {runTypeTestInvalid} from "../runTypeTestInvalid.ts";

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
