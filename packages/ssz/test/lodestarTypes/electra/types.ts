import {ValueOf} from "../../../src/index.ts";
import * as ssz from "./sszTypes.ts";

export type PendingDeposit = ValueOf<typeof ssz.PendingDeposit>;
export type PendingPartialWithdrawal = ValueOf<typeof ssz.PendingPartialWithdrawal>;
export type PendingConsolidation = ValueOf<typeof ssz.PendingConsolidation>;

export type BeaconState = ValueOf<typeof ssz.BeaconState>;
