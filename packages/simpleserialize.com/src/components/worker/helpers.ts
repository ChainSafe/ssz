import {Type} from "@chainsafe/ssz";
import {forks} from "../../util/types";

// type primitiveType = boolean | number | bigint | Uint8Array | Array<boolean> | object | undefined;

export function createRandomValue(type: Type<unknown>): unknown {
  return type.defaultValue;
}

export function getSSZType(sszTypeName: string, forkName: string): Type<unknown> {
  return forks[forkName][sszTypeName];
}
