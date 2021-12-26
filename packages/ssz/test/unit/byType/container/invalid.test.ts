import {SimpleObject, VariableSizeSimpleObject} from "../../testTypes";
import {runTypeTestInvalid} from "../testRunners";

runTypeTestInvalid({
  typeName: "SimpleObject",
  type: SimpleObject,
  values: [
    // error is empty because struct and tree throw different errors
    {serialized: "", error: ""},
    {serialized: "00", error: ""},
  ],
});

runTypeTestInvalid({
  typeName: "VariableSizeSimpleObject",
  type: VariableSizeSimpleObject,
  values: [
    // error is empty because struct and tree throw different errors
    {serialized: "", error: ""},
    {serialized: "00", error: ""},
  ],
});
