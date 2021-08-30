import {itBench} from "@dapplion/benchmark";
import {Validator} from "../lodestar/phase0/types";
import {Validator as ValidatorType} from "../lodestar/phase0/sszTypes";
import {ContainerLeafNodeStructType, ContainerType, TreeBacked} from "../../src";

const ValidatorLeafNodeStructType = new ContainerLeafNodeStructType<Validator>({fields: ValidatorType.fields});

const validatorStruct: Validator = {
  pubkey: Buffer.alloc(48, 0xdd),
  withdrawalCredentials: Buffer.alloc(32, 0xdd),
  effectiveBalance: BigInt(32e9),
  slashed: false,
  activationEligibilityEpoch: 134530,
  activationEpoch: 134532,
  exitEpoch: Infinity,
  withdrawableEpoch: Infinity,
};

describe("Validator vs ValidatorLeafNodeStruct", () => {
  const validatorTB = ValidatorType.createTreeBackedFromStruct(validatorStruct);
  const validatorLeafNodeStructTB = ValidatorLeafNodeStructType.createTreeBackedFromStruct(validatorStruct);
  validatorTB.hashTreeRoot();
  validatorLeafNodeStructTB.hashTreeRoot();

  const values = [
    {id: "ContainerType", value: validatorTB, type: ValidatorType},
    {id: "ContainerLeafNodeStructType", value: validatorLeafNodeStructTB, type: ValidatorLeafNodeStructType},
  ];

  const ops: Record<string, (treeBacked: TreeBacked<Validator>, type: ContainerType<Validator>) => unknown> = {
    get_exitEpoch: (tb) => tb.exitEpoch,
    set_exitEpoch: (tb) => (tb.exitEpoch = 6435),
    get_pubkey: (tb) => tb.pubkey,
    hashTreeRoot: (tb) => tb.hashTreeRoot(),
    createProof: (tb) => tb.createProof([["exitEpoch"]]),
    serialize: (tb) => tb.serialize(),
    set_exitEpoch_and_hashTreeRoot: (tb) => {
      tb.exitEpoch = 6435;
      tb.createProof([["exitEpoch"]]);
    },
  };

  for (const [opId, op] of Object.entries(ops)) {
    for (const {id: valueId, value, type} of values) {
      itBench(`${opId} - ${valueId}`, () => {
        op(value, type);
      });
    }
  }
});
