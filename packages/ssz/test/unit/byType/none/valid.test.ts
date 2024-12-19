import {NoneType} from "../../../../src/type/none.js";
import {runTypeTestValid} from "../runTypeTestValid.js";

runTypeTestValid({
  type: new NoneType(),
  defaultValue: null,
  values: [{serialized: "0x", json: null, root: "0x0000000000000000000000000000000000000000000000000000000000000000"}],
});
