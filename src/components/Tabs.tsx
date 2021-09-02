import React from "react";
import Serialize from "./Serialize";

type Props = {

};

type State = {
  serializeModeOn: boolean;
};

export default class Tabs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      serializeModeOn: true,
    };
  }

  showSerialize(): void {
    this.setState({serializeModeOn: true});
  }

  showDeserialize(): void {
    this.setState({serializeModeOn: false});
  }

  render(): JSX.Element {
    const {serializeModeOn} = this.state;
    return (
      <>
        <div className="tabs is-centered">
          <ul>
            <li
              className={serializeModeOn ? "is-active" : "is-inactive"}
              onClick={() => this.showSerialize()}
            ><a>Serialize</a></li>
            <li
              className={serializeModeOn ? "is-inactive" : "is-active"}
              onClick={() => this.showDeserialize()}
            ><a>Deserialize</a></li>
          </ul>
        </div>
        <Serialize serializeModeOn={serializeModeOn} />
      </>
    );
  }
}
