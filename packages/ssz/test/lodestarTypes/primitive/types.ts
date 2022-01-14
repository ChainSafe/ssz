import {ValueOf} from "../../../src";
import * as ssz from "./sszTypes";

// Each type exported here contains both a compile-time type
// (a typescript interface) and a run-time ssz type (a javascript variable)
// For more information, see ./index.ts

export type Bytes4 = ValueOf<typeof ssz.Bytes4>;
export type Bytes8 = ValueOf<typeof ssz.Bytes8>;
export type Bytes20 = ValueOf<typeof ssz.Bytes20>;
export type Bytes32 = ValueOf<typeof ssz.Bytes32>;
export type Bytes48 = ValueOf<typeof ssz.Bytes48>;
export type Bytes96 = ValueOf<typeof ssz.Bytes96>;
export type Uint8 = ValueOf<typeof ssz.Uint8>;
export type Uint16 = ValueOf<typeof ssz.Uint16>;
export type Uint32 = ValueOf<typeof ssz.Uint32>;
export type Number64 = ValueOf<typeof ssz.UintNumber64>;
export type Uint64 = ValueOf<typeof ssz.UintBigint64>;
export type Uint128 = ValueOf<typeof ssz.Uint128>;
export type Uint256 = ValueOf<typeof ssz.Uint256>;

// Custom types, defined for type hinting and readability

export type Slot = Number64;
export type Epoch = Number64;
export type SyncPeriod = Number64;
export type CommitteeIndex = Number64;
export type SubCommitteeIndex = Number64;
export type ValidatorIndex = Number64;
export type Gwei = Uint64;
export type Root = Bytes32;
export type Version = Bytes4;
export type DomainType = Bytes4;
export type ForkDigest = Bytes4;
export type Domain = Bytes32;
export type BLSPubkey = Bytes48;
export type BLSSecretKey = Bytes32;
export type BLSSignature = Bytes96;
export type ParticipationFlags = Uint8;
export type ExecutionAddress = Bytes20;

/** Common non-spec type to represent roots as strings */
export type RootHex = string;
