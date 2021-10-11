import {ListType, Number64UintType} from "../../../src";
import {runTypeTest} from "./runTypeTest";

runTypeTest({
  typeName: "List(Number64UintType)",
  type: new ListType({elementType: new Number64UintType(), limit: 2 ** 7}),
  defaultValue: [],
  values: [
    {
      id: "empty",
      serialized: "0x",
      json: [],
      root: "0x52e2647abc3d0c9d3be0387f3f0d925422c7a4e98cf4489066f0f43281a899f3",
    },
    {
      id: "4 values",
      serialized: "0xa086010000000000400d030000000000e093040000000000801a060000000000",
      json: ["100000", "200000", "300000", "400000"],
      root: "0xd1daef215502b7746e5ff3e8833e399cb249ab3f81d824be60e174ff5633c1bf",
    },
    {
      id: "8 values",
      serialized:
        "0xa086010000000000400d030000000000e093040000000000801a060000000000a086010000000000400d030000000000e093040000000000801a060000000000",
      json: ["100000", "200000", "300000", "400000", "100000", "200000", "300000", "400000"],
      root: "0xb55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1",
    },
  ],
});
