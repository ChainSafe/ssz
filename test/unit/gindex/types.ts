import {BigIntUintType} from "../../../src";
import {ContainerType} from "../../../src/types/composite/container";
import {BooleanType} from "../../../src/types/basic/boolean";
import {ByteVectorType} from "../../../src/types/composite/byteVector";
import {BitListType} from "../../../src/types/composite/bitList";
import {BitVectorType} from "../../../src/types/composite/bitVector";
import {ListType} from "../../../src/types/composite/list";
import {VectorType} from "../../../src/types/composite/vector";

const TestContainer2 = new ContainerType({
  fields: {
    field: new BigIntUintType({byteLength: 64}),
  },
});

export const TestContainer = new ContainerType({
  fields: {
    uint: new BigIntUintType({byteLength: 64}),
    bool: new BooleanType(),
    bytes32: new ByteVectorType({length: 32}),
    bitlist: new BitListType({limit: 10}),
    bitvector: new BitVectorType({length: 10}),
    basicList: new ListType({elementType: new BigIntUintType({byteLength: 64}), limit: 30}),
    basicVector: new VectorType({elementType: new BigIntUintType({byteLength: 64}), length: 30}),
    complexList: new ListType({elementType: TestContainer2, limit: 10}),
    complexVector: new VectorType({elementType: TestContainer2, length: 10}),
  },
});
