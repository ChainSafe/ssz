/* eslint-disable @typescript-eslint/ban-types */

import * as React from "react";
import {Type, toHexString} from "@chainsafe/ssz";
import {ModuleThread, spawn, Thread, Worker} from "threads";
import {ChangeEvent} from "react";
import {AlertManager, withAlert} from "react-alert";

import {inputTypes} from "../util/input_types";
import {ForkName, typeNames, forks} from "../util/types";
import {SszWorker} from "./worker";

const initialType = "BeaconBlock";

type Props = {
  onProcess: (forkName: ForkName, name: string, input: unknown, type: Type<unknown>, inputType: string) => void;
  serializeModeOn: boolean;
  sszType: Type<unknown>;
  serialized?: Uint8Array;
  deserialized: object;
  setOverlay: Function;
  worker: Worker;
  alert: AlertManager;
};

type State = {
  forkName: ForkName;
  sszTypeName: string;
  input: string;
  serializeInputType: string;
  deserializeInputType: string;
  value: unknown;
  userHasEditedInput: boolean;
};

const DEFAULT_FORK = "capella";

class Input extends React.Component<Props, State> {
  worker: Worker;
  typesWorkerThread: ModuleThread<SszWorker> | undefined;

  constructor(props: Props) {
    super(props);
    this.worker = props.worker;

    this.state = {
      forkName: DEFAULT_FORK,
      input: "",
      sszTypeName: initialType,
      serializeInputType: "yaml",
      deserializeInputType: "hex",
      value: "",
      userHasEditedInput: false,
    };
  }

  async componentDidMount(): Promise<void> {
    this.typesWorkerThread = await spawn<SszWorker>(this.worker);
    await this.resetWith(this.getInputType(), this.state.sszTypeName);
  }

  async componentWillUnmount(): Promise<void> {
    await Thread.terminate(this.typesWorkerThread as ModuleThread<SszWorker>);
  }

  setValueAndInput(value: unknown, input: string): void {
    this.setState({value, input});
  }

