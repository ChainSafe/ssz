import {ByteVector, ByteVectorType, ContainerType, NumberUintType, IContainerOptions, ListType} from "../../src";

interface BeaconBlock {
  slot: number;
  proposerIndex: number;
  parentRoot: ByteVector;
  stateRoot: ByteVector;
  subType: {
    a: number;
    b: ByteVector;
  };
  attestations: ByteVector[];
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

  const AttestationsType = new ListType<ByteVector[]>({
    elementType: Bytes32,
    limit: 100,
  });

  const BeaconBlockType = new ContainerType<BeaconBlock>({
    fields: {
      slot: Number64,
      proposerIndex: Number64,
      parentRoot: Bytes32,
      stateRoot: Bytes32,
      subType: SubBlockType,
      attestations: AttestationsType,
    },
  });
});
