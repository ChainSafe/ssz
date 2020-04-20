import {Type, fromHexString, toHexString} from "@chainsafe/ssz";
// import {expandByteArray, expandInput, unexpandInput} from "./translate";
import {dumpYaml, parseYaml} from "./yaml";

type InputTypeRecord = Record<string, InputType>

type InputType = {
    parse: <T>(raw: string, type: Type<T>) => any,
    dump: <T>(value: any, type: Type<T>) => string,
}

export const inputTypes: InputTypeRecord = {
    yaml: {
        parse: (raw, type) => type.fromJson(parseYaml(raw)), // expandInput(parseYaml(raw), parseType(type), false),
        dump: (value, type) => dumpYaml(type.toJson(typeof value === 'number' ? value.toString() : value)), // dumpYaml(unexpandInput(value, parseType(type), false)),
    },
    json: {
        parse: (raw, type) => type.fromJson(JSON.parse(raw)), // expandInput(JSON.parse(raw), parseType(type), true),
        dump: (value, type) => JSON.stringify(type.toJson(value)), // JSON.stringify(unexpandInput(value, parseType(type), true)),
    },
    ssz: {
        parse: (raw, type) => type.deserialize(fromHexString(raw)), // deserialize(expandByteArray(raw), type),
        dump: (value, type) => toHexString(type.serialize(value)), // '0x' + serialize(value, type).toString('hex'),
    },
};
