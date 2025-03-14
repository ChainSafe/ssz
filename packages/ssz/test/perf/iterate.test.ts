import {bench, setBenchOpts, describe} from "@chainsafe/benchmark";
import {ListBasicType, UintNumberType} from "../../src/index.js";
import {Validators} from "../lodestarTypes/phase0/sszTypes.js";

describe("iterate", () => {
  setBenchOpts({noThreshold: true});

  const N = 5000;
  const arr = Array.from({length: N}, () => ({foo: "bar"}));

  // ✓ Array - for of      100150.2 ops/s    9.985000 us/op        -     971778 runs   10.0 s
  // ✓ Array - for(;;)     166805.7 ops/s    5.995000 us/op        -    1589379 runs   10.1 s

  bench("Array - for of", () => {
    for (const a of arr) {
      
      const x = a.foo;
    }
  });
  bench("Array - for(;;)", () => {
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      
      const x = a.foo;
    }
  });
});

describe("readonly values - iterator vs array", () => {
  const length = 250_000;
  const balances = createBalanceList(length);

  bench("basicListValue.readonlyValuesArray()", () => {
    balances.getAll();
  });

  bench("basicListValue.readonlyValuesArray() + loop all", () => {
    const balancesArray = balances.getAll();
    for (let i = 0; i < balancesArray.length; i++) {
      balancesArray[i] + 1;
    }
  });

  const validators = createValidatorList(length);

  bench("compositeListValue.readonlyValuesArray()", () => {
    validators.getAllReadonly();
  });

  bench("compositeListValue.readonlyValuesArray() + loop all", () => {
    const validatorsArray = validators.getAllReadonly();
    for (let i = 0; i < validatorsArray.length; i++) {
      validatorsArray[i];
    }
  });
});


function createBalanceList(count: number) {
  const VALIDATOR_REGISTRY_LIMIT = 1099511627776;

  const balancesList = new ListBasicType(new UintNumberType(8), VALIDATOR_REGISTRY_LIMIT);
  const balancesStruct = Array.from({length: count}, () => 31217089836);
  return balancesList.toViewDU(balancesStruct);
}


function createValidatorList(count: number) {
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
  return Validators.toViewDU(validatorsStruct);
}
