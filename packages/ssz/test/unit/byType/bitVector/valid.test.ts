import {BitVectorType} from "../../../../src";
import {runTypeTestValid} from "../testRunners";

runTypeTestValid({
  typeName: "BitVector(128)",
  type: new BitVectorType({length: 128}),
  defaultValue: Array.from({length: 128}, () => false),
  values: [
    {
      id: "empty",
      serialized: "0x00000000000000000000000000000001",
      json: "0x00000000000000000000000000000001",
      root: "0x0000000000000000000000000000000100000000000000000000000000000000",
    },
    {
      id: "some value",
      serialized: "0xb55b8592bcac475906631481bbc746bc",
      json: "0xb55b8592bcac475906631481bbc746bc",
      root: "0xb55b8592bcac475906631481bbc746bc00000000000000000000000000000000",
    },
  ],
});

runTypeTestValid({
  typeName: "BitVector(512)",
  type: new BitVectorType({length: 512}),
  defaultValue: Array.from({length: 512}, () => false),
  values: [
    {
      id: "empty",
      serialized:
        "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
      json: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
      root: "0x90f4b39548df55ad6187a1d20d731ecee78c545b94afd16f42ef7592d99cd365",
    },
    {
      id: "some value",
      serialized:
        "0xb55b8592bcac475906631481bbc746bccb647cbb184136609574cacb2958b55bb55b8592bcac475906631481bbc746bccb647cbb184136609574cacb2958b55b",
      json: "0xb55b8592bcac475906631481bbc746bccb647cbb184136609574cacb2958b55bb55b8592bcac475906631481bbc746bccb647cbb184136609574cacb2958b55b",
      root: "0xf5619a9b3c6831a68fdbd1b30b69843c778b9d36ed1ff6831339ba0f723dbea0",
    },
  ],
});
