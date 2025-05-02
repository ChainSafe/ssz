import {bench, describe, setBenchOpts} from "@chainsafe/benchmark";
import {HashComputationGroup, HashComputationLevel, executeHashComputations} from "@chainsafe/persistent-merkle-tree";
import {BitArray, CompositeViewDU, toHexString} from "../../../src/index.ts";
import {BeaconState} from "../../lodestarTypes/altair/sszTypes.ts";
import {preset} from "../../lodestarTypes/params.ts";
const {SLOTS_PER_HISTORICAL_ROOT, EPOCHS_PER_ETH1_VOTING_PERIOD, SLOTS_PER_EPOCH} = preset;

const vc = 200_000;
const numModified = vc / 2;
// every we increase vc, need to change this value from "recursive hash" test
const expectedRoot = "0xb0780ec0d44bff1ae8a351e98e37a9d8c3e28edb38c9d5a6312656e0cba915d9";

/**
 * This simulates a BeaconState being modified after an epoch transition in lodestar
 * The fresh tree batch hash bechmark is in packages/persistent-merkle-tree/test/perf/node.test.ts
 * Note that this benchmark is not very stable because we cannot apply runsFactor as once commit() we
 * cannot compute HashComputationGroup again.
 * Increasing number of validators could be OOM since we have to create BeaconState every time
 */
describe(`BeaconState ViewDU partially modified tree vc=${vc} numModified=${numModified}`, () => {
  setBenchOpts({
    minMs: 20_000,
  });

  const hc = new HashComputationGroup();
  bench({
    id: `BeaconState ViewDU batchHashTreeRoot vc=${vc} mod=${numModified}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      // commit() step is inside hashTreeRoot(), reuse HashComputationGroup
      if (toHexString(state.batchHashTreeRoot(hc)) !== expectedRoot) {
        throw new Error(
          `batchHashTreeRoot ${toHexString(state.batchHashTreeRoot(hc))} does not match expectedRoot ${expectedRoot}`
        );
      }
      state.batchHashTreeRoot(hc);
    },
  });

  bench({
    id: `BeaconState ViewDU batchHashTreeRoot - commit step vc=${vc} mod=${numModified}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit(0, []);
    },
  });

  bench({
    id: `BeaconState ViewDU batchHashTreeRoot - hash step vc=${vc} mod=${numModified}`,
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

  bench({
    id: `BeaconState ViewDU hashTreeRoot() vc=${vc} mod=${numModified}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.hashTreeRoot();
      if (toHexString(state.node.root) !== expectedRoot) {
        throw new Error(`hashTreeRoot ${toHexString(state.node.root)} does not match expectedRoot ${expectedRoot}`);
      }
    },
  });

  bench({
    id: `BeaconState ViewDU hashTreeRoot - commit step vc=${vc} mod=${numModified}`,
    beforeEach: () => createPartiallyModifiedDenebState(),
    fn: (state: CompositeViewDU<typeof BeaconState>) => {
      state.commit();
    },
  });

  bench({
    id: `BeaconState ViewDU hashTreeRoot - validator tree creation vc=${numModified} mod=${numModified}`,
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
  state.slot++;
  state.latestBlockHeader = BeaconState.fields.latestBlockHeader.toViewDU({
    slot: 1000,
    proposerIndex: 1,
    parentRoot: Buffer.alloc(32, 0xac),
    stateRoot: Buffer.alloc(32, 0xed),
    bodyRoot: Buffer.alloc(32, 0x32),
  });
  state.blockRoots.set(0, Buffer.alloc(32, 0x01));
  state.stateRoots.set(0, Buffer.alloc(32, 0x01));
  state.historicalRoots.set(0, Buffer.alloc(32, 0x01));
  for (let i = 0; i < numModified; i++) {
    state.validators.get(i).effectiveBalance += 1e9;
  }
  // all balances are modified as in epoch transition
  state.balances = BeaconState.fields.balances.toViewDU(Array.from({length: vc}, () => 32e9));
  // remaining validators are accessed with no modification
  for (let i = numModified; i < vc; i++) {
    state.validators.get(i);
  }

  state.eth1Data = BeaconState.fields.eth1Data.toViewDU({
    depositRoot: Buffer.alloc(32, 0x02),
    depositCount: 1000,
    blockHash: Buffer.alloc(32, 0x03),
  });
  state.eth1DataVotes.set(0, state.eth1Data);
  state.eth1DepositIndex++;
  state.randaoMixes.set(0, Buffer.alloc(32, 0x02));
  state.slashings.set(0, BigInt(1e9));

  state.justificationBits = BeaconState.fields.justificationBits.toViewDU(
    BitArray.fromBoolArray([true, false, true, true])
  );
  state.previousJustifiedCheckpoint = BeaconState.fields.previousJustifiedCheckpoint.toViewDU({
    epoch: 1000,
    root: Buffer.alloc(32, 0x01),
  });
  state.currentJustifiedCheckpoint = BeaconState.fields.currentJustifiedCheckpoint.toViewDU({
    epoch: 1000,
    root: Buffer.alloc(32, 0x01),
  });
  state.finalizedCheckpoint = BeaconState.fields.finalizedCheckpoint.toViewDU({
    epoch: 1000,
    root: Buffer.alloc(32, 0x01),
  });
  return state;
}

function createDenebState(vc: number): CompositeViewDU<typeof BeaconState> {
  const state = BeaconState.defaultViewDU();
  state.genesisTime = 1e9;
  state.genesisValidatorsRoot = Buffer.alloc(32, 1);
  state.slot = 1_000_000;
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
  state.blockRoots = BeaconState.fields.blockRoots.toViewDU(
    Array.from({length: 1_000_000}, () => Buffer.alloc(32, 0x01))
  );
  state.stateRoots = BeaconState.fields.stateRoots.toViewDU(
    Array.from({length: 1_000_000}, () => Buffer.alloc(32, 0x01))
  );
  state.historicalRoots = BeaconState.fields.historicalRoots.toViewDU(
    Array.from({length: 1_000_000}, () => Buffer.alloc(32, 0x01))
  );
  state.eth1DataVotes = BeaconState.fields.eth1DataVotes.toViewDU(
    Array.from({length: EPOCHS_PER_ETH1_VOTING_PERIOD * SLOTS_PER_EPOCH}, () => {
      return {
        depositRoot: Buffer.alloc(32, 0x04),
        depositCount: 1000,
        blockHash: Buffer.alloc(32, 0x05),
      };
    })
  );
  state.eth1DepositIndex = 1000;
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
  state.randaoMixes = BeaconState.fields.randaoMixes.toViewDU(
    Array.from({length: SLOTS_PER_HISTORICAL_ROOT}, () => Buffer.alloc(32, 0x01))
  );
  // slashings
  state.slashings = BeaconState.fields.slashings.toViewDU(
    Array.from({length: SLOTS_PER_HISTORICAL_ROOT}, () => BigInt(1e9))
  );
  state.previousEpochParticipation = BeaconState.fields.previousEpochParticipation.toViewDU(
    Array.from({length: vc}, () => 7)
  );
  state.currentEpochParticipation = BeaconState.fields.previousEpochParticipation.toViewDU(
    Array.from({length: vc}, () => 7)
  );
  return state;
}
