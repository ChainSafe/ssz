import {expect} from "chai";
import {BitListType, BitArray, toHexString} from "../../../../src/index.js";
import {runTypeTestValid} from "../runTypeTestValid.js";

runTypeTestValid({
  type: new BitListType(2048),
  defaultValue: BitArray.fromBitLen(0),
  values: [
    {
      id: "empty",
      serialized: "0x01",
      json: "0x01",
      root: "0xe8e527e84f666163a90ef900e013f56b0a4d020148b2224057b719f351b003a6",
    },

    {
      id: "zero'ed 1 bytes",
      serialized: "0x0010",
      json: "0x0010",
      root: "0x07eb640282e16eea87300c374c4894ad69b948de924a158d2d1843b3cf01898a",
    },
    {
      id: "zero'ed 8 bytes",
      serialized: "0x000000000000000010",
      json: "0x000000000000000010",
      root: "0x5c597e77f879e249af95fe543cf5f4dd16b686948dc719707445a32a77ff6266",
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

// Extra test cases to ensure padding bit is applied correctly
describe("BitList padding bit", () => {
  const testCases = [
    {bools: [], hex: [0b1]},
    {bools: Array(1).fill(true), hex: [0b11]},
    {bools: Array(1).fill(false), hex: [0b10]},
    {bools: Array(3).fill(true), hex: [0b1111]},
    {bools: Array(3).fill(false), hex: [0b1000]},
    {bools: Array(8).fill(true), hex: [0b11111111, 0b00000001]},
    {bools: Array(8).fill(false), hex: [0b00000000, 0b00000001]},
  ];

  const bitLen = Math.max(...testCases.map((t) => t.bools.length));
  const type = new BitListType(bitLen);

  for (const {bools, hex} of testCases) {
    it(hex.map((byte) => byte.toString(2).padStart(8, "0")).join(","), () => {
      const serialized = new Uint8Array(hex);

      const bitArray = BitArray.fromBoolArray(bools);
      expect(toHexString(type.serialize(bitArray))).equals(toHexString(serialized), "Wrong value to bytes");

      const bitArrayDeserialized = type.deserialize(serialized);
      expect(bitArrayDeserialized.toBoolArray()).deep.equals(bools, "Wrong deserialized");
    });
  }
});
