import {ByteVectorType} from "../../../../src/index.ts";
import {runTypeTestValid} from "../runTypeTestValid.ts";

runTypeTestValid({
  type: new ByteVectorType(4),
  defaultValue: Buffer.alloc(4, 0),
  values: [
    {
      id: "zero",
      serialized: "0x00000000",
      json: "0x00000000",
      root: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "some value",
      serialized: "0x0cb94737",
      json: "0x0cb94737",
      root: "0x0cb9473700000000000000000000000000000000000000000000000000000000",
    },
  ],
});

runTypeTestValid({
  type: new ByteVectorType(32),
  defaultValue: Buffer.alloc(32, 0),
  values: [
    {
      id: "zero",
      serialized: "0x0000000000000000000000000000000000000000000000000000000000000000",
      json: "0x0000000000000000000000000000000000000000000000000000000000000000",
      root: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "some value",
      serialized: "0x0cb947377e177f774719ead8d210af9c6461f41baf5b4082f86a3911454831b8",
      json: "0x0cb947377e177f774719ead8d210af9c6461f41baf5b4082f86a3911454831b8",
      root: "0x0cb947377e177f774719ead8d210af9c6461f41baf5b4082f86a3911454831b8",
    },
  ],
});

runTypeTestValid({
  type: new ByteVectorType(96),
  defaultValue: Buffer.alloc(96, 0),
  values: [
    {
      id: "zero",
      serialized:
        "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      json: "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      root: "0xdb56114e00fdd4c1f85c892bf35ac9a89289aaecb1ebd0a96cde606a748b5d71",
    },
    {
      id: "some value",
      serialized:
        "0xb55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1",
      json: "0xb55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1b55b8592bcac475906631481bbc746bca7339d04ab1085e84884a700c03de4b1",
      root: "0x032eecca637b67fd922e0e421b4be9c22948719ba02c6d03eb2c61cfdc4cb3e3",
    },
  ],
});
