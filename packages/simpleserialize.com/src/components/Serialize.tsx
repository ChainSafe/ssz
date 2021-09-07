import * as React from "react";
import {Type} from "@chainsafe/ssz";
import Output from "./Output";
import Input from "./Input";
import LoadingOverlay from "react-loading-overlay";
import BounceLoader from "react-spinners/BounceLoader";
import {ForkName} from "../util/types";
import {ModuleThread, spawn, Thread, Worker} from "threads";
import {SszWorker} from "./worker";

type Props = {
  serializeModeOn: boolean;
};

type State = {
  name: string;
  input: unknown;
  sszType?: Type<unknown>;
  error?: string;
  serialized?: Uint8Array;
  hashTreeRoot?: Uint8Array;
  deserialized: unknown;
  showOverlay: boolean;
  overlayText: string;
  forkName?: ForkName;
};

export default class Serialize extends React.Component<Props, State> {
  worker: Worker;
  serializationWorkerThread: ModuleThread<SszWorker> | undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      input: undefined,
      forkName: undefined,
      name: "",
      deserialized: undefined,
      sszType: undefined,
      error: undefined,
      serialized: undefined,
      hashTreeRoot: undefined,
      showOverlay: false,
      overlayText: "",
    };
    this.worker = new Worker("./worker.js");
  }

  setOverlay(showOverlay: boolean, overlayText = ""): void {
    this.setState({
      showOverlay,
      overlayText,
    });
  }

  async componentDidMount(): Promise<void> {
    this.serializationWorkerThread = await spawn<SszWorker>(this.worker);
  }

  async componentWillUnmount(): Promise<void> {
    await Thread.terminate(this.serializationWorkerThread as ModuleThread<SszWorker>);
  }

  async process(forkName: ForkName, name: string, input: unknown, type: Type<unknown>): Promise<void> {
    let error;
    if (this.props.serializeModeOn) {
      this.setOverlay(true, "Serializing...");
      this.serializationWorkerThread
        ?.serialize(name, forkName, input)
        .then((data: {root: Uint8Array; serialized: Uint8Array}) => {
          this.setState({
            hashTreeRoot: data.root,
            serialized: data.serialized,
          });
          this.setOverlay(false);
        })
        .catch((e: {message: string}) => (error = e.message));
    } else {
      this.setOverlay(false);
    }

    // note that all bottom nodes are converted to strings, so that they do not have to be formatted,
    // and can be passed through React component properties.

    const deserialized = input;

    this.setState({
      forkName,
      name,
      input,
      sszType: type,
      error,
      deserialized,
    });
  }

  render(): JSX.Element {
    const {sszType, error, serialized, hashTreeRoot, deserialized} = this.state;
    const {serializeModeOn} = this.props;
    const bounceLoader = <BounceLoader css="margin: auto;" />;

    return (
      <div className="section serialize-section is-family-code">
        <LoadingOverlay
          active={this.state.showOverlay}
          spinner={bounceLoader}
          text={this.state.overlayText}
        ></LoadingOverlay>
        <div className="container">
          <div className="columns is-desktop">
            <div className="column">
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
            <div className="column">
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
