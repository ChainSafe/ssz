import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {
  booleanType,
  ByteVectorType,
  ContainerType,
  List,
  ListType,
  NumberUintType,
  ObjectLike,
  TreeBacked,
} from "../../src";

describe("iterate", () => {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 10 * 1000,
    runs: 1000,
  });

  const N = 5000;
  const arr = Array.from({length: N}, () => ({foo: "bar"}));

  // ✓ Array - for of      100150.2 ops/s    9.985000 us/op        -     971778 runs   10.0 s
  // ✓ Array - for(;;)     166805.7 ops/s    5.995000 us/op        -    1589379 runs   10.1 s

  itBench("Array - for of", () => {
    for (const a of arr) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const x = a.foo;
    }
  });
  itBench("Array - for(;;)", () => {
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const x = a.foo;
    }
  });
});

describe("readonly values - iterator vs array", () => {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 10 * 1000,
    runs: 1000,
  });

  const length = 250_000;
  const balances = createBalanceList(length);

  itBench("basicListValue.readonlyValues()", () => {
    Array.from(balances.readonlyValues());
  });
  itBench("basicListValue.readonlyValuesArray()", () => {
    balances.readonlyValuesArray();
  });

  itBench("basicListValue.readonlyValues() + iterate all", () => {
    for (const balance of balances.readonlyValues()) {
      balance + 1;
    }
  });
  itBench("basicListValue.readonlyValuesArray() + loop all", () => {
    const balancesArray = balances.readonlyValuesArray();
    for (let i = 0; i < balancesArray.length; i++) {
      balancesArray[i] + 1;
    }
  });

  const validators = createValidatorList(length);

  itBench("compositeListValue.readonlyValues()", () => {
    Array.from(validators.readonlyValues());
  });
  itBench("compositeListValue.readonlyValuesArray()", () => {
    validators.readonlyValuesArray();
  });
  itBench("compositeListValue.readonlyValues() + iterate all", () => {
    for (const v of validators.readonlyValues()) {
      v;
    }
  });
  itBench("compositeListValue.readonlyValuesArray() + loop all", () => {
    const validatorsArray = validators.readonlyValuesArray();
    for (let i = 0; i < validatorsArray.length; i++) {
      validatorsArray[i];
    }
  });
});

function createBalanceList(count: number): TreeBacked<List<number>> {
  const VALIDATOR_REGISTRY_LIMIT = 1099511627776;

  const balancesList = new ListType({
    elementType: new NumberUintType({byteLength: 8}),
    limit: VALIDATOR_REGISTRY_LIMIT,
  });
  const balancesStruct = Array.from({length: count}, () => 31217089836);
  return balancesList.createTreeBackedFromStruct(balancesStruct);
}
function createValidatorList(count: number): TreeBacked<List<ObjectLike>> {
  const VALIDATOR_REGISTRY_LIMIT = 1099511627776;

  const Validator = new ContainerType({
    fields: {
      pubkey: new ByteVectorType({length: 48}),
      withdrawalCredentials: new ByteVectorType({length: 32}),
      effectiveBalance: new NumberUintType({byteLength: 8}),
      slashed: booleanType,
      activationEligibilityEpoch: new NumberUintType({byteLength: 8}),
      activationEpoch: new NumberUintType({byteLength: 8}),
      exitEpoch: new NumberUintType({byteLength: 8}),
      withdrawableEpoch: new NumberUintType({byteLength: 8}),
    },
  });
  const validatorList = new ListType({
    elementType: Validator,
    limit: VALIDATOR_REGISTRY_LIMIT,
  });
  const validatorsStruct = Array.from({length: count}, () => ({
    pubkey: new Uint8Array(48),
    withdrawalCredentials: new Uint8Array(32),
    effectiveBalance: 31217089836,
    slashed: false,
    activationEligibilityEpoch: 31217089836,
    activationEpoch: 31217089836,
    exitEpoch: 31217089836,
    withdrawableEpoch: 31217089836,
  }));
  return validatorList.createTreeBackedFromStruct(validatorsStruct);
}
