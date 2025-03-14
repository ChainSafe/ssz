import {
  ByteVectorType,
  ContainerType,
  ListBasicType,
  ListCompositeType,
  UintNumberType,
} from "../../../../src/index.js";
import {runTypeTestValid} from "../runTypeTestValid.js";

const uint64Type = new UintNumberType(8);

runTypeTestValid({
  type: new ListCompositeType(new ByteVectorType(32), 128),
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
  type: new ListCompositeType(new ContainerType({a: uint64Type, b: uint64Type}), 128),
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

const uint16 = new UintNumberType(2);

runTypeTestValid({
  type: new ListCompositeType(new ListBasicType(uint16, 2), 2),
  defaultValue: [],
  values: [
    {
      id: "empty",
      serialized: "0x",
      json: [],
      root: "0x7a0501f5957bdf9cb3a8ff4966f02265f968658b7a9c62642cba1165e86642f5",
    },
    {
      id: "2 full values",
      serialized: "0x080000000c0000000100020003000400",
      json: [
        ["1", "2"],
        ["3", "4"],
      ],
      root: "0x58140d48f9c24545c1e3a50f1ebcca85fd40433c9859c0ac34342fc8e0a800b8",
    },
    {
      id: "2 empty values",
      serialized: "0x0800000008000000",
      json: [[], []],
      root: "0xe839a22714bda05923b611d07be93b4d707027d29fd9eef7aa864ed587e462ec",
    },
  ],
});
