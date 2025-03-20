import * as React from "react";

const SPEC_VERSION = "1.4.0";

export default function Header(): JSX.Element {
  return (
    <div className="section">
      <div className="container">
        <h1 className="title is-family-code">
          Simple Serialize
          <span className="is-size-6">
            <img src={`https://img.shields.io/badge/Consensus_Spec_Version-${SPEC_VERSION}-2e86c1.svg`} />
          </span>
        </h1>
        <p>
          Simple Serialize (SSZ) is a serialization and merkleization standard created specifically for Ethereum
          consensus. Find the specification{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://github.com/ethereum/consensus-specs/blob/v${SPEC_VERSION}/ssz/simple-serialize.md`}
          >
            here.
          </a>
        </p>
      </div>
    </div>
  );
}
