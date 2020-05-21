import * as React from "react";
import {presets, typeNames, PresetName} from "../util/types";
import {Type, toHexString} from "@chainsafe/ssz";
import {ChangeEvent} from "react";
import {inputTypes} from "../util/input_types";
import {withAlert} from "react-alert";
import worker from "workerize-loader!./worker";

type Props<T> = {
  onProcess: (presetName: PresetName, name: string, input: string | T, type: Type<T>, inputType: string) => void;
  serializeModeOn: boolean;
  sszType: Type<T> | undefined;
  serialized: Uint8Array | undefined;
  deserialized: object;
  alert: object;
  setOverlay: Function;
};

type State = {
  presetName: PresetName;
  sszTypeName: string;
  input: string;
  serializeInputType: string;
  deserializeInputType: string;
  value: object | string;
};

const workerInstance = worker();

const DEFAULT_PRESET = "mainnet";

class Input<T> extends React.Component<Props<T>, State> {

  constructor(props: Props<T>) {
    super(props);
    const types = presets[DEFAULT_PRESET];
    const names = typeNames(types);
    const initialType = names[Math.floor(Math.random() * names.length)];
    const sszType = types[initialType];
    workerInstance.createRandomValueWorker({sszTypeName: initialType, presetName: DEFAULT_PRESET})
      .then((value: object | string) => {
        const input = inputTypes.yaml.dump(value, sszType);
        this.setValueAndInput(value, input);
      })
      .catch((error: { message: string }) => this.handleError(error));

    this.state = {
      presetName: DEFAULT_PRESET,
      input: "",
      sszTypeName: initialType,
      serializeInputType: "yaml",
      deserializeInputType: "ssz",
      value: "",
    };
  }

  setValueAndInput(value: object | string, input: string) {
    this.setState({value, input});
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

  handleError(error: { message: string }): void {
    this.showError(error.message);
    this.props.setOverlay(false);
  }

  showError(errorMessage: string): void {
    this.props.alert.error(errorMessage);
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
    const {presetName} = this.state;

    this.props.setOverlay(true, `Generating random ${sszTypeName} value...`);
    workerInstance.createRandomValueWorker({sszTypeName, presetName})
      .then((value: object | string) => {
        const input = inputTypes[inputType].dump(value, sszType);
        if (this.props.serializeModeOn) {
          this.setState({serializeInputType: inputType, sszTypeName, input, value});
        } else {
          this.setState({deserializeInputType: inputType, sszTypeName, input, value});
        }
        this.props.setOverlay(false);
      })
      .catch((error: { message: string }) => this.handleError(error));
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
    try {
      this.props.onProcess(
        presetName,
        sszTypeName,
        this.parsedInput(),
        this.types()[sszTypeName],
        this.getInputType(),
      );
    } catch(e) {
      this.handleError(e);
    }
  }

  onUploadFile(file) {
    if (file) {
      const sszType = this.types()[this.state.sszTypeName];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      const setValueAndInput = this.setValueAndInput.bind(this);
      reader.onload = function (e) {
        const value = e.target.result;
        const input = inputTypes.yaml.dump(value, sszType);
        console.log('sttuff: ', value, input)
        setValueAndInput(value, input);
      }
      reader.onerror = function (evt) {
        this.handleError('error reading file');
      }
    }
  }

  render() {
    const {serializeModeOn} = this.props;
    return (
      <div className='container'>
        <h3 className='subtitle'>Input</h3>
        {!this.props.serializeModeOn &&
          <div>
            <div>Upload a file to populate field below (optional)</div>
            <input
              type="file"
              onChange={(e) => this.onUploadFile(e.target.files[0])}
            />
          </div>
        }
        <br />
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
          rows={this.state.input && this.getRows()}
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

export default withAlert()(Input);
