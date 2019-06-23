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
    type: string;
    input: string;
    inputType: string;
}

export default class Input extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        const initialType = names[Math.floor(Math.random() * names.length)];
        this.state = {
            input: Input.createRandom(types[initialType]),
            type: initialType,
            inputType: 'yaml',
        };
    }

    static createRandom(type: AnySSZType): string {
        return dumpYaml(createRandomValue(type));
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
        switch(this.state.inputType) {
            case 'json':
                return JSON.parse(this.state.input);
            case 'yaml':
                return parseYaml(this.state.input, types[this.state.type]);
        }
    }

    setType(e: ChangeEvent<HTMLSelectElement>) {
        const typeName = e.target.value;
        const input = Input.createRandom(types[typeName]);
        this.setState({type: e.target.value, input});
    }

    setInput(e: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({input: e.target.value});
    }

    doProcess() {
        this.props.onProcess(this.state.type, this.parsedInput(), types[this.state.type])
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
                                value={this.state.type}
                                onChange={this.setType.bind(this)}>
                                {
                                    names.map((name) => <option key={name} value={name}>{name}</option>)
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
                        disabled={!(this.state.type && this.state.input)}
                        onClick={this.doProcess.bind(this)}>
                    Serialize
                </button>
            </div>
        )
    }
}
