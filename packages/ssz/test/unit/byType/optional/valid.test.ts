import {ContainerType, ListBasicType, ListCompositeType, OptionalType, UintNumberType} from "../../../../src/index.js";
import {runTypeTestValid} from "../runTypeTestValid.js";

const number8Type = new UintNumberType(1);
const SimpleObject = new ContainerType({
  b: number8Type,
  a: number8Type,
});

// test for a basic type
runTypeTestValid({
  type: new OptionalType(number8Type),
  defaultValue: null,
  values: [
    {serialized: "0x", json: null, root: "0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b"},
    {serialized: "0x0109", json: 9, root: "0xc17ba48dfddbdec0cbfbf24c1aef5ebac372f63b9dad08e99224d0c9a9f22f72"},
  ],
});

// null should merklize same as empty list or list with 1 value but serializes without optional prefix 0x01
runTypeTestValid({
  type: new ListBasicType(number8Type, 1),
  defaultValue: [],
  values: [
    {serialized: "0x", json: [], root: "0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b"},
    {serialized: "0x09", json: [9], root: "0xc17ba48dfddbdec0cbfbf24c1aef5ebac372f63b9dad08e99224d0c9a9f22f72"},
  ],
});

// test for a composite type
runTypeTestValid({
  type: new OptionalType(SimpleObject),
  defaultValue: null,
  values: [
    {serialized: "0x", json: null, root: "0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b"},
    {
      serialized: "0x010b09",
      json: {a: 9, b: 11},
      root: "0xb4fc36ed412e6f56e3002b2f56559c55420e843e182168ed087669bd3e5338a7",
    },
  ],
});

// null should merklize same as empty list or list with 1 value but serializes without optional prefix 0x01
runTypeTestValid({
  type: new ListCompositeType(SimpleObject, 1),
  defaultValue: [],
  values: [
    {serialized: "0x", json: [], root: "0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b"},
    {
      serialized: "0x0b09",
      json: [{a: 9, b: 11}],
      root: "0xb4fc36ed412e6f56e3002b2f56559c55420e843e182168ed087669bd3e5338a7",
    },
  ],
});
