import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {describe, it} from "vitest";
import {CompositeView, CompositeViewDU, ContainerType, ValueOf} from "../../../src/index.js";
import {allForks, altair, bellatrix, phase0, ssz} from "../../lodestarTypes/index.js";
import {ForkName} from "../../utils/fork.js";

/** False variable to not run code but still compile with Typescript */
const alwaysFalse = 0 < 1;

describe("Eth2 allForks BeaconState, non-cached and cached", () => {
  type BeaconStateCache = {
    config: {someConstant: number};
    epochCtx: {getCache(): number};
  };

  type BeaconStatePhase0 = CompositeViewDU<typeof ssz.phase0.BeaconState>;
  type BeaconStateAltair = CompositeViewDU<typeof ssz.altair.BeaconState>;
  type BeaconStateBellatrix = CompositeViewDU<typeof ssz.bellatrix.BeaconState>;
  type BeaconStateCapella = CompositeViewDU<typeof ssz.capella.BeaconState>;
  type BeaconStateDeneb = CompositeViewDU<typeof ssz.deneb.BeaconState>;

  // Union at the TreeViewDU level
  // Equivalent to CompositeViewDU<allForks.AllForksSSZTypes["BeaconState"]>
  type BeaconStateAllForks =
    | BeaconStatePhase0
    | BeaconStateAltair
    | BeaconStateBellatrix
    | BeaconStateCapella
    | BeaconStateDeneb;

  // Union at the fields level
  // NOTE: using this type for CachedBeaconStateAllForks makes single fork BeaconState types incompatible to it
  //
  // The difference is that the union is happening at the fields level, which create a weird type unmatchable with others
  // Instead, do a union of the types themselves which allow matching with any of the single fork types and AnyForks
  type BeaconStateAllForkFields = CompositeViewDU<
    ContainerType<
      | typeof ssz.phase0.BeaconState.fields
      | typeof ssz.altair.BeaconState.fields
      | typeof ssz.bellatrix.BeaconState.fields
    >
  >;

  type CachedBeaconStatePhase0 = BeaconStatePhase0 & BeaconStateCache;
  type CachedBeaconStateAltair = BeaconStateAltair & BeaconStateCache;
  type CachedBeaconStateBellatrix = BeaconStateBellatrix & BeaconStateCache;
  type CachedBeaconStateAllForks = BeaconStateAllForks & BeaconStateCache;

  /** Kept to demo that this type doesn't work */
  type SSZTypesAllForkFields = ContainerType<
    | typeof ssz.phase0.BeaconState.fields
    | typeof ssz.altair.BeaconState.fields
    | typeof ssz.bellatrix.BeaconState.fields
  >;

  // Requirements for AllForks types
  // - Generic arguments for functions
  // - Non-generic arguments for functions
  // - Getting types with slot, then calling deserialize + serialize
  //
  // For CachedAllForks types
  // - Generic arguments for functions
  // - Non-generic arguments for functions
  // - Getting types with slot, then calling deserialize + serialize

  const beaconStatePhase0 = ssz.phase0.BeaconState.defaultViewDU();
  const beaconStateAltair = ssz.altair.BeaconState.defaultViewDU();
  const beaconStateBellatrix = ssz.bellatrix.BeaconState.defaultViewDU();
  const beaconStateAllForks = beaconStatePhase0 as BeaconStateAllForks;

  const cachedBeaconStatePhase0 = getCachedBeaconState(beaconStatePhase0);
  const cachedBeaconStateAltair = getCachedBeaconState(beaconStateAltair);
  const cachedBeaconStateBellatrix = getCachedBeaconState(beaconStateBellatrix);
  const cachedBeaconStateAllForks = cachedBeaconStatePhase0 as CachedBeaconStateAllForks;

  function getCachedBeaconState<T>(state: T): T & BeaconStateCache {
    return state as T & BeaconStateCache;
  }

  function genericArgBeaconStateAllForks<T extends BeaconStateAllForks>(state: T): void {
    // Access properties from all forks without casting
    state.slot;
    // Access fork properties by casting
    (state as BeaconStatePhase0).currentEpochAttestations;
    (state as BeaconStateAltair).currentSyncCommittee;
    (state as BeaconStateBellatrix).latestExecutionPayloadHeader;
  }

  function nonGenericArgBeaconStateAllForks(state: BeaconStateAllForks): void {
    // Access properties from all forks without casting
    state.slot;
    // Access fork properties by casting
    (state as BeaconStatePhase0).currentEpochAttestations;
    (state as BeaconStateAltair).currentSyncCommittee;
    (state as BeaconStateBellatrix).latestExecutionPayloadHeader;
  }

  // CachedBeaconState

  function genericArgCachedBeaconStateAllForks<T extends CachedBeaconStateAllForks>(state: T): void {
    // Access properties from all forks without casting
    state.slot;
    // Access fork properties by casting
    (state as CachedBeaconStatePhase0).currentEpochAttestations;
    (state as CachedBeaconStateAltair).currentSyncCommittee;
    (state as CachedBeaconStateBellatrix).latestExecutionPayloadHeader;
  }

  function nonGenericArgCachedBeaconStateAllForks(state: CachedBeaconStateAllForks): void {
    // Access properties from all forks without casting
    state.slot;
    // Access fork properties by casting
    (state as CachedBeaconStatePhase0).currentEpochAttestations;
    (state as CachedBeaconStateAltair).currentSyncCommittee;
    (state as CachedBeaconStateBellatrix).latestExecutionPayloadHeader;
  }

  // BeaconStateAllForkFields

  function nonGenericArgBeaconStateAllForkFields(state: BeaconStateAllForkFields): void {
    // Access properties from all forks without casting
    state.slot;
    // Access fork properties by casting
    (state as BeaconStatePhase0).currentEpochAttestations;
    (state as BeaconStateAltair).currentSyncCommittee;
    (state as BeaconStateBellatrix).latestExecutionPayloadHeader;
  }

  function getForkTypeAllForks(forkName: ForkName): allForks.AllForksSSZTypes["BeaconState"] {
    return ssz.allForks[forkName].BeaconState as allForks.AllForksSSZTypes["BeaconState"];
  }

  function getForkTypeAllForkFields(forkName: ForkName): SSZTypesAllForkFields {
    return ssz.allForks[forkName].BeaconState as SSZTypesAllForkFields;
  }

  it("AllForks - Generic arguments for functions", () => {
    genericArgBeaconStateAllForks(beaconStatePhase0);
    genericArgBeaconStateAllForks(beaconStateAltair);
    genericArgBeaconStateAllForks(beaconStateBellatrix);
    genericArgBeaconStateAllForks(beaconStateAllForks);
  });

  it("AllForks - Non-generic arguments for functions", () => {
    nonGenericArgBeaconStateAllForks(beaconStatePhase0);
    nonGenericArgBeaconStateAllForks(beaconStateAltair);
    nonGenericArgBeaconStateAllForks(beaconStateBellatrix);
    nonGenericArgBeaconStateAllForks(beaconStateAllForks);
  });

  it("AllForks - CachedBeaconState - Generic arguments for functions", () => {
    genericArgCachedBeaconStateAllForks(cachedBeaconStatePhase0);
    genericArgCachedBeaconStateAllForks(cachedBeaconStateAltair);
    genericArgCachedBeaconStateAllForks(cachedBeaconStateBellatrix);
    genericArgCachedBeaconStateAllForks(cachedBeaconStateAllForks);
  });

  it("AllForks - CachedBeaconState - Non-generic arguments for functions", () => {
    nonGenericArgCachedBeaconStateAllForks(cachedBeaconStatePhase0);
    nonGenericArgCachedBeaconStateAllForks(cachedBeaconStateAltair);
    nonGenericArgCachedBeaconStateAllForks(cachedBeaconStateBellatrix);
    nonGenericArgCachedBeaconStateAllForks(cachedBeaconStateAllForks);
  });

  it("AllForks - CachedBeaconState as BeaconState arg - Generic arguments for functions", () => {
    genericArgBeaconStateAllForks(cachedBeaconStatePhase0);
    genericArgBeaconStateAllForks(cachedBeaconStateAltair);
    genericArgBeaconStateAllForks(cachedBeaconStateBellatrix);
    genericArgBeaconStateAllForks(cachedBeaconStateAllForks);
  });

  it("AllForks - CachedBeaconState as BeaconState arg - Non-generic arguments for functions", () => {
    nonGenericArgBeaconStateAllForks(cachedBeaconStatePhase0);
    nonGenericArgBeaconStateAllForks(cachedBeaconStateAltair);
    nonGenericArgBeaconStateAllForks(cachedBeaconStateBellatrix);
    nonGenericArgBeaconStateAllForks(cachedBeaconStateAllForks);
  });

  it("AllForks - Getting type with slot", () => {
    const state = getForkTypeAllForks(ForkName.phase0).defaultViewDU();

    // @ts-expect-error state AnyFork has no specific fork property
    state.currentEpochAttestations;
    // @ts-expect-error state AnyFork has no specific fork property
    state.currentSyncCommittee;
    // @ts-expect-error state AnyFork has no specific fork property
    state.latestExecutionPayloadHeader;

    // Access properties from all forks without casting
    state.slot;
    // Access fork properties by casting
    (state as BeaconStatePhase0).currentEpochAttestations;
    (state as BeaconStateAltair).currentSyncCommittee;
    (state as BeaconStateBellatrix).latestExecutionPayloadHeader;

    genericArgBeaconStateAllForks(state);
    nonGenericArgBeaconStateAllForks(state);
  });

  it("AllForks - serialize with a generic type", () => {
    getForkTypeAllForks(ForkName.phase0).serialize(ssz.phase0.BeaconState.defaultValue());
    getForkTypeAllForks(ForkName.altair).serialize(ssz.altair.BeaconState.defaultValue());
    getForkTypeAllForks(ForkName.bellatrix).serialize(ssz.bellatrix.BeaconState.defaultValue());

    // getForkTypesAnyFork() requires an non-existent type that has the fields from all forks merged
    getForkTypeAllForks(ForkName.bellatrix).serialize({
      genesisTime: 0,
      genesisValidatorsRoot: ssz.Root.defaultValue(),
      slot: 0,
      fork: ssz.phase0.Fork.defaultValue(),
      // History
      latestBlockHeader: ssz.phase0.BeaconBlockHeader.defaultValue(),
      blockRoots: ssz.phase0.HistoricalBlockRoots.defaultValue(),
      stateRoots: ssz.phase0.HistoricalStateRoots.defaultValue(),
      historicalRoots: [],
      // Eth1
      eth1Data: ssz.phase0.Eth1Data.defaultValue(),
      eth1DataVotes: [],
      eth1DepositIndex: 0,
      // Registry
      validators: [],
      balances: [],
      randaoMixes: ssz.phase0.RandaoMixes.defaultValue(),
      // Slashings
      slashings: ssz.phase0.Slashings.defaultValue(),
      // Attestations
      previousEpochAttestations: [],
      currentEpochAttestations: [],
      // Finality
      justificationBits: ssz.phase0.JustificationBits.defaultValue(),
      previousJustifiedCheckpoint: ssz.phase0.Checkpoint.defaultValue(),
      currentJustifiedCheckpoint: ssz.phase0.Checkpoint.defaultValue(),
      finalizedCheckpoint: ssz.phase0.Checkpoint.defaultValue(),

      // altair fork
      previousEpochParticipation: [],
      currentEpochParticipation: [],
      inactivityScores: [],
      currentSyncCommittee: ssz.altair.SyncCommittee.defaultValue(),
      nextSyncCommittee: ssz.altair.SyncCommittee.defaultValue(),

      // bellatrix fork
      latestExecutionPayloadHeader: ssz.bellatrix.ExecutionPayloadHeader.defaultValue(),
    });
  });

  it("AllForkFields - doesn't work well", () => {
    // @ts-expect-error BeaconStateAllForkFields doesn't accept any state
    nonGenericArgBeaconStateAllForkFields(beaconStatePhase0);
    // @ts-expect-error BeaconStateAllForkFields doesn't accept any state
    nonGenericArgBeaconStateAllForkFields(beaconStateAltair);
    // @ts-expect-error BeaconStateAllForkFields doesn't accept any state
    nonGenericArgBeaconStateAllForkFields(beaconStateBellatrix);
    // @ts-expect-error BeaconStateAllForkFields doesn't accept any state
    nonGenericArgBeaconStateAllForkFields(beaconStateAllForks);

    const beaconStateAnyForksByFields = beaconStatePhase0 as BeaconStateAllForkFields;
    // @ts-expect-error BeaconStateAllForkFields is not accepted by any other generic type
    genericArgBeaconStateAllForks(beaconStateAnyForksByFields);
    // @ts-expect-error BeaconStateAllForkFields is not accepted by any other generic type
    nonGenericArgBeaconStateAllForks(beaconStateAnyForksByFields);
  });

  it("AllForkFields - Getting type with slot", () => {
    const state = getForkTypeAllForkFields(ForkName.phase0).defaultViewDU();

    // @ts-expect-error state AllForks has no specific fork property
    state.currentEpochAttestations;
    // @ts-expect-error state AllForks has no specific fork property
    state.currentSyncCommittee;
    // @ts-expect-error state AllForks has no specific fork property
    state.latestExecutionPayloadHeader;

    // Access properties from all forks without casting
    state.slot;
    // Access fork properties by casting
    (state as BeaconStatePhase0).currentEpochAttestations;
    (state as BeaconStateAltair).currentSyncCommittee;
    (state as BeaconStateBellatrix).latestExecutionPayloadHeader;

    // @ts-expect-error getForkTypesAllForks() returns the intersected type of all forks
    genericArgBeaconStateAllForks(state);
    // @ts-expect-error getForkTypesAllForks() returns the intersected type of all forks
    nonGenericArgBeaconStateAllForks(state);
  });

  it("AllForkFields - serialize with a generic type", () => {
    getForkTypeAllForkFields(ForkName.phase0).serialize(ssz.phase0.BeaconState.defaultValue());
    getForkTypeAllForkFields(ForkName.altair).serialize(ssz.altair.BeaconState.defaultValue());
    getForkTypeAllForkFields(ForkName.bellatrix).serialize(ssz.bellatrix.BeaconState.defaultValue());

    // getForkTypesAnyFork() requires an non-existent type that has the fields from all forks merged
    if (alwaysFalse) return;
    getForkTypeAllForkFields(ForkName.phase0).serialize({
      genesisTime: 0,
      genesisValidatorsRoot: ssz.Root.defaultValue(),
      slot: 0,
      fork: ssz.phase0.Fork.defaultValue(),
      latestBlockHeader: ssz.phase0.BeaconBlockHeader.defaultValue(),
      blockRoots: [],
      stateRoots: [],
      historicalRoots: [],
      eth1Data: ssz.phase0.Eth1Data.defaultValue(),
      eth1DataVotes: [],
      eth1DepositIndex: 0,
      validators: [],
      balances: [],
      randaoMixes: [],
      slashings: [],

      // WTF For some reasong this phase0 properties are required, however it can serialize a bellatrix without 'latestExecutionPayloadHeader'
      previousEpochAttestations: [],
      currentEpochAttestations: [],

      justificationBits: ssz.phase0.JustificationBits.defaultValue(),
      previousJustifiedCheckpoint: ssz.phase0.Checkpoint.defaultValue(),
      currentJustifiedCheckpoint: ssz.phase0.Checkpoint.defaultValue(),
      finalizedCheckpoint: ssz.phase0.Checkpoint.defaultValue(),
    });
  });

  it("AllForksMashup", () => {
    if (alwaysFalse) return;

    const json = null as unknown;
    const tree = null as unknown as Tree;
    const node = null as unknown as Node;
    const bytes = null as unknown as Uint8Array;
    const value = null as unknown as phase0.BeaconState;
    const view = null as unknown as CompositeView<typeof ssz.phase0.BeaconState>;
    const viewDU = null as unknown as CompositeViewDU<typeof ssz.phase0.BeaconState>;

    const typeMashup = null as unknown as allForks.AllForksSSZTypes["BeaconState"];
    typeMashup.serialize(ssz.phase0.BeaconState.defaultValue());

    typeMashup.serialize(beaconStateAllForks.toValue());

    // Return Value
    assertValue(typeMashup.defaultValue());
    assertValue(typeMashup.tree_toValue(node));
    assertValue(typeMashup.deserialize(bytes));
    assertValue(typeMashup.fromJson(json));
    assertValue(typeMashup.clone(value));
    assertValue(typeMashup.toValueFromView(view));
    assertValue(typeMashup.toValueFromViewDU(viewDU));

    // Arg Value
    typeMashup.serialize(value);
    typeMashup.hashTreeRoot(value);
    typeMashup.toJson(value);
    typeMashup.clone(value);
    typeMashup.equals(value, value);
    typeMashup.toView(value);
    typeMashup.toViewDU(value);

    // Return View
    assertView(typeMashup.defaultView());
    assertView(typeMashup.getView(tree));
    assertView(typeMashup.deserializeToView(bytes));
    assertView(typeMashup.toView(value));
    assertView(typeMashup.toViewFromViewDU(viewDU));
    assertViewDU(typeMashup.defaultViewDU());
    assertViewDU(typeMashup.getViewDU(node));
    assertViewDU(typeMashup.deserializeToViewDU(bytes));
    assertViewDU(typeMashup.toViewDU(value));
    assertViewDU(typeMashup.toViewDUFromView(view));

    // Arg View
    typeMashup.commitView(view);
    typeMashup.commitViewDU(viewDU);
    typeMashup.cacheOfViewDU(viewDU);
    typeMashup.toValueFromView(view);
    typeMashup.toValueFromViewDU(viewDU);
    typeMashup.toViewDUFromView(view);
    typeMashup.toViewFromViewDU(viewDU);

    genericArgBeaconStateAllForks(typeMashup.defaultViewDU());
    genericArgCachedBeaconStateAllForks(getCachedBeaconState(typeMashup.defaultViewDU()));
    genericArgBeaconStateAllForks(getCachedBeaconState(typeMashup.defaultViewDU()));

    function assertValue(_state: phase0.BeaconState | altair.BeaconState | bellatrix.BeaconState): void {
      _state;
    }
    function assertView(
      _state:
        | CompositeView<typeof ssz.phase0.BeaconState>
        | CompositeView<typeof ssz.altair.BeaconState>
        | CompositeView<typeof ssz.bellatrix.BeaconState>
        | CompositeView<typeof ssz.capella.BeaconState>
        | CompositeView<typeof ssz.deneb.BeaconState>
    ): void {
      _state;
    }
    function assertViewDU(
      _state:
        | CompositeViewDU<typeof ssz.phase0.BeaconState>
        | CompositeViewDU<typeof ssz.altair.BeaconState>
        | CompositeViewDU<typeof ssz.bellatrix.BeaconState>
        | CompositeViewDU<typeof ssz.capella.BeaconState>
        | CompositeViewDU<typeof ssz.deneb.BeaconState>
    ): void {
      _state;
    }
  });
});

