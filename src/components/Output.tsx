import * as React from "react";
import NamedOutput from "./display/NamedOutput";
import ErrorBox from "./display/ErrorBox";
import { ChangeEvent } from "react";

import {serializeOutputTypes, deserializeOutputTypes} from "../util/output_types";


type Props = {
    error: string | undefined;
    serialized: Uint8Array | undefined;
    hashTreeRoot: Uint8Array | undefined;
    serializeModeOn: boolean
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

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        return {showError: !!nextProps.error}
    }

    hideError() {
        this.setState({showError: false})
    }

    setOutputType(e: ChangeEvent<HTMLSelectElement>) {
      this.setState({outputType: e.target.value});
    }

    render() {
        const {error, serialized, hashTreeRoot, serializeModeOn} = this.props;
        const {showError} = this.state;

        const serializedStr = serialized ? serializeOutputTypes[this.state.outputType].dump(serialized) : '';
        const hashTreeRootStr = hashTreeRoot ? serializeOutputTypes[this.state.outputType].dump(hashTreeRoot) : '';

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
                                value={this.state.outputType}
                                onChange={this.setOutputType.bind(this)}>
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
                          <NamedOutput name="Serialized" value={serializedStr}/>
                          :
                          <textarea className='textarea'
                            rows={8}
                            value={serializedStr || ''}
                            readOnly={true}
                          />
                        }
                        {serializeModeOn && <NamedOutput name="HashTreeRoot" value={hashTreeRootStr}/>}
                    </>
            }
        </div>)
    }
}
