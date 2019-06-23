import {FullSSZType, Type} from "@chainsafe/ssz";
import decamelize from "decamelize";

export function expandInput(input: any, type: FullSSZType): any {
    switch (type.type) {
        case Type.uint:
        case Type.bool:
            return input;
        case Type.byteList:
        case Type.byteVector:
            if (input.slice(0, 2) === '0x') {
                return Buffer.from(input.slice(2), 'hex');
            } else {
                return Buffer.from(input, 'hex');
            }
        case Type.list:
        case Type.vector:
            return input.map((i: any) => expandInput(i, type.elementType));
        case Type.container:
            const output: any = {};
            type.fields.forEach(([fieldName, fieldType]) => {
                output[fieldName] = expandInput(input[fieldName] || input[decamelize(fieldName)], fieldType);
            });
            return output;
    }
}

export function unexpandInput(input: any, type: FullSSZType): any {
    switch (type.type) {
        case Type.uint:
        case Type.bool:
            return input;
        case Type.byteList:
        case Type.byteVector:
            const out = input.toString('hex');
            console.log("unexpanded: ", input, out);
            return out;
        case Type.list:
        case Type.vector:
            return input.map((i: any) => unexpandInput(i, type.elementType));
        case Type.container:
            const output: any = {};
            type.fields.forEach(([fieldName, fieldType]) => {
                output[fieldName] = unexpandInput(input[fieldName] || input[decamelize(fieldName)], fieldType);
            });
            return output;
    }
}
