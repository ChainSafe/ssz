import * as React from "react";
import NamedOutput from "./display/NamedOutput";
import ErrorBox from "./display/ErrorBox";
import { ChangeEvent } from "react";

import {serializeOutputTypes, deserializeOutputTypes} from "../util/output_types";
import { Type } from "@chainsafe/ssz";


type Props = {
    error: string | undefined;
    serialized: Uint8Array | undefined;
    hashTreeRoot: Uint8Array | undefined;
    serializeModeOn: boolean;
    deserialized: any;
    sszType: Type<any>;
}

type State = {
    showError: boolean;
    outputType: string;
}

export default class Output extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showError: false,
            outputType: 'hex',
        };
    }

    static getDerivedStateFromProps(nextProps: Props) {
        return {showError: !!nextProps.error}
    }

    componentDidUpdate(prevProps: { serializeModeOn: boolean; }) {
      if(prevProps.serializeModeOn !== this.props.serializeModeOn) {
        if (!this.props.serializeModeOn) {
          this.setOutputType('yaml');
        } else {
          this.setOutputType('hex');
        }
      }
    }

    hideError() {
        this.setState({showError: false})
    }

    setOutputType(outputType: string) {
      this.setState({outputType: outputType});
    }

    render() {
        const {error, serialized, deserialized, hashTreeRoot, serializeModeOn, sszType} = this.props;
        const {showError, outputType} = this.state;

        let serializedStr, deserializedStr, hashTreeRootStr;
        if (serializeModeOn) {
          const serializedOutput = serializeOutputTypes[outputType];
          serializedStr = serialized && serializedOutput ? serializedOutput.dump(serialized) : '';
          hashTreeRootStr = hashTreeRoot && serializedOutput ? serializedOutput.dump(hashTreeRoot) : '';
        } else {
          const deserializedOuput = deserializeOutputTypes[outputType];
          deserializedStr = deserialized && deserializedOuput ? deserializedOuput.dump(deserialized, sszType) : '';
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
                            <NamedOutput name="Serialized" value={serializedStr}/>
                            <NamedOutput name="HashTreeRoot" value={hashTreeRootStr}/>
                          </>
                          :
                          <textarea className='textarea'
                            rows={8}
                            value={deserializedStr || ''}
                            readOnly={true}
                          />
                        }
                    </>
            }
        </div>)
    }
}
