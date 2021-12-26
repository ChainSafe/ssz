import {BitListType, BitList} from "../../../../src";
import {runTypeTestValid} from "../testRunners";

runTypeTestValid({
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
