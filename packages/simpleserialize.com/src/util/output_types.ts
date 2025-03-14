import {Type, toHexString} from "@chainsafe/ssz";
import {dumpYaml} from "./yaml";

function toBase64(data: Uint8Array) {
  const binstr = Array.prototype.map.call(data, (ch) => String.fromCharCode(ch)).join("");
  return btoa(binstr);
}

type SerializeOutputTypeRecord = Record<string, SerializeOutputType>;

type SerializeOutputType = {
  dump: (value: Uint8Array) => string;
};

type DeserializeOutputTypeRecord = Record<string, DeserializeOutputType>;

type DeserializeOutputType = {
  // biome-ignore lint/suspicious/noExplicitAny: We need to use `any` here explicitly
  dump: <T>(value: any, type: Type<T>) => string;
};

export const serializeOutputTypes: SerializeOutputTypeRecord = {
  hex: {
    dump: (value) => toHexString(value),
  },
  base64: {
    dump: (value) => toBase64(value),
  },
};

export const deserializeOutputTypes: DeserializeOutputTypeRecord = {
  yaml: {
    dump: (value, type) => dumpYaml(type.toJson(typeof value === "number" ? value.toString() : value)),
  },
  json: {
    dump: (value, type) => JSON.stringify(type.toJson(value), null, 2),
  },
};
