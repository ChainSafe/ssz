import {BitArray, ProfileType, UintNumberType} from "../../../../src/index.ts";
import {runTypeTestValid} from "../runTypeTestValid.ts";

// taken from eip spec tests

const uint16 = new UintNumberType(2);
const byteType = new UintNumberType(1);

const Square = new ProfileType(
  {
    side: uint16,
    color: byteType,
  },
  BitArray.fromBoolArray([true, true, false, false])
);

const Circle = new ProfileType(
  {
    color: byteType,
    radius: uint16,
  },
  BitArray.fromBoolArray([false, true, true, false])
);

runTypeTestValid({
  type: Square,
  defaultValue: {side: 0, color: 0},
  values: [
    {
      id: "circle1-0",
      serialized: "0x420001",
      json: {side: 0x42, color: 1},
      root: "0xbfdb6fda9d02805e640c0f5767b8d1bb9ff4211498a5e2d7c0f36e1b88ce57ff",
    },
  ],
});

runTypeTestValid({
  type: Circle,
  defaultValue: {color: 0, radius: 0},
  values: [
    {
      id: "square1-0",
      serialized: "0x014200",
      json: {color: 1, radius: 0x42},
      root: "0xf66d2c38c8d2afbd409e86c529dff728e9a4208215ca20ee44e49c3d11e145d8",
    },
  ],
});
