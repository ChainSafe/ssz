import {ContainerType, ListCompositeType, UintNumberType, ByteVectorType} from "../../../../src";
import {runTypeTestValid} from "../runTypeTestValid";

const uint64Type = new UintNumberType(8);

runTypeTestValid({
  type: new ListCompositeType(new ByteVectorType(32), 2 ** 7),
  defaultValue: [],
  values: [
    {
      id: "empty",
      serialized: "0x",
      json: [],
      root: "0x96559674a79656e540871e1f39c9b91e152aa8cddb71493e754827c4cc809d57",
    },
    {
      id: "2 roots",
      serialized:
        "0xddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      json: [
        "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      ],
      root: "0x0cb947377e177f774719ead8d210af9c6461f41baf5b4082f86a3911454831b8",
    },
  ],
});

runTypeTestValid({
  type: new ListCompositeType(new ContainerType({a: uint64Type, b: uint64Type}), 2 ** 7),
  defaultValue: [],
  values: [
    {
      id: "empty",
      serialized: "0x",
      json: [],
      root: "0x96559674a79656e540871e1f39c9b91e152aa8cddb71493e754827c4cc809d57",
    },
    {
      id: "2 values",
      serialized: "0x0000000000000000000000000000000040e2010000000000f1fb090000000000",
      json: [
        {a: "0", b: "0"},
        {a: "123456", b: "654321"},
      ],
      root: "0x8ff94c10d39ffa84aa937e2a077239c2742cb425a2a161744a3e9876eb3c7210",
    },
  ],
});
