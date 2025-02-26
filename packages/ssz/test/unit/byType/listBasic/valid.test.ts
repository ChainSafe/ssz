import {ListBasicType, UintNumberType} from "../../../../src/index.ts";
import {runTypeTestValid} from "../runTypeTestValid.ts";

runTypeTestValid({
  type: new ListBasicType(new UintNumberType(1), 128),
  defaultValue: [],
  values: [
    {
      id: "empty",
      serialized: "0x",
      json: [],
      root: "0x28ba1834a3a7b657460ce79fa3a1d909ab8828fd557659d4d0554a9bdbc0ec30",
    },
    {
      id: "4 values",
      serialized: "0x01020304",
      json: ["1", "2", "3", "4"],
      root: "0xbac511d1f641d6b8823200bb4b3cced3bd4720701f18571dff35a5d2a40190fa",
    },
    {
      id: "64 values",
      serialized: "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f2021",
      json: linspaceStr(0, 33, 1),
      root: "0x80cecdb616ea55c0c59551845456f6dbad7d91edd36865724fe6a482b0cae66b",
    },
  ],
});

runTypeTestValid({
  type: new ListBasicType(new UintNumberType(8), 128),
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

function linspaceStr(from: number, to: number, step: number): string[] {
  const arr: string[] = [];
  for (let i = from; i <= to; i += step) {
    arr.push(String(i));
  }
  return arr;
}
