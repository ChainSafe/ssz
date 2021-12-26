import {BasicListType, ByteListType, byteType, fromHexString} from "../../../../src";
import {runTypeTestValid} from "../testRunners";

for (const {typeName, type} of [
  {typeName: "ByteListType(256)", type: new ByteListType({limit: 256})},
  {typeName: "BasicListType(byte,256)", type: new BasicListType({limit: 256, elementType: byteType})},
]) {
  const hexToJson =
    typeName === "ByteListType(256)"
      ? // ByteListType(256) wants a hex string
        (hex: string): string => hex
      : // BasicListType(byte,256) wants an array of numbers
        (hex: string): number[] => [...fromHexString(hex)];

  runTypeTestValid({
    typeName,
    type,
    defaultValue: [],
    values: [
      {
        id: "4 bytes zero",
        serialized: "0x00000000",
        json: hexToJson("0x00000000"),
        root: "0xa39babe565305429771fc596a639d6e05b2d0304297986cdd2ef388c1936885e",
      },
      {
        id: "4 bytes some value",
        serialized: "0x0cb94737",
        json: hexToJson("0x0cb94737"),
        root: "0x2e14da116ecbec4c8d693656fb5b69bb0ea9e84ecdd15aba7be1c008633f2885",
      },
      {
        id: "32 bytes zero",
        serialized: "0x0000000000000000000000000000000000000000000000000000000000000000",
        json: hexToJson("0x0000000000000000000000000000000000000000000000000000000000000000"),
        root: "0xbae146b221eca758702e29b45ee7f7dc3eea17d119dd0a3094481e3f94706c96",
      },
      {
        id: "32 bytes some value",
        serialized: "0x0cb947377e177f774719ead8d210af9c6461f41baf5b4082f86a3911454831b8",
        json: hexToJson("0x0cb947377e177f774719ead8d210af9c6461f41baf5b4082f86a3911454831b8"),
        root: "0x50425dbd7a34b50b20916e965ce5c060abe6516ac71bb00a4afebe5d5c4568b8",
      },
      {
        id: "96 bytes zero",
        serialized:
          "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        json: hexToJson(
          "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        ),
        root: "0xcd09661f4b2109fb26decd60c004444ea5308a304203412280bd2af3ace306bf",
      },
      {
        id: "96 bytes some value",
        serialized:
          "0xb55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1",
        json: hexToJson(
          "0xb55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1"
        ),
        root: "0x5d3ae4b886c241ffe8dc7ae1b5f0e2fb9b682e1eac2ddea292ef02cc179e6903",
      },
    ],
  });
}
