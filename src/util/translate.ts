import {FullSSZType, Type} from "@chainsafe/ssz";
import {BitList, BitVector} from "@chainsafe/bit-utils";
import decamelize from "decamelize";
import BN from "bn.js";

export function expandByteArray(input: string): Buffer {
  if (input && input.slice(0, 2) === '0x') {
    return Buffer.from(input.slice(2), 'hex');
  } else {
    return Buffer.from(input, 'base64');
  }
}

export function expandInput(input: any, type: FullSSZType, intFromStr: boolean): any {
    switch (type.type) {
        case Type.uint:
            if(intFromStr) {
                return new BN(input, 10);
            } else {
                return input;
            }
        case Type.bool:
            return Boolean(input);
        case Type.bitList:
            return BitList.deserialize(expandByteArray(input))
        case Type.bitVector:
            return BitVector.fromBitfield(expandByteArray(input), type.length)
        case Type.byteList:
        case Type.byteVector:
            return expandByteArray(input);
        case Type.list:
        case Type.vector:
            return input.map((i: any) => expandInput(i, type.elementType, intFromStr));
        case Type.container:
            const output: any = {};
            type.fields.forEach(([fieldName, fieldType]) => {
                output[fieldName] = expandInput(input[fieldName] || input[decamelize(fieldName)], fieldType, intFromStr);
            });
            return output;
    }
}

export function unexpandInput(input: any, type: FullSSZType, intToStr: boolean): any {
    switch (type.type) {
        case Type.uint:
            if (intToStr) {
                return input.toString(10);
            } else {
                return input;
            }
        case Type.bool:
            return Boolean(input);
        case Type.bitList:
            return "0x" + Buffer.from(input.serialize()).toString('hex');
        case Type.bitVector:
            return "0x" + Buffer.from(input.toBitfield()).toString('hex');
        case Type.byteList:
        case Type.byteVector:
            return "0x" + input.toString('hex');
        case Type.list:
        case Type.vector:
            return input.map((i: any) => unexpandInput(i, type.elementType, intToStr));
        case Type.container:
            const output: any = {};
            type.fields.forEach(([fieldName, fieldType]) => {
                output[fieldName] = unexpandInput(input[fieldName] || input[decamelize(fieldName)], fieldType, intToStr);
            });
            return output;
    }
}
