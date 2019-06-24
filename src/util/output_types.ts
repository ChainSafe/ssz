type OutputTypeRecord = Record<string, OutputType>;

type OutputType = {
  dump: (value: Buffer) => string;
};

export const outputTypes: OutputTypeRecord = {
  hex: {
    dump: (value) => value.toString('hex'),
  },
  base64: {
    dump: (value) => value.toString('base64'),
  },
};
