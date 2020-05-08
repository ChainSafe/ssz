import { toHexString, Type } from "@chainsafe/ssz";
import {dumpYaml} from "./yaml";

type SerializeOutputTypeRecord = Record<string, SerializeOutputType>;

type SerializeOutputType = {
  dump: (value: Uint8Array) => string;
};

type DeserializeOutputTypeRecord = Record<string, DeserializeOutputType>;

type DeserializeOutputType = {
  // dump: (value: Uint8Array, type) => string;
  dump: <T>(value: any, type: Type<T>) => string,
};

export const serializeOutputTypes: SerializeOutputTypeRecord = {
  hex: {
    dump: (value) => toHexString(value),
  },
  base64: {
    dump: (value) => value.toString('base64'),
  },
};

export const deserializeOutputTypes: DeserializeOutputTypeRecord = {
  yaml: {
    dump: (value, type) => dumpYaml(type.toJson(typeof value === 'number' ? value.toString() : value)),
  },
  json: {
    dump: (value, type) => JSON.stringify(type.toJson(value), null, 2),
  },
  ssz: {
    dump: (value, type) => toHexString(type.serialize(value)),
  },
};
