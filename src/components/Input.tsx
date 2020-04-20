import * as React from "react";
import {presets, typeNames, PresetName} from "../util/types";
import {Type} from "@chainsafe/ssz";
import {createRandomValue} from "../util/random";
import {ChangeEvent} from "react";
import {inputTypes} from "../util/input_types";


type Props = {
    onProcess: (presetName: PresetName, name: string, input: any, type: Type<any>, inputType: string) => void
}

type State = {
    presetName: PresetName;
    sszTypeName: string;
    input: string;
    inputType: string;
}

const DEFAULT_PRESET = "mainnet";

export default class Input extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        const types = presets[DEFAULT_PRESET];
        const names = typeNames(types);
        const initialType = names[Math.floor(Math.random() * names.length)];
        const sszType = types[initialType];
        this.state = {
            presetName: DEFAULT_PRESET,
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

    names() {
      return typeNames(this.types());
    }
    types() {
      return presets[this.state.presetName];
    }
    parsedInput() {
        return inputTypes[this.state.inputType].parse(this.state.input, this.types()[this.state.sszTypeName]);
    }

    resetWith(inputType: string, sszTypeName: string) {
        const sszType = this.types()[sszTypeName];
        const value = createRandomValue(sszType);
        const input = inputTypes[inputType].dump(value, sszType);
        this.setState({inputType, sszTypeName, input});
    }

    setPreset(e: ChangeEvent<HTMLSelectElement>) {
        this.setState({presetName: e.target.value as PresetName}, () => {
          this.resetWith(this.state.inputType, this.state.sszTypeName);
        });
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
        this.props.onProcess(this.state.presetName, this.state.sszTypeName, this.parsedInput(), this.types()[this.state.sszTypeName], this.state.inputType)
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
                                    Preset
                                </a>
                            </div>
                            <div className='control'>
                                <div className='select'>
                                    <select
                                        value={this.state.presetName}
                                        onChange={this.setPreset.bind(this)}>
                                        {
                                            Object.keys(presets).map(
                                                (name) => <option key={name} value={name}>{name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
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
                                            this.names().map(
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
