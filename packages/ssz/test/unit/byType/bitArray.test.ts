import {BitVectorType, BitListType, BitList} from "../../../src";
import {runTypeTest} from "./runTypeTest";

runTypeTest({
  typeName: "BitList(2048)",
  type: new BitListType({limit: 2048}),
  defaultValue: [] as boolean[] as BitList,
  values: [
    {
      id: "empty",
      serialized: "0x01",
      json: "0x01",
      root: "0xe8e527e84f666163a90ef900e013f56b0a4d020148b2224057b719f351b003a6",
    },
    {
      id: "short value",
      serialized: "0xb55b8592bcac475906631481bbc746bc",
      json: "0xb55b8592bcac475906631481bbc746bc",
      root: "0x9ab378cfbd6ec502da1f9640fd956bbef1f9fcbc10725397805c948865384e77",
    },
    {
      id: "long value",
      serialized: "0xb55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bc",
      json: "0xb55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bc",
      root: "0x4b71a7de822d00a5ff8e7e18e13712a50424cbc0e18108ab1796e591136396a0",
    },
  ],
});

runTypeTest({
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

runTypeTest({
  typeName: "BitVector(128)",
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
