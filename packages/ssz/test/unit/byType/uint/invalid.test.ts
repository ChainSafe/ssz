import {UintNumberType} from "../../../../src";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

runTypeTestInvalid({
  type: new UintNumberType(8),
  values: [
    // error is empty because struct and tree throw different errors
    {serialized: "", error: ""},
    {serialized: "00", error: ""},
  ],
});
