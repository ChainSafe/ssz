import {describe, expect, it} from "vitest";
import {BitArray, fromHexString} from "../../../src/index.js";
import {ListUintNum64Type} from "../../../src/type/listUintNum64.js";
import {BeaconState} from "../../lodestarTypes/deneb/sszTypes.js";
import {altair, phase0, ssz} from "../../lodestarTypes/index.js";

const VALIDATOR_REGISTRY_LIMIT = 1099511627776;
const Balances = new ListUintNum64Type(VALIDATOR_REGISTRY_LIMIT);

describe("BeaconState ViewDU batchHashTreeRoot", function () {
  const view = BeaconState.defaultView();
  const viewDU = BeaconState.defaultViewDU();

  it("BeaconState ViewDU should have same hashTreeRoot() to View", () => {
    // genesisTime
    viewDU.genesisTime = view.genesisTime = 1e9;
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // genesisValidatorsRoot
    viewDU.genesisValidatorsRoot = view.genesisValidatorsRoot = Buffer.alloc(32, 1);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // fork
    const fork: phase0.Fork = {
      epoch: 1000,
      previousVersion: fromHexString("0x03001020"),
      currentVersion: fromHexString("0x04001020"),
    };
    view.fork = BeaconState.fields.fork.toView(fork);
    viewDU.fork = BeaconState.fields.fork.toViewDU(fork);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // latestBlockHeader
    const latestBlockHeader: phase0.BeaconBlockHeader = {
      slot: 1000,
      proposerIndex: 1,
      parentRoot: fromHexString("0xac80c66f413218e2c9c7bcb2408ccdceacf3bcd7e7df58474e0c6aa9d7f328a0"),
      stateRoot: fromHexString("0xed29eed3dbee72caf3b13df84d01ebda1482dbd0ce084e1ce8862b4acb740ed8"),
      bodyRoot: fromHexString("0x32c644ca1b5d1583d445e9d41c81b3e98465fefad4f0db16084cbce7f1b7b849"),
    };
    view.latestBlockHeader = BeaconState.fields.latestBlockHeader.toView(latestBlockHeader);
    viewDU.latestBlockHeader = BeaconState.fields.latestBlockHeader.toViewDU(latestBlockHeader);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // blockRoots
    const blockRoots = ssz.phase0.HistoricalBlockRoots.defaultValue();
    blockRoots[0] = fromHexString("0x1234");
    view.blockRoots = ssz.phase0.HistoricalBlockRoots.toView(blockRoots);
    viewDU.blockRoots = ssz.phase0.HistoricalBlockRoots.toViewDU(blockRoots);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // stateRoots
    const stateRoots = ssz.phase0.HistoricalStateRoots.defaultValue();
    stateRoots[0] = fromHexString("0x5678");
    view.stateRoots = ssz.phase0.HistoricalStateRoots.toView(stateRoots);
    viewDU.stateRoots = ssz.phase0.HistoricalStateRoots.toViewDU(stateRoots);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // historical_roots Frozen in Capella, replaced by historical_summaries
    // Eth1
    const eth1Data: phase0.Eth1Data = {
      depositRoot: fromHexString("0x1234"),
      depositCount: 1000,
      blockHash: fromHexString("0x5678"),
    };
    view.eth1Data = BeaconState.fields.eth1Data.toView(eth1Data);
    viewDU.eth1Data = BeaconState.fields.eth1Data.toViewDU(eth1Data);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // Eth1DataVotes
    const eth1DataVotes = ssz.phase0.Eth1DataVotes.defaultValue();
    eth1DataVotes[0] = eth1Data;
    view.eth1DataVotes = ssz.phase0.Eth1DataVotes.toView(eth1DataVotes);
    viewDU.eth1DataVotes = ssz.phase0.Eth1DataVotes.toViewDU(eth1DataVotes);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // Eth1DepositIndex
    view.eth1DepositIndex = 1000;
    viewDU.eth1DepositIndex = 1000;
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // validators
    const validator = {
      pubkey: Buffer.alloc(48, 0xaa),
      withdrawalCredentials: Buffer.alloc(32, 0xbb),
      effectiveBalance: 32e9,
      slashed: false,
      activationEligibilityEpoch: 1_000_000,
      activationEpoch: 2_000_000,
      exitEpoch: 3_000_000,
      withdrawableEpoch: 4_000_000,
    };
    view.validators = BeaconState.fields.validators.toView([validator]);
    viewDU.validators = BeaconState.fields.validators.toViewDU([validator]);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // balances
    view.balances = BeaconState.fields.balances.toView([1000, 2000, 3000]);
    viewDU.balances = Balances.toViewDU([1000, 2000, 3000]);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // randaoMixes
    const randaoMixes = ssz.phase0.RandaoMixes.defaultValue();
    randaoMixes[0] = fromHexString("0x1234");
    view.randaoMixes = ssz.phase0.RandaoMixes.toView(randaoMixes);
    viewDU.randaoMixes = ssz.phase0.RandaoMixes.toViewDU(randaoMixes);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // slashings
    view.slashings = BeaconState.fields.slashings.toView(Array.from({length: 64}, () => BigInt(1000)));
    viewDU.slashings = BeaconState.fields.slashings.toViewDU(Array.from({length: 64}, () => BigInt(1000)));
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // previousEpochAttestations
    view.previousEpochParticipation = BeaconState.fields.previousEpochParticipation.toView([1, 2, 3]);
    viewDU.previousEpochParticipation = BeaconState.fields.previousEpochParticipation.toViewDU([1, 2, 3]);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // currentEpochAttestations
    view.currentEpochParticipation = BeaconState.fields.currentEpochParticipation.toView([1, 2, 3]);
    viewDU.currentEpochParticipation = BeaconState.fields.currentEpochParticipation.toViewDU([1, 2, 3]);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // justificationBits
    view.justificationBits = BeaconState.fields.justificationBits.toView(
      BitArray.fromBoolArray([true, false, true, true])
    );
    viewDU.justificationBits = BeaconState.fields.justificationBits.toViewDU(
      BitArray.fromBoolArray([true, false, true, true])
    );
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // previousJustifiedCheckpoint
    const checkpoint: phase0.Checkpoint = {
      epoch: 1000,
      root: fromHexString("0x1234"),
    };
    view.previousJustifiedCheckpoint = BeaconState.fields.previousJustifiedCheckpoint.toView(checkpoint);
    viewDU.previousJustifiedCheckpoint = BeaconState.fields.previousJustifiedCheckpoint.toViewDU(checkpoint);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // currentJustifiedCheckpoint
    view.currentJustifiedCheckpoint = BeaconState.fields.currentJustifiedCheckpoint.toView(checkpoint);
    viewDU.currentJustifiedCheckpoint = BeaconState.fields.currentJustifiedCheckpoint.toViewDU(checkpoint);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // finalizedCheckpoint
    view.finalizedCheckpoint = BeaconState.fields.finalizedCheckpoint.toView(checkpoint);
    viewDU.finalizedCheckpoint = BeaconState.fields.finalizedCheckpoint.toViewDU(checkpoint);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // inactivityScores
    view.inactivityScores = BeaconState.fields.inactivityScores.toView([1, 2, 3]);
    viewDU.inactivityScores = BeaconState.fields.inactivityScores.toViewDU([1, 2, 3]);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // currentSyncCommittee
    const syncCommittee: altair.SyncCommittee = {
      pubkeys: Array.from({length: 32}, () => Buffer.alloc(48, 0xaa)),
      aggregatePubkey: fromHexString("0x1234"),
    };
    view.currentSyncCommittee = BeaconState.fields.currentSyncCommittee.toView(syncCommittee);
    viewDU.currentSyncCommittee = BeaconState.fields.currentSyncCommittee.toViewDU(syncCommittee);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // nextSyncCommittee
    view.nextSyncCommittee = BeaconState.fields.nextSyncCommittee.toView(syncCommittee);
    viewDU.nextSyncCommittee = BeaconState.fields.nextSyncCommittee.toViewDU(syncCommittee);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // latestExecutionPayloadHeader
    const latestExecutionPayloadHeader = BeaconState.fields.latestExecutionPayloadHeader.defaultValue();
    latestExecutionPayloadHeader.blockNumber = 1000;
    latestExecutionPayloadHeader.parentHash = fromHexString(
      "0xac80c66f413218e2c9c7bcb2408ccdceacf3bcd7e7df58474e0c6aa9d7f328a0"
    );
    view.latestExecutionPayloadHeader =
      BeaconState.fields.latestExecutionPayloadHeader.toView(latestExecutionPayloadHeader);
    viewDU.latestExecutionPayloadHeader =
      BeaconState.fields.latestExecutionPayloadHeader.toViewDU(latestExecutionPayloadHeader);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // nextWithdrawalIndex
    viewDU.nextWithdrawalIndex = view.nextWithdrawalIndex = 1000;
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // nextWithdrawalValidatorIndex
    viewDU.nextWithdrawalValidatorIndex = view.nextWithdrawalValidatorIndex = 1000;
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());

    // historicalSummaries
    const historicalSummaries = {
      blockSummaryRoot: fromHexString("0xac80c66f413218e2c9c7bcb2408ccdceacf3bcd7e7df58474e0c6aa9d7f328a0"),
      stateSummaryRoot: fromHexString("0x32c644ca1b5d1583d445e9d41c81b3e98465fefad4f0db16084cbce7f1b7b849"),
    };
    view.historicalSummaries = BeaconState.fields.historicalSummaries.toView([historicalSummaries]);
    viewDU.historicalSummaries = BeaconState.fields.historicalSummaries.toViewDU([historicalSummaries]);
    expect(viewDU.batchHashTreeRoot()).toEqual(view.hashTreeRoot());
  });
});
