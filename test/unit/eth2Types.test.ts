import {ByteVector, ByteVectorType, ContainerType, NumberUintType} from "../../src";

interface BeaconBlock {
  slot: number;
  proposerIndex: number;
  parentRoot: ByteVector;
  stateRoot: ByteVector;
}

describe("Eth2.0 type generators", () => {
  const Number64 = new NumberUintType({byteLength: 8});
  const Bytes32 = new ByteVectorType({length: 32});

  const BeaconBlockType = new ContainerType<BeaconBlock>({
    fields: {
      slot: Number64,
      proposerIndex: Number64,
      parentRoot: Bytes32,
      stateRoot: Bytes32,
    },
  });
});
