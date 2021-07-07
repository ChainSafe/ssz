import * as React from "react";
import {Type} from "@chainsafe/ssz";
import Output from "./Output";
import Input from "./Input";
import LoadingOverlay from "react-loading-overlay";
import BounceLoader from "react-spinners/BounceLoader";
import {ForkName} from "../util/types";
import { spawn, Thread } from "threads";
import * as threads from "threads";

type Props = {
  serializeModeOn: boolean;
};

type State<T> = {
  name: string;
  input: T;
  sszType: Type<T> | undefined;
  error: string | undefined;
  serialized: Uint8Array | undefined;
  hashTreeRoot: Uint8Array | undefined;
  deserialized: string | undefined;
  showOverlay: boolean;
  overlayText: string;
};

export default class Serialize<T> extends React.Component<Props, State<T>> {
  worker: threads.Worker;
  constructor(props: Props) {
    super(props);
    this.state = {
      forkName: undefined,
      name: "",
      input: undefined,
      deserialized: undefined,
      sszType: undefined,
      error: undefined,
      serialized: undefined,
      hashTreeRoot: undefined,
      showOverlay: false,
      overlayText: "",
    };
    this.worker = new threads.Worker('./worker.tsx', {type: "module"})
  }

  setOverlay(showOverlay: boolean, overlayText = ""): void {
    this.setState({
      showOverlay,
      overlayText,
    });
  }

  async process<T>(
    forkName: ForkName,
    name: string, input: T, type: Type<T>): Promise<void> {

    let error;
    this.setOverlay(true, this.props.serializeModeOn ? "Serializing..." : "Deserializing...");
    const workerInstance = await spawn(this.worker);
    await workerInstance.serialize(name, forkName, input).then((data: {root: Uint8Array, serialized: Uint8Array}) => {
      this.setState({
        hashTreeRoot: data.root,
        serialized: data.serialized
      });
      this.setOverlay(false);
    }).catch((e: { message: string }) => error = e.message);
    await Thread.terminate(workerInstance);

    // note that all bottom nodes are converted to strings, so that they do not have to be formatted,
    // and can be passed through React component properties.

    const deserialized = input;

    this.setState({forkName, name, input, sszType: type, error, deserialized});
  }

  render(): JSX.Element {
    const {sszType, error, serialized, hashTreeRoot, deserialized} = this.state;
    const {serializeModeOn} = this.props;
    const bounceLoader = <BounceLoader css="margin: auto;" />;

    return (
      <div className='section serialize-section is-family-code'>
        <LoadingOverlay
          active={this.state.showOverlay}
          spinner={bounceLoader}
          text={this.state.overlayText}
        >
        </LoadingOverlay>
        <div className='container'>
          <div className='columns is-desktop'>
            <div className='column'>
              <Input
                serializeModeOn={serializeModeOn}
                onProcess={this.process.bind(this)}
                sszType={sszType}
                serialized={serialized}
                deserialized={deserialized}
                setOverlay={this.setOverlay.bind(this)}
                worker={this.worker}
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
                sszTypeName={this.state.name}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