describe("Eth2 allForks block", () => {
  // ANY = UNION - ALL = INTERSECTION
  type BeaconBlockPhase0 = ValueOf<typeof ssz.phase0.BeaconBlock>;
  type BeaconBlockAltair = ValueOf<typeof ssz.altair.BeaconBlock>;
  type BeaconBlockBellatrix = ValueOf<typeof ssz.bellatrix.BeaconBlock>;
  type BeaconBlockAllForks = BeaconBlockPhase0 | BeaconBlockAltair | BeaconBlockBellatrix;

  /** Kept to demo that this type doesn't work */
  type SSZTypesAllForkFields = ContainerType<
    | typeof ssz.phase0.BeaconBlock.fields
    | typeof ssz.altair.BeaconBlock.fields
    | typeof ssz.bellatrix.BeaconBlock.fields
  >;

  const beaconBlockPhase0 = ssz.phase0.BeaconBlock.defaultValue();
  const beaconBlockAltair = ssz.altair.BeaconBlock.defaultValue();
  const beaconBlockBellatrix = ssz.bellatrix.BeaconBlock.defaultValue();
  const beaconBlockAllForks = beaconBlockPhase0 as BeaconBlockAllForks;

  function nonGenericArgBeaconBlockAllForks(block: BeaconBlockAllForks): void {
    // Access properties from all forks without casting
    block.slot;
    // Access fork properties by casting
    (block as BeaconBlockAltair).body.syncAggregate;
    (block as BeaconBlockBellatrix).body.executionPayload;
  }

  function getForkTypesAllForks(forkName: ForkName): allForks.AllForksSSZTypes["BeaconBlock"] {
    return ssz.allForks[forkName].BeaconBlock as allForks.AllForksSSZTypes["BeaconBlock"];
  }

  function getForkTypesAllForkFields(forkName: ForkName): SSZTypesAllForkFields {
    return ssz.allForks[forkName].BeaconBlock as SSZTypesAllForkFields;
  }

  it("AllForks - Generic arguments for functions", () => {
    nonGenericArgBeaconBlockAllForks(beaconBlockPhase0);
    nonGenericArgBeaconBlockAllForks(beaconBlockAltair);
    nonGenericArgBeaconBlockAllForks(beaconBlockBellatrix);
    nonGenericArgBeaconBlockAllForks(beaconBlockAllForks);
  });

  it("AllForks - Getting type with slot", () => {
    const block = getForkTypesAllForks(ForkName.phase0).defaultValue();

    // @ts-expect-error state AnyFork has no specific fork property
    block.body.syncAggregate;
    // @ts-expect-error state AnyFork has no specific fork property
    block.body.executionPayload;

    // Access properties from all forks without casting
    block.slot;
    // Access fork properties by casting
    (block as BeaconBlockAltair).body.syncAggregate;
    (block as BeaconBlockBellatrix).body.executionPayload;

    nonGenericArgBeaconBlockAllForks(block);
  });

  it("AllForks - serialize with a generic type", () => {
    getForkTypesAllForks(ForkName.phase0).serialize(ssz.phase0.BeaconBlock.defaultValue());
    getForkTypesAllForks(ForkName.altair).serialize(ssz.altair.BeaconBlock.defaultValue());
    getForkTypesAllForks(ForkName.bellatrix).serialize(ssz.bellatrix.BeaconBlock.defaultValue());
  });

  it("AllForkFields - Getting type with slot", () => {
    const block = getForkTypesAllForkFields(ForkName.phase0).defaultValue();

    // @ts-expect-error state AnyFork has no specific fork property
    block.body.syncAggregate;
    // @ts-expect-error state AnyFork has no specific fork property
    block.body.executionPayload;

    // Access properties from all forks without casting
    block.slot;
    // Access fork properties by casting
    (block as BeaconBlockAltair).body.syncAggregate;
    (block as BeaconBlockBellatrix).body.executionPayload;

    nonGenericArgBeaconBlockAllForks(block);
  });

  it("AllForkFields - serialize with a generic type", () => {
    getForkTypesAllForkFields(ForkName.phase0).serialize(ssz.phase0.BeaconBlock.defaultValue());
    getForkTypesAllForkFields(ForkName.altair).serialize(ssz.altair.BeaconBlock.defaultValue());
    getForkTypesAllForkFields(ForkName.bellatrix).serialize(ssz.bellatrix.BeaconBlock.defaultValue());

    // getForkTypesAllForkFields() requires a type that has an optional union of all fork types
    // A block of an imaginary fork where only bellatrix is on is accepted too
    if (alwaysFalse) return;
    getForkTypesAllForkFields(ForkName.bellatrix).serialize({
      slot: 0,
      proposerIndex: 0,
      parentRoot: ssz.Root.defaultValue(),
      stateRoot: ssz.Root.defaultValue(),
      body: {
        randaoReveal: ssz.BLSSignature.defaultValue(),
        eth1Data: ssz.phase0.Eth1Data.defaultValue(),
        graffiti: ssz.Root.defaultValue(),
        proposerSlashings: [],
        attesterSlashings: [],
        attestations: [],
        deposits: [],
        voluntaryExits: [],
        executionPayload: ssz.bellatrix.ExecutionPayload.defaultValue(),
      },
    });
  });
});
