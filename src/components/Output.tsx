import * as React from "react";
import NamedOutput from "./display/NamedOutput";
import ErrorBox from "./display/ErrorBox";
import {saveAs} from "file-saver";

import {serializeOutputTypes, deserializeOutputTypes} from "../util/output_types";
import {Type} from "@chainsafe/ssz";


type Props<T> = {
  error: string | undefined;
  serialized: Uint8Array | undefined;
  hashTreeRoot: Uint8Array | undefined;
  serializeModeOn: boolean;
  deserialized: T;
  sszType: Type<T>;
};

type State = {
  showError: boolean;
  outputType: string;
};

export default class Output<T> extends React.Component<Props<T>, State> {

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      showError: false,
      outputType: "hex",
    };
  }

  static getDerivedStateFromProps<T>(nextProps: Props<T>): object {
    return {showError: !!nextProps.error};
  }

  componentDidUpdate(prevProps: { serializeModeOn: boolean }): void {
    if(prevProps.serializeModeOn !== this.props.serializeModeOn) {
      if (!this.props.serializeModeOn) {
        this.setOutputType("yaml");
      } else {
        this.setOutputType("hex");
      }
    }
  }

  hideError(): void {
    this.setState({showError: false});
  }

  setOutputType(outputType: string): void {
    this.setState({outputType: outputType});
  }

  downloadFile(contents, type): void {
    const fileContents = new Blob([contents]);
    saveAs(fileContents, "test." + type);
  }

  render(): JSX.Element {
    const {error, serialized, deserialized, hashTreeRoot, serializeModeOn, sszType} = this.props;
    const {showError, outputType} = this.state;

    let serializedStr, deserializedStr, hashTreeRootStr;
    if (serializeModeOn) {
      const serializedOutput = serializeOutputTypes[outputType];
      serializedStr = (serialized && serializedOutput) ? serializedOutput.dump(serialized) : "";
      hashTreeRootStr = (hashTreeRoot && serializedOutput) ? serializedOutput.dump(hashTreeRoot) : "";
    } else {
      const deserializedOuput = deserializeOutputTypes[outputType];
      deserializedStr = deserialized && deserializedOuput ? deserializedOuput.dump(deserialized, sszType) : "";
    }

    return (<div className='container'>
      <h3 className='subtitle'>Output</h3>
      {
        showError
          ? <ErrorBox error={error} hideError={this.hideError.bind(this)}/>
          :
          <>
            <div className='field is-grouped is-grouped-right'>
              <div className='field has-addons'>
                <div className='control'>
                  <a className='button is-static'>
                    Output Type
                  </a>
                </div>
                <div className='control'>
                  <div className='select'>
                    <select
                      value={outputType}
                      onChange={(e) => this.setOutputType(e.target.value)}>
                      {
                        Object.keys(serializeModeOn ? serializeOutputTypes : deserializeOutputTypes).map(
                          (name) => <option key={name} value={name}>{name}</option>)
                      }
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {serializeModeOn ?
              <>
                <NamedOutput name="HashTreeRoot" value={hashTreeRootStr} />
                <NamedOutput name="Serialized" value={serializedStr} textarea />
                <button
                  onClick={() => this.downloadFile(this.props.serialized, 'ssz')}
                >{"Download data as .ssz file"}</button>
              </>
              :
              <>
                <textarea className='textarea'
                  rows={8}
                  value={deserializedStr || ""}
                  readOnly={true}
                />
                <button
                  onClick={() => this.downloadFile(deserializedStr, this.state.outputType)}
                >{"Download data as ." + this.state.outputType + " file"}</button>
              </>
            }
          </>
      }
    </div>);
  }
}
