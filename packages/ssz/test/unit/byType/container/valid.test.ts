import {ContainerType, ListBasicType, UintNumberType} from "../../../../src";
import {SignedContributionAndProof} from "../../../lodestarTypes/altair/sszTypes";
import {replaceUintTypeWithUintBigintType} from "../../../spec/replaceUintTypeWithUintBigintType";
import {runTypeTestValid} from "../runTypeTestValid";

const uint64Type = new UintNumberType(8, true);

runTypeTestValid({
  type: new ContainerType({a: uint64Type, b: uint64Type}, {typeName: "Container({a: Uint64, b: Uint64})"}),
  defaultValue: {a: 0, b: 0},
  values: [
    {
      id: "zero",
      serialized: "0x00000000000000000000000000000000",
      json: {a: "0", b: "0"},
      root: "0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b",
    },
    {
      id: "some value",
      serialized: "0x40e2010000000000f1fb090000000000",
      json: {a: "123456", b: "654321"},
      root: "0x53b38aff7bf2dd1a49903d07a33509b980c6acc9f2235a45aac342b0a9528c22",
    },
  ],
});

runTypeTestValid({
  type: new ContainerType(
    {a: new ListBasicType(uint64Type, 2 ** 7), b: uint64Type},
    {typeName: "Container({a: List(Uint64), b: Uint64})"}
  ),
  defaultValue: {a: [], b: 0},
  values: [
    {
      id: "zero",
      serialized: "0x0c0000000000000000000000",
      json: {a: [], b: "0"},
      root: "0xdc3619cbbc5ef0e0a3b38e3ca5d31c2b16868eacb6e4bcf8b4510963354315f5",
    },
    {
      id: "some value",
      serialized:
        "0x0c000000f1fb09000000000040e2010000000000f1fb09000000000040e2010000000000f1fb09000000000040e2010000000000",
      json: {a: ["123456", "654321", "123456", "654321", "123456"], b: "654321"},
      root: "0x5ff1b92b2fa55eea1a14b26547035b2f5437814b3436172205fa7d6af4091748",
    },
  ],
});

runTypeTestValid({
  type: replaceUintTypeWithUintBigintType(SignedContributionAndProof),
  values: [
    {
      id: "SignedContributionAndProof ssz_random_chaos case_8",
      serialized:
        "0x3486eec3bcf50104ffffffffffffffff629686f76c8608325615ec289e95c37efa3cd2bfc2d1876e8b0c916b6d1759a1ffffffffffffffffe91ca24392e49128bbbfcd92b93e8e5b33cca04f2c67011151dc86f571ae626b7b0f295a1ea21ddb1630e9599c9863e8d15e87b81c0664a541644776268739993dc8e912d96235d37009145b2376d88e5565596404e8997ca5defa5ad14c3c097c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004f0a9a6ff83d8005cd80f86be62baaa2fe6736355c1ee625628879f7d1c993e38fa2e62e69b191c1d3d403bd4d189bd991f5790e682bd575101d05a95e3dccac71287c247dbae57f6f40d6a888b20b52a4a6090d653b84d0d6f67c8ede71385d",
      json: {
        message: {
          aggregator_index: "288782042218268212",
          contribution: {
            slot: "18446744073709551615",
            beacon_block_root: "0x629686f76c8608325615ec289e95c37efa3cd2bfc2d1876e8b0c916b6d1759a1",
            subcommittee_index: "18446744073709551615",
            aggregation_bits: "0xe9",
            signature:
              "0x1ca24392e49128bbbfcd92b93e8e5b33cca04f2c67011151dc86f571ae626b7b0f295a1ea21ddb1630e9599c9863e8d15e87b81c0664a541644776268739993dc8e912d96235d37009145b2376d88e5565596404e8997ca5defa5ad14c3c097c",
          },
          selection_proof:
            "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        },
        signature:
          "0x4f0a9a6ff83d8005cd80f86be62baaa2fe6736355c1ee625628879f7d1c993e38fa2e62e69b191c1d3d403bd4d189bd991f5790e682bd575101d05a95e3dccac71287c247dbae57f6f40d6a888b20b52a4a6090d653b84d0d6f67c8ede71385d",
      },
      root: "0x1aab29e6019f2bf092250ba1c6c66e88d6a2389098b6035088a2ecf1dbf1b4a7",
    },
  ],
});
