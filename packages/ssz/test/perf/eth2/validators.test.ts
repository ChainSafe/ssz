import {bench, describe} from "@chainsafe/benchmark";
import {BranchNodeStruct, CompositeViewDU, ContainerNodeStructTreeViewDU} from "../../../src/index.js";
import {ValidatorContainer, ValidatorNodeStruct, Validators} from "../../lodestarTypes/phase0/sszTypes.js";
import {Validator} from "../../lodestarTypes/phase0/types.js";
import {ValidatorType} from "../../lodestarTypes/phase0/validator.js";
import {doBatchHashTreeRootValidators} from "../../lodestarTypes/phase0/viewDU/listValidator.js";
import {ValidatorIndex} from "../../lodestarTypes/types.js";

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
      bench(`${opId} - ${valueId}`, () => {
        op(value, type);
      });
    }
  }
});

/**
 * This is almost 6x faster on a Mac machine
 * batch hash validators
 *   ✔ doBatchHashTreeRootValidators                                       478927.2 ops/s    2.088000 us/op        -     226628 runs  0.505 s
 *   ✔ ContainerNodeStructViewDU hashTreeRoot                              82182.77 ops/s    12.16800 us/op        -      39987 runs  0.505 s
 */
describe("batch hash validators", () => {
  // ListValidatorTreeViewDU commits every 4 validators in batch
  const listValidator = Validators.toViewDU(Array.from({length: 4}, () => validatorStruct));
  const nodes: BranchNodeStruct<Validator>[] = [];
  const validatorsMap: Map<ValidatorIndex, ContainerNodeStructTreeViewDU<typeof ValidatorType>> = new Map();
  for (let i = 0; i < listValidator.length; i++) {
    nodes.push(listValidator.get(i).node as BranchNodeStruct<Validator>);
    validatorsMap.set(i, listValidator.get(i) as unknown as ContainerNodeStructTreeViewDU<typeof ValidatorType>);
  }

  // this does not create validator tree every time, and it compute roots in batch
  bench({
    id: "doBatchHashTreeRootValidators",
    beforeEach: () => {
      for (let i = 0; i < listValidator.length; i++) {
        const validator = listValidator.get(i);
        validator.exitEpoch = 20242024;
        validator.node.h0 = null as unknown as number;
      }
    },
    fn: () => {
      doBatchHashTreeRootValidators([0, 1, 2, 3], validatorsMap);

      // make sure all validators' root is computed
      for (let i = 0; i < listValidator.length; i++) {
        if (listValidator.get(i).node.h0 == null) {
          throw Error("root not computed");
        }
      }
    },
  });

  // this needs to create validator tree every time
  bench({
    id: "ContainerNodeStructViewDU hashTreeRoot",
    beforeEach: () => {
      for (const node of nodes) {
        node.value.exitEpoch = 20242024;
        node.h0 = null as unknown as number;
      }
    },
    fn: () => {
      for (const node of nodes) {
        node.root;
      }
    },
  });
});
