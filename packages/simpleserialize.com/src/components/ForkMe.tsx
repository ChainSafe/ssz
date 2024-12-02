import * as React from "react";
import DarkMode from "../util/darkMode";

export default function ForkMe(): JSX.Element {
  return (
    <div   style={{
      position: "absolute",
      right: 0,
      top: 0,
      display: "flex",
      gap: "10px", // Add spacing between elements
    }}>
      <div style={{ marginTop: "8px", marginRight: "-10px" }}>
    <DarkMode/>  
      </div>
     <a
      href="https://github.com/ChainSafe/ssz/tree/master/packages/simpleserialize.com"
    >
      <img
        width="149"
        height="149"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_orange_ff7600.png?resize=149%2C149"
        className="attachment-full size-full"
        alt="Fork me on GitHub"
        data-recalc-dims="1"
      />
     </a>
    </div>
  );
}
