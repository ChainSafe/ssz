import {ListBasicType, OptionalType, StableContainerType, UintNumberType} from "../../../../src/index.ts";
import {runTypeTestValid} from "../runTypeTestValid.ts";

// taken from eip spec tests

const optionalUint16 = new OptionalType(new UintNumberType(2));
const byteType = new UintNumberType(1);
const Shape1 = new StableContainerType(
  {
    side: optionalUint16,
    color: byteType,
    radius: optionalUint16,
  },
  4
);

const Shape2 = new StableContainerType(
  {
    side: optionalUint16,
    color: byteType,
    radius: optionalUint16,
  },
  8
);

const Shape3 = new StableContainerType(
  {
    side: optionalUint16,
    colors: new OptionalType(new ListBasicType(byteType, 4)),
    radius: optionalUint16,
  },
  8
);

runTypeTestValid({
  type: Shape1,
  defaultValue: {side: null, color: 0, radius: null},
  values: [
    {
      id: "shape1-0",
      serialized: "0x074200014200",
      json: {side: 0x42, color: 1, radius: 0x42},
      root: "0x37b28eab19bc3e246e55d2e2b2027479454c27ee006d92d4847c84893a162e6d",
    },
    {
      id: "shape1-1",
      serialized: "0x03420001",
      json: {side: 0x42, color: 1, radius: null},
      root: "0xbfdb6fda9d02805e640c0f5767b8d1bb9ff4211498a5e2d7c0f36e1b88ce57ff",
    },
    {
      id: "shape1-2",
      serialized: "0x0201",
      json: {side: null, color: 1, radius: null},
      root: "0x522edd7309c0041b8eb6a218d756af558e9cf4c816441ec7e6eef42dfa47bb98",
    },
    {
      id: "shape1-3",
      serialized: "0x06014200",
      json: {side: null, color: 1, radius: 0x42},
      root: "0xf66d2c38c8d2afbd409e86c529dff728e9a4208215ca20ee44e49c3d11e145d8",
    },
  ],
});
//
runTypeTestValid({
  type: Shape2,
  defaultValue: {side: null, color: 0, radius: null},
  values: [
    {
      id: "shape2-0",
      serialized: "0x074200014200",
      json: {side: 0x42, color: 1, radius: 0x42},
      root: "0x0792fb509377ee2ff3b953dd9a88eee11ac7566a8df41c6c67a85bc0b53efa4e",
    },
    {
      id: "shape2-1",
      serialized: "0x03420001",
      json: {side: 0x42, color: 1, radius: null},
      root: "0xddc7acd38ae9d6d6788c14bd7635aeb1d7694768d7e00e1795bb6d328ec14f28",
    },
    {
      id: "shape2-2",
      serialized: "0x0201",
      json: {side: null, color: 1, radius: null},
      root: "0x9893ecf9b68030ff23c667a5f2e4a76538a8e2ab48fd060a524888a66fb938c9",
    },
    {
      id: "shape2-3",
      serialized: "0x06014200",
      json: {side: null, color: 1, radius: 0x42},
      root: "0xe823471310312d52aa1135d971a3ed72ba041ade3ec5b5077c17a39d73ab17c5",
    },
  ],
});

runTypeTestValid({
  type: Shape3,
  defaultValue: {side: null, colors: null, radius: null},
  values: [
    {
      id: "shape2-0",
      serialized: "0x0742000800000042000102",
      json: {side: 0x42, colors: [1, 2], radius: 0x42},
      root: "0x1093b0f1d88b1b2b458196fa860e0df7a7dc1837fe804b95d664279635cb302f",
    },
    {
      id: "shape2-1",
      serialized: "0x014200",
      json: {side: 0x42, colors: null, radius: null},
      root: "0x28df3f1c3eebd92504401b155c5cfe2f01c0604889e46ed3d22a3091dde1371f",
    },
    {
      id: "shape2-2",
      serialized: "0x02040000000102",
      json: {side: null, colors: [1, 2], radius: null},
      root: "0x659638368467b2c052ca698fcb65902e9b42ce8e94e1f794dd5296ceac2dec3e",
    },
    {
      id: "shape2-3",
      serialized: "0x044200",
      json: {side: null, colors: null, radius: 0x42},
      root: "0xd585dd0561c718bf4c29e4c1bd7d4efd4a5fe3c45942a7f778acb78fd0b2a4d2",
    },
    {
      id: "shape2-4",
      serialized: "0x060600000042000102",
      json: {side: null, colors: [1, 2], radius: 0x42},
      root: "0x00fc0cecc200a415a07372d5d5b8bc7ce49f52504ed3da0336f80a26d811c7bf",
    },
  ],
});
