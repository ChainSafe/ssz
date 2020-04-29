import * as React from 'react';
import {Type, toHexString} from "@chainsafe/ssz";
import Output from "./Output";
import Input from "./Input";
import {PresetName} from '../util/types';
import {inputTypes} from "../util/input_types";
import TreeView from './TreeView';

type Props = {

}

type State<T> = {
  presetName: PresetName | undefined;
  name: string | undefined;
  input: any;
  sszType: Type<T> | undefined;
  error: string | undefined;
  serialized: Uint8Array | undefined;
  hashTreeRoot: Uint8Array | undefined;
}

export default class Serialize<T> extends React.Component<Props, State<T>> {

  constructor(props: any) {
    super(props);
    this.state = {
      presetName: undefined,
      name: undefined,
      input: undefined,
      sszType: undefined,
      error: undefined,
      serialized: undefined,
      hashTreeRoot: undefined,
    };
  }

  process<T>(presetName: PresetName, name: string, input: T, type: Type<T>, inputType: string) {
    let serialized, root, error;
    try {
      serialized = type.serialize(input);
      root = type.hashTreeRoot(input);
    } catch (e) {
      error = e.message;
    }
    // note that all bottom nodes are converted to strings, so that they do not have to be formatted,
    // and can be passed through React component properties.

    this.setState({presetName, name, input, sszType: type, serialized, hashTreeRoot: root, error});
  }

  render() {
    const {presetName, input, sszType, error, serialized, hashTreeRoot} = this.state;
    const treeKey = hashTreeRoot ? toHexString(hashTreeRoot) : '';
    return (
      <div className='section serialize-section is-family-code'>
        <div className='container'>
          <div className='columns is-desktop'>
            <div className='column'>
              <Input onProcess={this.process.bind(this)}/>
            </div>
            <div className='column'>
              <Output error={error} serialized={serialized} hashTreeRoot={hashTreeRoot}/>
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
