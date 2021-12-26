import {NumberUintType} from "../../../../src";
import {runTypeTestInvalid} from "../testRunners";

runTypeTestInvalid({
  typeName: "NumberUintType(8)",
  type: new NumberUintType({byteLength: 8}),
  values: [
    // error is empty because struct and tree throw different errors
    {serialized: "", error: ""},
    {serialized: "00", error: ""},
  ],
});
