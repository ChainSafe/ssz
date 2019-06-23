import * as React from "react";
import NamedHex from "./display/NamedHex";
import ErrorBox from "./display/ErrorBox";


type Props = {
    error: string | undefined;
    serialized: string | undefined;
    hashTreeRoot: string | undefined;
}

type State = {
    showError: boolean;
}

export default class Output extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showError: false
        };
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        return {showError: !!nextProps.error}
    }

    hideError() {
        this.setState({showError: false})
    }

    render() {
        const {error, serialized, hashTreeRoot} = this.props;
        const {showError} = this.state;

        return (<div className='container'>
            <h3 className='subtitle'>Output</h3>
            {
                showError
                    ? <ErrorBox error={error} hideError={this.hideError.bind(this)}/>
                    :
                    <>
                        <NamedHex name="Serialized" value={serialized}/>
                        <NamedHex name="HashTreeRoot" value={hashTreeRoot}/>
                    </>
            }
        </div>)
    }
}
