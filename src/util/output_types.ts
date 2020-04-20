import { toHexString } from "@chainsafe/ssz";

type OutputTypeRecord = Record<string, OutputType>;

type OutputType = {
  dump: (value: Uint8Array) => string;
};

export const outputTypes: OutputTypeRecord = {
  hex: {
    dump: (value) => toHexString(value), // value.toString('hex'),
  },
  base64: {
    dump: (value) => value.toString('base64'),
  },
};
