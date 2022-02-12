import {itBench} from "@dapplion/benchmark";
import {Validator} from "../lodestarTypes/phase0/types";
import {ValidatorContainer, ValidatorNodeStruct} from "../lodestarTypes/phase0/sszTypes";
import {CompositeViewDU} from "../../src";

const validatorStruct: Validator = {
  pubkey: Buffer.alloc(48, 0xdd),
  withdrawalCredentials: Buffer.alloc(32, 0xdd),
  effectiveBalance: 32e9,
  slashed: false,
  activationEligibilityEpoch: 134530,
  activationEpoch: 134532,
  exitEpoch: Infinity,
  withdrawableEpoch: Infinity,
};

describe("Validator vs ValidatorLeafNodeStruct", () => {
  const validatorTB = ValidatorContainer.toViewDU(validatorStruct);
  const validatorLeafNodeStructTB = ValidatorNodeStruct.toViewDU(validatorStruct);
  validatorTB.hashTreeRoot();
  validatorLeafNodeStructTB.hashTreeRoot();

  const values = [
    {id: "ContainerType", value: validatorTB, type: ValidatorContainer},
    {id: "ContainerNodeStructType", value: validatorLeafNodeStructTB, type: ValidatorNodeStruct},
  ];

  const ops: Record<
    string,
    (treeBacked: CompositeViewDU<typeof ValidatorContainer>, type: typeof ValidatorContainer) => unknown
  > = {
    get_exitEpoch: (tb) => tb.exitEpoch,
    set_exitEpoch: (tb) => (tb.exitEpoch = 6435),
    get_pubkey: (tb) => tb.pubkey,
    hashTreeRoot: (tb) => tb.hashTreeRoot(),
    createProof: (tb) => tb.createProof([["exitEpoch"]]),
    serialize: (tb) => tb.serialize(),
    set_exitEpoch_and_hashTreeRoot: (tb) => {
      tb.exitEpoch = 6435;
      tb.hashTreeRoot();
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
