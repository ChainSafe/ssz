import {ValueOf} from "../../../src/index.ts";
import * as ssz from "./sszTypes.ts";

export type Validators = ValueOf<typeof ssz.Validators>;
export type Balances = ValueOf<typeof ssz.Balances>;
export type EpochParticipation = ValueOf<typeof ssz.EpochParticipation>;
export type InactivityScores = ValueOf<typeof ssz.InactivityScores>;

export type PendingDeposits = ValueOf<typeof ssz.PendingDeposits>;
export type PendingPartialWithdrawals = ValueOf<typeof ssz.PendingPartialWithdrawals>;
export type PendingConsolidations = ValueOf<typeof ssz.PendingConsolidations>;

export type Builder = ValueOf<typeof ssz.Builder>;
export type BuilderPendingWithdrawal = ValueOf<typeof ssz.BuilderPendingWithdrawal>;
export type BuilderPendingPayment = ValueOf<typeof ssz.BuilderPendingPayment>;
export type ExecutionPayloadBid = ValueOf<typeof ssz.ExecutionPayloadBid>;

export type BeaconState = ValueOf<typeof ssz.BeaconState>;
