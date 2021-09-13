/* eslint-disable @typescript-eslint/naming-convention */

import {ssz as phase0} from "../phase0";
import {ssz as altair} from "../altair";
import {ssz as merge} from "../merge";

/**
 * Index the ssz types that differ by fork
 * A record of AllForksSSZTypes indexed by fork
 */
export const allForks = {
  phase0: {
    BeaconBlockBody: phase0.BeaconBlockBody,
    BeaconBlock: phase0.BeaconBlock,
    SignedBeaconBlock: phase0.SignedBeaconBlock,
    BeaconState: phase0.BeaconState,
    Metadata: phase0.Metadata,
  },
  altair: {
    BeaconBlockBody: altair.BeaconBlockBody,
    BeaconBlock: altair.BeaconBlock,
    SignedBeaconBlock: altair.SignedBeaconBlock,
    BeaconState: altair.BeaconState,
    Metadata: altair.Metadata,
  },
  merge: {
    BeaconBlockBody: merge.BeaconBlockBody,
    BeaconBlock: merge.BeaconBlock,
    SignedBeaconBlock: merge.SignedBeaconBlock,
    BeaconState: merge.BeaconState,
    Metadata: altair.Metadata,
  },
};
