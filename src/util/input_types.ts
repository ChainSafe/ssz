import {AnySSZType, deserialize, parseType, serialize} from "@chainsafe/ssz";
import {expandInput, unexpandInput} from "./translate";
import {dumpYaml, parseYaml} from "./yaml";

type InputTypeRecord = Record<string, InputType>

type InputType = {
    parse: (raw: string, type: AnySSZType) => any,
    dump: (value: any, type: AnySSZType) => string,
}

export const inputTypes: InputTypeRecord = {
    yaml: {
        parse: (raw, type) => expandInput(parseYaml(raw), parseType(type)),
        dump: (value, type) => dumpYaml(unexpandInput(value, parseType(type))),
    },
    json: {
        parse: (raw, type) => "todo",
        dump: (value, type) => "todo",
    },
    ssz: {
        parse: (raw, type) => deserialize(Buffer.from(raw.replace('0x', ''), 'hex'), type),
        dump: (value, type) => '0x' + serialize(expandInput(value, parseType(type)), type).toString('hex'),
    },
};