  componentDidUpdate(prevProps: {serializeModeOn: boolean}): void {
    if (prevProps.serializeModeOn !== this.props.serializeModeOn) {
      if (!this.props.serializeModeOn) {
        this.setInputType("hex");
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

  handleError(error: {message: string}): void {
    this.showError(error.message);
    this.props.setOverlay(false);
  }

  showError(errorMessage: string): void {
    this.props.alert.error(errorMessage);
  }

  getRows(): number {
    return Math.min(16, Math.max(4, Math.floor((this.state.input.match(/\n/g) || []).length * 1.5)));
  }

  names(): string[] {
    return typeNames(this.types());
  }
  types(): Record<string, Type<unknown>> {
    return forks[this.state.forkName];
  }

  getInputType(): string {
    const {serializeModeOn} = this.props;
    const {serializeInputType, deserializeInputType} = this.state;
    return serializeModeOn ? serializeInputType : deserializeInputType;
  }

  async parsedInput(): Promise<unknown> {
    const inputTypeStr = this.getInputType();
    const type = this.types()[this.state.sszTypeName];
    const inputType = inputTypes[inputTypeStr];
    const parsed = inputType.parse(this.state.input, type);
    this.props.setOverlay(false);
    return parsed;
  }

  async resetWith(inputType: string, sszTypeName: string): Promise<void> {
    const types = this.types();
    let sszType = types[sszTypeName];

    // get a new ssz type if it's not in our fork
    if (!sszType) {
      sszTypeName = initialType;
      sszType = types[sszTypeName];
    }
    const {forkName} = this.state;

    // First set new type and name
    if (this.props.serializeModeOn) {
      this.setState({
        serializeInputType: inputType,
        sszTypeName,
      });
    } else {
      this.setState({
        deserializeInputType: inputType,
        sszTypeName,
      });
    }

    if (this.state.userHasEditedInput) {
      this.doProcess.bind(this);
    } else {
      this.props.setOverlay(true, `Generating random ${sszTypeName} value...`);
      this.typesWorkerThread
        ?.createRandomValue(sszTypeName, forkName)
        .then(async (value) => {
          const input = inputTypes[inputType].dump(value, sszType);
          this.setState({
            input,
            value,
          });
          this.props.setOverlay(false);
        })
        .catch((error: {message: string}) => this.handleError(error));
    }
  }

  setFork(e: ChangeEvent<HTMLSelectElement>): void {
    this.setState({forkName: e.target.value as ForkName}, async () => {
      await this.resetWith(this.getInputType(), this.state.sszTypeName);
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

  async setSSZType(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    await this.resetWith(this.getInputType(), e.target.value);
  }

  setInput(input: string): void {
    this.setState({input, userHasEditedInput: true});
  }

  async doProcess(): Promise<void> {
    const {sszTypeName, forkName} = this.state;
    const parsedInput = await this.parsedInput();
    try {
      this.props.onProcess(forkName, sszTypeName, parsedInput, this.types()[sszTypeName], this.getInputType());
    } catch (e) {
      this.handleError(e as Error);
    }
  }

  processFileContents(contents: string | ArrayBuffer): void {
    try {
      if (!this.props.serializeModeOn && contents instanceof ArrayBuffer) {
        this.setInput(toHexString(new Uint8Array(contents)));
      } else {
        this.setInput(contents as string);
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  onUploadFile(file: Blob): void {
    if (file) {
      const reader = new FileReader();
      const processFileContents = this.processFileContents.bind(this);
      const handleError = this.handleError.bind(this);
      if (this.props.serializeModeOn) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
      reader.onload = (e) => {
        if (e.target?.result) {
          if (e.target !== null) processFileContents(e.target.result);
        }
      };
      reader.onerror = (e: unknown) => {
        if (e instanceof Error) {
          handleError(e);
        }
      };
    }
  }

  render(): JSX.Element {
    const {serializeModeOn} = this.props;
    const {serializeInputType} = this.state;
    return (
      <div className="container">
        <h3 className="subtitle">Input</h3>
        <div>
          <div>Upload a file to populate field below (optional)</div>
          <input
            type="file"
            accept={`.${serializeModeOn ? serializeInputType : "ssz"}`}
            onChange={(e) => e.target.files && this.onUploadFile(e.target.files[0])}
          />
        </div>
        <br />
        <div className="field is-horizontal">
          <div className="field-body">
            <div className="field has-addons">
              <div className="control">
                <a className="button is-static">Fork</a>
              </div>
              <div className="control">
                <div className="select">
                  <select value={this.state.forkName} onChange={this.setFork.bind(this)}>
                    {Object.keys(forks).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field has-addons">
              <div className="control">
                <a className="button is-static">SSZ Type</a>
              </div>
              <div className="control">
                <div className="select">
                  <select value={this.state.sszTypeName} onChange={this.setSSZType.bind(this)}>
                    {this.names().map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {serializeModeOn && (
              <div className="field has-addons">
                <div className="control">
                  <a className="button is-static">Input Type</a>
                </div>
                <div className="control">
                  <div className="select">
                    <select value={this.getInputType()} onChange={(e) => this.setInputType(e.target.value)}>
                      {Object.keys(inputTypes).map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <textarea
          className="textarea"
          rows={this.getRows()}
          value={this.state.input}
          onChange={(e) => this.setInput(e.target.value)}
        />
        <button
          className="button is-primary is-medium is-fullwidth is-uppercase is-family-code submit"
          disabled={!(this.state.sszTypeName && this.state.input)}
          onClick={async () => await this.doProcess()}
        >
          {serializeModeOn ? "Serialize" : "Deserialize"}
        </button>
      </div>
    );
  }
}

// @TODO: not sure what to put here instead of any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAlert<any>()(Input);
