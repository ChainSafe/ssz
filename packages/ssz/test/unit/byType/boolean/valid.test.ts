import {booleanType} from "../../../../src";
import {runTypeTestValid} from "../testRunners";

runTypeTestValid({
  typeName: "boolean",
  type: booleanType,
  defaultValue: false,
  values: [
    {
      id: "false",
      serialized: "0x00",
      json: false,
      root: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "true",
      serialized: "0x01",
      json: true,
      root: "0x0100000000000000000000000000000000000000000000000000000000000000",
    },
  ],
});
