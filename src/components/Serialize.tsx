import * as React from 'react';
import {AnySSZType, serialize, hashTreeRoot, parseType, FullSSZType} from "@chainsafe/ssz";
import Output from "./Output";
import Input from "./Input";
import TreeView from "./TreeView";
import {unexpandInput} from "../util/translate";


type Props = {

}

type State = {
  name: string | undefined;
  input: any;
  sszType: FullSSZType | undefined;
  error: string | undefined;
  serialized: Buffer | undefined;
  hashTreeRoot: Buffer | undefined;
}

export default class Serialize extends React.Component<Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      name: undefined,
      input: undefined,
      sszType: undefined,
      error: undefined,
      serialized: undefined,
      hashTreeRoot: undefined,
    };
  }

  process(name: string, input: any, type: AnySSZType) {
    let serialized, root, error;
    try {
      serialized = serialize(input, type);
      root = hashTreeRoot(input, type);
    } catch (e) {
      error = e.message;
    }
    const sszTyp = parseType(type);
    // note that all bottom nodes are converted to strings, so that they do not have to be formatted,
    // and can be passed through React component properties.
    const stringifiedInput = unexpandInput(input, sszTyp, true);
    this.setState({name, input: stringifiedInput, sszType: sszTyp, serialized, hashTreeRoot: root, error});
  }

  render() {
    const {input, sszType, error, serialized, hashTreeRoot} = this.state;
    const treeKey = hashTreeRoot ? hashTreeRoot.toString('hex') : '';
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
        {(!error && input && sszType) && <TreeView key={treeKey} input={input} sszType={sszType}/>}
      </div>
    );
  }
}
