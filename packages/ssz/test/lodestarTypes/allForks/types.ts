import {ts as phase0} from "../phase0";
import {ts as altair} from "../altair";
import {ts as merge} from "../merge";
import {ssz as phase0Ssz} from "../phase0";
import {ssz as altairSsz} from "../altair";
import {ssz as mergeSsz} from "../merge";

// Re-export union types for types that are _known_ to differ

export type BeaconBlockBody = phase0.BeaconBlockBody | altair.BeaconBlockBody | merge.BeaconBlockBody;
export type BeaconBlock = phase0.BeaconBlock | altair.BeaconBlock | merge.BeaconBlock;
export type SignedBeaconBlock = phase0.SignedBeaconBlock | altair.SignedBeaconBlock | merge.SignedBeaconBlock;
export type BeaconState = phase0.BeaconState | altair.BeaconState | merge.BeaconState;
export type Metadata = phase0.Metadata | altair.Metadata;

/**
 * Types known to change between forks
 */
export type AllForksTypes = {
  BeaconBlockBody: BeaconBlockBody;
  BeaconBlock: BeaconBlock;
  SignedBeaconBlock: SignedBeaconBlock;
  BeaconState: BeaconState;
  Metadata: Metadata;
};

/**
 * SSZ Types known to change between forks
 */
export type AllForksSSZTypes = {
  BeaconBlockBody:
    | typeof phase0Ssz.BeaconBlockBody
    | typeof altairSsz.BeaconBlockBody
    | typeof mergeSsz.BeaconBlockBody;
  BeaconBlock: typeof phase0Ssz.BeaconBlock | typeof altairSsz.BeaconBlock | typeof mergeSsz.BeaconBlock;
  SignedBeaconBlock:
    | typeof phase0Ssz.SignedBeaconBlock
    | typeof altairSsz.SignedBeaconBlock
    | typeof mergeSsz.SignedBeaconBlock;
  BeaconState: typeof phase0Ssz.BeaconState | typeof altairSsz.BeaconState | typeof mergeSsz.BeaconState;
  Metadata: typeof phase0Ssz.Metadata | typeof altairSsz.Metadata;
};
