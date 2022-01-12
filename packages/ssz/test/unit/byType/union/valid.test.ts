import {ContainerType, NumberUintType, UnionType} from "../../../../src";
import {NoneType} from "../../../../src/types_old/basic/none";
import {runTypeTestValid} from "../testRunners";

const number16Type = new NumberUintType({byteLength: 2});
const SimpleObject = new ContainerType({
  fields: {
    b: number16Type,
    a: number16Type,
  },
});

runTypeTestValid({
  typeName: "Union(Node, Container, Uint16)",
  type: new UnionType({types: [new NoneType(), SimpleObject, number16Type]}),
  defaultValue: {selector: 0, value: null},
  values: [
    {
      id: "None",
      serialized: "0x00", // 1st byte = 0 => None type
      json: {selector: 0, value: null},
      root: "0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b",
    },
    {
      id: "Container",
      serialized: "0x010e000d00", // 1st byte = 1 => SimpleObject type
      json: {selector: 1, value: {a: 0xd, b: 0xe}},
      root: "0x877853415ee3688a63df0cbdbbd436d397f9008b49431b24b39fb3698bd6f034",
    },
    {
      id: "Uint16",
      serialized: "0x020d00", // 1st byte = 2 => number16 type
      json: {selector: 2, value: 0xd},
      root: "0x487e42872db8f54736409836c93d9a3aaf3d6fc86b2ce8a4120d061ce7d4e284",
    },
  ],
});
