import {OptionalType, StableContainerType, UintNumberType} from "../../../../src";
import {runTypeTestValid} from "../runTypeTestValid";

// taken from eip spec tests

const optionalUint16 = new OptionalType(new UintNumberType(2));
const byteType = new UintNumberType(1);
const Shape = new StableContainerType(
  {
    side: optionalUint16,
    color: byteType,
    radius: optionalUint16,
  },
  4
);

runTypeTestValid({
  type: Shape,
  defaultValue: {side: null, color: 0, radius: null},
  values: [
    {
      id: "shape-0",
      serialized: "0x074200014200",
      json: {side: 0x42, color: 1, radius: 0x42},
      root: "0x37b28eab19bc3e246e55d2e2b2027479454c27ee006d92d4847c84893a162e6d",
    },
    {
      id: "shape-1",
      serialized: "0x03420001",
      json: {side: 0x42, color: 1, radius: null},
      root: "0xbfdb6fda9d02805e640c0f5767b8d1bb9ff4211498a5e2d7c0f36e1b88ce57ff",
    },
    {
      id: "shape-2",
      serialized: "0x0201",
      json: {side: null, color: 1, radius: null},
      root: "0x522edd7309c0041b8eb6a218d756af558e9cf4c816441ec7e6eef42dfa47bb98",
    },
    {
      id: "shape-3",
      serialized: "0x06014200",
      json: {side: null, color: 1, radius: 0x42},
      root: "0xf66d2c38c8d2afbd409e86c529dff728e9a4208215ca20ee44e49c3d11e145d8",
    },
  ],
});
