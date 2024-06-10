import {itBench} from "@dapplion/benchmark";
import {BranchNode, HashComputationGroup} from "@chainsafe/persistent-merkle-tree";
import {BeaconState} from "../../lodestarTypes/altair/sszTypes";
import {BitArray, CompositeViewDU} from "../../../src";

const vc = 100_000;
const numModified = vc / 2;

/**
 * The fresh tree batch hash bechmark is in packages/persistent-merkle-tree/test/perf/node.test.ts
 */
describe("BeaconState ViewDU partially modified tree", function () {
  itBench({
    id: `BeaconState ViewDU hashTreeRoot vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      // commit() step is inside hashTreeRoot()
      state.hashTreeRoot();
    },
  });

  itBench({
    id: `BeaconState ViewDU batchHash - commit step vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      const hashComps: HashComputationGroup = {
        byLevel: [],
        offset: 0,
      };
      state.commit(hashComps);
    },
  });

  itBench({
    id: `BeaconState ViewDU batchHash - commit step each validator vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      const hashComps: HashComputationGroup = {
        byLevel: [],
        offset: 0,
      };
      for (let i = 0; i < vc / 2; i++) {
        state.validators.get(i).commit(hashComps);
      }
    },
  });

  itBench({
    id: `BeaconState ViewDU batchHash vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit();
      (state.node as BranchNode).batchHash();
    },
  });

  itBench({
    id: `BeaconState ViewDU recursive hash vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit();
      state.node.root;
    },
  });

  itBench({
    id: `BeaconState ViewDU recursive hash - commit step vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit();
    },
  });
});

function createPartiallyModifiedDenebState(): CompositeViewDU<typeof BeaconState> {
  const state = createDenebState(vc);
  // cache all roots
  state.hashTreeRoot();
  // modify half of validators and balances
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
