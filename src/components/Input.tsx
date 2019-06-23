import * as React from "react";
import {names, types} from "../util/types";
import {AnySSZType} from "@chainsafe/ssz";
import {createRandomValue} from "../util/random";
import {ChangeEvent} from "react";
import {inputTypes} from "../util/input_types";


type Props = {
    onProcess: (name: string, input: any, type: AnySSZType) => void
}

type State = {
    sszTypeName: string;
    input: string;
    inputType: string;
}

export default class Input extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        const initialType = names[Math.floor(Math.random() * names.length)];
        const sszType = types[initialType];
        this.state = {
            input: inputTypes.yaml.dump(createRandomValue(sszType), sszType),
            sszTypeName: initialType,
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
        return inputTypes[this.state.inputType].parse(this.state.input, types[this.state.sszTypeName]);
    }

    resetWith(inputType: string, sszTypeName: string) {
        const sszType = types[sszTypeName];
        const value = createRandomValue(sszType);
        const input = inputTypes[inputType].dump(value, sszType);
        this.setState({inputType, sszTypeName, input});
    }

    setInputType(e: ChangeEvent<HTMLSelectElement>) {
        this.resetWith(e.target.value, this.state.sszTypeName);
    }

    setSSZType(e: ChangeEvent<HTMLSelectElement>) {
        this.resetWith(this.state.inputType, e.target.value);
    }

    setInput(e: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({input: e.target.value});
    }

    doProcess() {
        this.props.onProcess(this.state.sszTypeName, this.parsedInput(), types[this.state.sszTypeName])
    }

    render() {
        return (
            <div className='container'>
                <h3 className='subtitle'>Input</h3>
                <div className="field is-horizontal">
                    <div className="field-body">
                        <div className='field has-addons'>
                            <div className='control'>
                                <a className='button is-static'>
                                    SSZ Type
                                </a>
                            </div>
                            <div className='control'>
                                <div className='select'>
                                    <select
                                        value={this.state.sszTypeName}
                                        onChange={this.setSSZType.bind(this)}>
                                        {
                                            names.map(
                                                (name) => <option key={name} value={name}>{name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='field has-addons'>
                            <div className='control'>
                                <a className='button is-static'>
                                    Input Type
                                </a>
                            </div>
                            <div className='control'>
                                <div className='select'>
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
                    </div>
                </div>
                <textarea className='textarea'
                          rows={this.getRows()}
                          value={this.state.input}
                          onChange={this.setInput.bind(this)}/>
                <button className='button is-primary is-medium is-fullwidth is-uppercase is-family-code submit'
                        disabled={!(this.state.sszTypeName && this.state.input)}
                        onClick={this.doProcess.bind(this)}>
                    Serialize
                </button>
            </div>
        )
    }
}
