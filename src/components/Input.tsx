import * as React from "react";
import {presets, typeNames, PresetName} from "../util/types";
import {Type} from "@chainsafe/ssz";
import {createRandomValue} from "../util/random";
import {ChangeEvent} from "react";
import {inputTypes} from "../util/input_types";


type Props = {
  onProcess: (presetName: PresetName, name: string, input: any, type: Type<any>, inputType: string) => void
  serializeModeOn: boolean
}

type State = {
  presetName: PresetName;
  sszTypeName: string;
  input: string;
  serializeInputType: string;
  deserializeInputType: string;
  value: any;
}

const DEFAULT_PRESET = "mainnet";

export default class Input extends React.Component<Props, State> {

  constructor(props: any) {
    super(props);
    const types = presets[DEFAULT_PRESET];
    const names = typeNames(types);
    const initialType = names[Math.floor(Math.random() * names.length)];
    const sszType = types[initialType];
    const value = createRandomValue(sszType);
    const input = inputTypes.yaml.dump(value, sszType);
    this.state = {
      presetName: DEFAULT_PRESET,
      input,
      sszTypeName: initialType,
      serializeInputType: 'yaml',
      deserializeInputType: 'ssz',
      value,
    };
  }

  componentDidUpdate(prevProps: { serializeModeOn: boolean; }) {
    if(prevProps.serializeModeOn !== this.props.serializeModeOn) {
      if (!this.props.serializeModeOn) {
        this.setInputType('ssz');
      } else {
        this.setInputType(this.state.serializeInputType);
      }
    }
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

  getInputType(): string {
    const {serializeModeOn} = this.props;
    const {serializeInputType, deserializeInputType} = this.state;
    return serializeModeOn ? serializeInputType : deserializeInputType;
  }

  parsedInput() {
    const inputType = this.getInputType();
    return inputTypes[inputType].parse(this.state.input, this.types()[this.state.sszTypeName]);
  }

  resetWith(inputType: string, sszTypeName: string) {
    const sszType = this.types()[sszTypeName];
    const value = createRandomValue(sszType);
    const input = inputTypes[inputType].dump(value, sszType);
    if (this.props.serializeModeOn) {
      this.setState({serializeInputType: inputType, sszTypeName, input, value});
    } else {
      this.setState({deserializeInputType: inputType, sszTypeName, input, value});
    }
  }

  setPreset(e: ChangeEvent<HTMLSelectElement>) {
    this.setState({presetName: e.target.value as PresetName}, () => {
      this.resetWith(this.getInputType(), this.state.sszTypeName);
    });
  }

  setInputType(inputType: string) {
    const {sszTypeName, value} = this.state;
    const sszType = this.types()[sszTypeName];
    const input = inputTypes[inputType].dump(value, sszType);
    if (this.props.serializeModeOn) {
      this.setState({serializeInputType: inputType, sszTypeName, input});
    } else {
      this.setState({deserializeInputType: inputType, sszTypeName, input});
    }
  }

  setSSZType(e: ChangeEvent<HTMLSelectElement>) {
    this.resetWith(this.getInputType(), e.target.value);
  }

  setInput(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({input: e.target.value});
  }

  doProcess() {
    const {presetName, sszTypeName} = this.state;
    this.props.onProcess(
      presetName,
      sszTypeName,
      this.parsedInput(),
      this.types()[sszTypeName],
      this.getInputType(),
    );
  }

  render() {
    const {serializeModeOn} = this.props;
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
            {serializeModeOn &&
              <div className='field has-addons'>
                <div className='control'>
                  <a className='button is-static'>
                    Input Type
                  </a>
                </div>
                <div className='control'>
                  <div className='select'>
                    <select
                      value={this.getInputType()}
                      onChange={(e) => this.setInputType(e.target.value)}>
                      {
                        Object.keys(inputTypes).map(
                          (name) => <option key={name} value={name}>{name}</option>)
                      }
                    </select>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        <textarea className='textarea'
          rows={this.getRows()}
          value={this.state.input}
          onChange={this.setInput.bind(this)}
        />
        <button
          className='button is-primary is-medium is-fullwidth is-uppercase is-family-code submit'
          disabled={!(this.state.sszTypeName && this.state.input)}
          onClick={this.doProcess.bind(this)}
        >
          {serializeModeOn ? 'Serialize' : 'Deserialize'}
        </button>
      </div>
    )
  }
}
