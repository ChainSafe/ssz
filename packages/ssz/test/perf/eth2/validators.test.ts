import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {Validator} from "../../lodestarTypes/phase0/types";
import {ValidatorContainer, ValidatorNodeStruct, Validators} from "../../lodestarTypes/phase0/sszTypes";
import {BranchNodeStruct, CompositeViewDU} from "../../../src";

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

describe("ContainerNodeStructViewDU vs ValidatorViewDU hashtreeroot", () => {
  // ListValidatorTreeViewDU commits every 4 validators in batch
  const listValidator = Validators.toViewDU(Array.from({length: 4}, () => validatorStruct));
  const nodes: BranchNodeStruct<Validator>[] = [];
  for (let i = 0; i < listValidator.length; i++) {
    nodes.push(listValidator.get(i).node as BranchNodeStruct<Validator>);
  }

  // this does not create validator tree every time, and it compute roots in batch
  itBench({
    id: "ValidatorViewDU hashTreeRoot",
    beforeEach: () => {
      for (let i = 0; i < listValidator.length; i++) {
        listValidator.get(i).exitEpoch = 20242024;
      }
    },
    fn: () => {
      listValidator.commit();
    },
  })


  // this needs to create validator tree every time
  itBench({
    id: "ContainerNodeStructViewDU hashTreeRoot",
    beforeEach: () => {
      for (const node of nodes) {
        node.value.exitEpoch = 20242024;
        node.h0 = null as unknown as number;
      }
    },
    fn: ()  => {
      for (const node of nodes) {
        node.root;
      }
    },
  });
});
