import * as React from 'react';
import { AnySSZType, serialize, hashTreeRoot } from "@chainsafe/ssz";
import Output from "./Output";
import Input from "./Input";


type Props = {

}

type State = {
  name: string | undefined
  error: string | undefined;
  serialized: string | undefined;
  hashTreeRoot: string | undefined;
}

export default class Serialize extends React.Component<Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      name: undefined,
      error: undefined,
      serialized: undefined,
      hashTreeRoot: undefined,
    };
  }

  process(name: string, input: any, type: AnySSZType) {
    let serialized, root, error;
    try {
      serialized = serialize(input, type).toString('hex');
      root = hashTreeRoot(input, type).toString('hex');
    } catch (e) {
      error = e.message;
    }
    this.setState({name, serialized, hashTreeRoot: root, error});
  }

  render() {
    const {error, serialized, hashTreeRoot} = this.state;
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
      </div>
    );
  }
}
