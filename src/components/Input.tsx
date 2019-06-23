import * as React from "react";
import {names, types} from "../util/types";
import {AnySSZType} from "@chainsafe/ssz";
import {dumpYaml, parseYaml} from "../util/yaml";
import {createRandomValue} from "../util/random";
import {ChangeEvent} from "react";


type Props = {
    onProcess: (name: string, input: any, type: AnySSZType) => void
}

type State = {
    sszType: string;
    input: string;
    inputType: string;
}

type InputType = {
    parse: (value: string, type: AnySSZType) => any,
    dump: (value: any) => string,
}

type InputTypeRecord = Record<string, InputType>

const inputTypes: InputTypeRecord = {
    'yaml': {
        parse: parseYaml,
        dump: dumpYaml
    },
    'json': {
        parse: () => "todo",
        dump: (data: any) => "todo"
    }
};

export default class Input extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        const initialType = names[Math.floor(Math.random() * names.length)];
        this.state = {
            input: inputTypes.yaml.dump(createRandomValue(types[initialType])),
            sszType: initialType,
            inputType: 'yaml',
        };
    }

    getRows(): number {
        return Math.min(
            16,
            Math.max(
                4,
                Math.floor((this.state.input.match(/\n/g) || []).length * 1.5)
            )
        )
    }

    parsedInput() {
        return inputTypes[this.state.inputType].parse(this.state.input, this.state.sszType);
    }

    setInputType(e: ChangeEvent<HTMLSelectElement>) {
        const inputTypeName = e.target.value;
        const value = createRandomValue(types[this.state.sszType]);
        const input = inputTypes[inputTypeName].dump(value);
        this.setState({inputType: e.target.value, input});
    }

    setSSZType(e: ChangeEvent<HTMLSelectElement>) {
        const typeName = e.target.value;
        const input = createRandomValue(types[typeName]);
        this.setState({sszType: e.target.value, input});
    }

    setInput(e: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({input: e.target.value});
    }

    doProcess() {
        this.props.onProcess(this.state.sszType, this.parsedInput(), types[this.state.sszType])
    }

    render() {
        return (
            <div className='container'>
                <h3 className='subtitle'>Input</h3>
                <div className='field has-addons'>
                    <div className='control'>
                        <a className='button is-static'>
                            Type
                        </a>
                    </div>
                    <div className='control is-expanded'>
                        <div className='select is-fullwidth'>
                            <select
                                value={this.state.sszType}
                                onChange={this.setSSZType.bind(this)}>
                                {
                                    names.map(
                                        (name) => <option key={name} value={name}>{name}</option>)
                                }
                            </select>
                        </div>
                        <div className='select is-fullwidth'>
                            <select
                                value={this.state.inputType}
                                onChange={this.setInputType.bind(this)}>
                                {
                                    Object.keys(inputTypes).map(
                                        (name) => <option key={name} value={name}>{name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <textarea className='textarea'
                          rows={this.getRows()}
                          value={this.state.input}
                          onChange={this.setInput.bind(this)}/>
                <button className='button is-primary is-medium is-fullwidth is-uppercase is-family-code submit'
                        disabled={!(this.state.sszType && this.state.input)}
                        onClick={this.doProcess.bind(this)}>
                    Serialize
                </button>
            </div>
        )
    }
}
