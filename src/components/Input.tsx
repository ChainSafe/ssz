import * as React from "react";
import {presets, typeNames, PresetName} from "../util/types";
import {Type, toHexString} from "@chainsafe/ssz";
import {createRandomValue} from "../util/random";
import {ChangeEvent} from "react";
import {inputTypes} from "../util/input_types";


type Props<T> = {
  onProcess: (presetName: PresetName, name: string, input: string | T, type: Type<T>, inputType: string) => void;
  serializeModeOn: boolean;
  sszType: Type<T> | undefined;
  serialized: Uint8Array | undefined;
  deserialized: object;
};

type State<T> = {
  presetName: PresetName;
  sszTypeName: string;
  input: string;
  serializeInputType: string;
  deserializeInputType: string;
  value: object | string;
};

const DEFAULT_PRESET = "mainnet";

export default class Input<T> extends React.Component<Props<T>, State<T>> {

  constructor(props: Props<T>) {
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
      serializeInputType: "yaml",
      deserializeInputType: "ssz",
      value,
    };
  }

  componentDidUpdate(prevProps: { serializeModeOn: boolean }): void {
    if(prevProps.serializeModeOn !== this.props.serializeModeOn) {
      if (!this.props.serializeModeOn) {
        this.setInputType("ssz");
        if (this.props.serialized) {
          this.setInput(toHexString(this.props.serialized));
        }
      } else {
        this.setInputType(this.state.serializeInputType);
        if (this.props.deserialized) {
          this.setState({value: this.props.deserialized});
          this.setInput(inputTypes[this.state.serializeInputType].dump(this.props.deserialized, this.props.sszType));
        }
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
    );
  }

  names(): string[] {
    return typeNames(this.types());
  }
  types(): Record<string, Type<any>> {
    return presets[this.state.presetName];
  }

  getInputType(): string {
    const {serializeModeOn} = this.props;
    const {serializeInputType, deserializeInputType} = this.state;
    return serializeModeOn ? serializeInputType : deserializeInputType;
  }

  parsedInput(): string | T {
    const inputType = this.getInputType();
    return inputTypes[inputType].parse(this.state.input, this.types()[this.state.sszTypeName]);
  }

  resetWith(inputType: string, sszTypeName: string): void {
    const sszType = this.types()[sszTypeName];
    const value = createRandomValue(sszType);
    const input = inputTypes[inputType].dump(value, sszType);
    if (this.props.serializeModeOn) {
      this.setState({serializeInputType: inputType, sszTypeName, input, value});
    } else {
      this.setState({deserializeInputType: inputType, sszTypeName, input, value});
    }
  }

  setPreset(e: ChangeEvent<HTMLSelectElement>): void {
    this.setState({presetName: e.target.value as PresetName}, () => {
      this.resetWith(this.getInputType(), this.state.sszTypeName);
    });
  }

  setInputType(inputType: string): void {
    const {sszTypeName, value} = this.state;
    const sszType = this.types()[sszTypeName];
    const input = inputTypes[inputType].dump(value, sszType);
    if (this.props.serializeModeOn) {
      this.setState({serializeInputType: inputType, sszTypeName, input});
    } else {
      this.setState({deserializeInputType: inputType, sszTypeName, input});
    }
  }

  setSSZType(e: ChangeEvent<HTMLSelectElement>): void {
    this.resetWith(this.getInputType(), e.target.value);
  }

  setInput(input: string): void {
    this.setState({input});
  }

  doProcess(): void {
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
          onChange={(e) => this.setInput(e.target.value)}
        />
        <button
          className='button is-primary is-medium is-fullwidth is-uppercase is-family-code submit'
          disabled={!(this.state.sszTypeName && this.state.input)}
          onClick={this.doProcess.bind(this)}
        >
          {serializeModeOn ? "Serialize" : "Deserialize"}
        </button>
      </div>
    );
  }
}
