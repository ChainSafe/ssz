import {NoneType} from "../../../../src/type/none.ts";
import {runTypeTestValid} from "../runTypeTestValid.ts";

runTypeTestValid({
  type: new NoneType(),
  defaultValue: null,
  values: [{serialized: "0x", json: null, root: "0x0000000000000000000000000000000000000000000000000000000000000000"}],
});
