import {bench, describe} from "@chainsafe/benchmark";
import {Balances, BeaconState, Validators} from "../../lodestarTypes/gloas/sszTypes.ts";
import {Validator} from "../../lodestarTypes/phase0/types.ts";

/** Number of validators in glamsterdam-devnet-8 */
const vc = 85_453;
/** MAX_VALIDATORS_PER_WITHDRAWALS_SWEEP of the mainnet preset */
const sweep = 16_384;

/**
 * Lodestar reads `state.balances.get(i)` for every validator in the withdrawals sweep (processWithdrawals),
 * on a state that is cloned and committed every block.
 */
describe(`gloas BeaconState balances.get() vc=${vc}`, () => {
  const expectedBalance = (i: number): number => 32e9 + (i % 1000) * 1e6;
  const stateBytes = createGloasStateBytes(vc);
  // Like a state loaded by lodestar: deserialized, then balances read once in full which populates the cache
  let state = BeaconState.deserializeToViewDU(stateBytes);
  state.balances.getAll();
  let next = 0;

  bench({
    id: `sweep ${sweep} balances after clone + commit`,
    runsFactor: sweep,
    beforeEach: () => {
      // A withdrawal writes a balance, then the block ends with a commit and the next block clones the state
      state.balances.set(next, expectedBalance(next));
      state.commit();
      state = state.clone();
      return state;
    },
    fn: (blockState) => {
      for (let k = 0; k < sweep; k++) {
        const i = (next + k) % vc;
        if (blockState.balances.get(i) !== expectedBalance(i)) {
          throw Error(`Wrong balance at index ${i}`);
        }
      }
      next = (next + sweep) % vc;
    },
  });

  function createGloasStateBytes(validatorCount: number): Uint8Array {
    const validators: Validator[] = [];
    const balanceValues: number[] = [];
    for (let i = 0; i < validatorCount; i++) {
      validators.push({
        pubkey: Buffer.alloc(48, i % 256),
        withdrawalCredentials: Buffer.alloc(32, 1),
        effectiveBalance: 32e9,
        slashed: false,
        activationEligibilityEpoch: 0,
        activationEpoch: 0,
        exitEpoch: Infinity,
        withdrawableEpoch: Infinity,
      });
      balanceValues.push(expectedBalance(i));
    }

    const state = BeaconState.defaultViewDU();
    state.validators = Validators.toViewDU(validators);
    state.balances = Balances.toViewDU(balanceValues);
    return state.serialize();
  }
});
