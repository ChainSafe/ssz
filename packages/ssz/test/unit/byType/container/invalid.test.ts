import {SimpleObject, VariableSizeSimpleObject} from "../../testTypes";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

runTypeTestInvalid({
  type: SimpleObject,
  values: [
    // error is empty because struct and tree throw different errors
    {serialized: "", error: ""},
    {serialized: "00", error: ""},
  ],
});

runTypeTestInvalid({
  type: VariableSizeSimpleObject,
  values: [
    // error is empty because struct and tree throw different errors
    {serialized: "", error: ""},
    {serialized: "00", error: ""},
  ],
});
