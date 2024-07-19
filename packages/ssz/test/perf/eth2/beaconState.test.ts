import {itBench} from "@dapplion/benchmark";
import {HashComputationLevel, executeHashComputations} from "@chainsafe/persistent-merkle-tree";
import {BeaconState} from "../../lodestarTypes/altair/sszTypes";
import {BitArray, CompositeViewDU, toHexString} from "../../../src";

const vc = 200_000;
const numModified = vc / 2;
// every we increase vc, need to change this value from "recursive hash" test
const expectedRoot = "0x0bd3c6caecdf5b04e8ac48e41732aa5908019e072aa4e61c5298cf31a643eb70";

/**
 * This simulates a BeaconState being modified after an epoch transition in lodestar
 * The fresh tree batch hash bechmark is in packages/persistent-merkle-tree/test/perf/node.test.ts
 * Note that this benchmark is not very stable because we cannot apply runsFactor as once commit() we
 * cannot compute HashComputationGroup again.
 * Increasing number of validators could be OOM since we have to create BeaconState every time
 */
describe(`BeaconState ViewDU partially modified tree vc=${vc} numModified=${numModified}`, function () {
  itBench({
    id: `BeaconState ViewDU recursive hash vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit();
      state.node.root;
      // console.log("@@@@ root", toHexString(state.node.root));
      if (toHexString(state.node.root) !== expectedRoot) {
        throw new Error("hashTreeRoot does not match expectedRoot");
      }
    },
  });

  itBench({
    id: `BeaconState ViewDU recursive hash - commit step vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit();
    },
  });

  itBench({
    id: `BeaconState ViewDU validator tree creation vc=${numModified}`,
    beforeEach: () => {
      const state = createPartiallyModifiedDenebState();
      state.commit();
      return state;
    },
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      const validators = state.validators;
      for (let i = 0; i < numModified; i++) {
        validators.getReadonly(i).node.left;
      }
    },
  });

  itBench({
    id: `BeaconState ViewDU hashTreeRoot vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      // commit() step is inside hashTreeRoot()
      if (toHexString(state.hashTreeRoot()) !== expectedRoot) {
        throw new Error("hashTreeRoot does not match expectedRoot");
      }
    },
  });

  itBench({
    id: `BeaconState ViewDU hashTreeRoot - commit step vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit(0, []);
    },
  });

  itBench({
    id: `BeaconState ViewDU hashTreeRoot - hash step vc=${vc}`,
    beforeEach: () => {
      const state = createPartiallyModifiedDenebState();
      const hcByLevel: HashComputationLevel[] = [];
      state.commit(0, hcByLevel);
      return hcByLevel;
    },
    fn: (hcByLevel) => {
      executeHashComputations(hcByLevel);
    },
  });
});

let originalState: CompositeViewDU<typeof BeaconState> | null = null;
function createPartiallyModifiedDenebState(): CompositeViewDU<typeof BeaconState> {
  if (originalState === null) {
    originalState = createDenebState(vc);
    // cache all roots
    // the original state is huge, do not call hashTreeRoot() here
    originalState.commit();
    originalState.node.root;
  }

  const state = originalState.clone();
  for (let i = 0; i < numModified; i++) {
    state.validators.get(i).effectiveBalance += 1e9;
    state.balances.set(i, state.balances.get(i) + 1e9);
  }
  return state;
}

function createDenebState(vc: number): CompositeViewDU<typeof BeaconState> {
  const state = BeaconState.defaultViewDU();
  state.genesisTime = 1e9;
  state.genesisValidatorsRoot = Buffer.alloc(32, 1);
  state.fork = BeaconState.fields.fork.toViewDU({
    epoch: 1000,
    previousVersion: Buffer.alloc(4, 0x03),
    currentVersion: Buffer.alloc(4, 0x04),
  });
  state.latestBlockHeader = BeaconState.fields.latestBlockHeader.toViewDU({
    slot: 1000,
    proposerIndex: 1,
    parentRoot: Buffer.alloc(32, 0xac),
    stateRoot: Buffer.alloc(32, 0xed),
    bodyRoot: Buffer.alloc(32, 0x32),
  });
  const validators = Array.from({length: vc}, () => {
    return {
      pubkey: Buffer.alloc(48, 0xaa),
      withdrawalCredentials: Buffer.alloc(32, 0xbb),
      effectiveBalance: 32e9,
      slashed: false,
      activationEligibilityEpoch: 1_000_000,
      activationEpoch: 2_000_000,
      exitEpoch: 3_000_000,
      withdrawableEpoch: 4_000_000,
    };
  });
  state.validators = BeaconState.fields.validators.toViewDU(validators);
  state.balances = BeaconState.fields.balances.toViewDU(Array.from({length: vc}, () => 32e9));
  // randomMixes
  // slashings
  state.previousEpochParticipation = BeaconState.fields.previousEpochParticipation.toViewDU(
    Array.from({length: vc}, () => 7)
  );
  state.currentEpochParticipation = BeaconState.fields.previousEpochParticipation.toViewDU(
    Array.from({length: vc}, () => 7)
  );
  state.justificationBits = BeaconState.fields.justificationBits.toViewDU(
    BitArray.fromBoolArray([true, false, true, true])
  );
  return state;
}
