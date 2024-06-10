import {itBench} from "@dapplion/benchmark";
import {
  BranchNode,
  HashComputationGroup,
  getHashComputations,
  executeHashComputations,
  HashComputation,
} from "@chainsafe/persistent-merkle-tree";
import {BeaconState} from "../../lodestarTypes/altair/sszTypes";
import {BitArray, CompositeViewDU, toHexString} from "../../../src";

const vc = 100_000;
const numModified = vc / 2;
// TODO - batch: should confirm in unit test instead?
const expectedRoot = "0xda08e9e2ce3d77df6d6cb29d744871bff4975365841c3b574534f86be352652b";

/**
 * The fresh tree batch hash bechmark is in packages/persistent-merkle-tree/test/perf/node.test.ts
 */
describe("BeaconState ViewDU partially modified tree", function () {
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
      const hashComps: HashComputationGroup = {
        byLevel: [],
        offset: 0,
      };
      state.commit(hashComps);
    },
  });

  itBench({
    id: `BeaconState ViewDU hashTreeRoot - hash step vc=${vc}`,
    beforeEach: () => {
      const state = createPartiallyModifiedDenebState();
      const hashComps: HashComputationGroup = {
        byLevel: [],
        offset: 0,
      };
      state.commit(hashComps);
      return hashComps;
    },
    fn: (hashComps) => {
      executeHashComputations(hashComps.byLevel);
    },
  });

  itBench.skip({
    id: `BeaconState ViewDU hashTreeRoot - commit step each validator vc=${vc}`,
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
      if (toHexString(state.node.root) !== expectedRoot) {
        throw new Error("hashTreeRoot does not match expectedRoot");
      }
    },
  });

  itBench({
    id: `BeaconState ViewDU batchHash - getHashComputation vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit();
      getHashComputations(state.node, 0, []);
    },
  });

  itBench({
    id: `BeaconState ViewDU batchHash - hash step vc=${vc}`,
    beforeEach: () => {
      const state = createPartiallyModifiedDenebState();
      state.commit();
      const hashComputations: HashComputation[][] = [];
      getHashComputations(state.node, 0, hashComputations);
      return hashComputations;
    },
    fn: (hashComputations: HashComputation[][]) => {
      executeHashComputations(hashComputations);
    },
  });

  itBench({
    id: `BeaconState ViewDU recursive hash vc=${vc}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit();
      state.node.root;
      if (toHexString(state.node.root) !== expectedRoot) {
        throw new Error("hashTreeRoot does not match expectedRoot");
      }
      // console.log("@@@@ root", toHexString(state.node.root));
    },
  });

  itBench.skip({
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
