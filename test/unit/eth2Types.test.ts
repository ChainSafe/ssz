import {ByteVector, ByteVectorType, ContainerType, NumberUintType, IContainerOptions} from "../../src";

interface BeaconBlock {
  slot: number;
  proposerIndex: number;
  parentRoot: ByteVector;
  stateRoot: ByteVector;
  subType: {
    a: number;
    b: ByteVector;
  };
}

type XX = IContainerOptions<BeaconBlock>;
type YY = XX["fields"]["slot"];
type NumberUintTypeType = NumberUintType["type"];

describe("Eth2.0 type generators", () => {
  const Number64 = new NumberUintType({byteLength: 8});

  const Bytes32 = new ByteVectorType({length: 32});

  const SubBlockType = new ContainerType({
    fields: {
      a: Number64,
      b: Bytes32,
    },
  });

  const BeaconBlockType = new ContainerType<BeaconBlock>({
    fields: {
      slot: Number64,
      proposerIndex: Number64,
      parentRoot: Bytes32,
      stateRoot: Bytes32,
      subType: SubBlockType,
    },
  });
});
