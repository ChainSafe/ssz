import {itBench} from "@dapplion/benchmark";
import {Validator} from "../lodestarTypes/phase0/types";
import {Validator as ValidatorDef} from "../lodestarTypes/phase0/sszTypes";
import {CompositeViewDU, ContainerNodeStructType, ContainerType} from "../../src";

// Fully tree-backed ContainerType
const ValidatorContainerType = new ContainerType(ValidatorDef.fields);
// Container caches only root hash + represents all data as a struct
const ValidatorLeafNodeStructType = new ContainerNodeStructType(ValidatorDef.fields);

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
  const validatorTB = ValidatorContainerType.toViewDU(validatorStruct);
  const validatorLeafNodeStructTB = ValidatorLeafNodeStructType.toViewDU(validatorStruct);
  validatorTB.hashTreeRoot();
  validatorLeafNodeStructTB.hashTreeRoot();

  const values = [
    {id: "ContainerType", value: validatorTB, type: ValidatorContainerType},
    {id: "ContainerNodeStructType", value: validatorLeafNodeStructTB, type: ValidatorLeafNodeStructType},
  ];

  const ops: Record<string, (treeBacked: CompositeViewDU<typeof ValidatorDef>, type: typeof ValidatorDef) => unknown> =
    {
      get_exitEpoch: (tb) => tb.exitEpoch,
      set_exitEpoch: (tb) => (tb.exitEpoch = 6435),
      get_pubkey: (tb) => tb.pubkey,
      hashTreeRoot: (tb) => tb.hashTreeRoot(),
      // TODO: @wemeetagain
      // createProof: (tb) => tb.createProof([["exitEpoch"]]),
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
