import * as React from "react";
import {Type, toHexString} from "@chainsafe/ssz";
import Output from "./Output";
import Input from "./Input";
import {PresetName} from "../util/types";
import {inputTypes} from "../util/input_types";
import TreeView from "./TreeView";

type Props = {
  serializeModeOn: boolean;
};

type State<T> = {
  presetName: PresetName | undefined;
  name: string | undefined;
  input: object;
  sszType: Type<T> | undefined;
  error: string | undefined;
  serialized: Uint8Array | undefined;
  hashTreeRoot: Uint8Array | undefined;
  deserialized: object;
};

export default class Serialize<T> extends React.Component<Props, State<T>> {

  constructor(props: Props) {
    super(props);
    this.state = {
      presetName: undefined,
      name: undefined,
      input: undefined,
      sszType: undefined,
      error: undefined,
      serialized: undefined,
      hashTreeRoot: undefined,
      deserialized: undefined,
    };
  }

  process<T>(presetName: PresetName, name: string, input: T, type: Type<T>, inputType: string): void {
    let serialized, root, error;
    try {
      serialized = type.serialize(input);
      root = type.hashTreeRoot(input);
    } catch (e) {
      error = e.message;
    }
    // note that all bottom nodes are converted to strings, so that they do not have to be formatted,
    // and can be passed through React component properties.

    const deserialized = input;

    this.setState({presetName, name, input, sszType: type, serialized, hashTreeRoot: root, error, deserialized});
  }

  render() {
    const {presetName, input, sszType, error, serialized, hashTreeRoot, deserialized} = this.state;
    const {serializeModeOn} = this.props;
    const treeKey = hashTreeRoot ? toHexString(hashTreeRoot) : "";
    return (
      <div className='section serialize-section is-family-code'>
        <div className='container'>
          <div className='columns is-desktop'>
            <div className='column'>
              <Input
                serializeModeOn={serializeModeOn}
                onProcess={this.process.bind(this)}
                sszType={sszType}
                serialized={serialized}
                deserialized={deserialized}
              />
            </div>
            <div className='column'>
              <Output
                deserialized={deserialized}
                serializeModeOn={serializeModeOn}
                serialized={serialized}
                hashTreeRoot={hashTreeRoot}
                error={error}
                sszType={sszType}
              />
            </div>
          </div>
        </div>
        {
          // (!error && input && sszType && presetName) && <TreeView key={treeKey} presetName={presetName} input={input} sszType={sszType} sszTypeName={this.state.name}/>
        }
      </div>
    );
  }
}
