import {expect} from "chai";
import jsyaml from "js-yaml";
import {readYamlNumbersAsStrings} from "../spec/testRunner";
import {BeaconBlockHeader} from "../lodestarTypes/phase0/sszTypes";
import {toHexString} from "../../src";

/* eslint-disable quotes */

describe("JSON loader", () => {
  it("Load YAML string number", () => {
    expect(jsyaml.load('num: "1234"')).to.deep.equal({num: "1234"});
  });

  it("Load YAML number", () => {
    // We don't want this to happen, because some numbers are too big for JS
    expect(jsyaml.load("num: 1234")).to.deep.equal({num: 1234});
  });

  it("Load YAML number with readYamlNumbersAsStrings", () => {
    expect(readYamlNumbersAsStrings("num: 1234")).to.deep.equal({num: 1234n});
  });

  it("Load single number", () => {
    const str = "'0'\n";
    const yaml = readYamlNumbersAsStrings(str);
    expect(yaml).to.equal("0");
  });

  it("fromJson case", () => {
    const rootHex = toHexString(Buffer.alloc(32, 0xaa));
    BeaconBlockHeader.fromJson(
      {
        slot: 1,
        proposer_index: 1,
        parent_root: rootHex,
        state_root: rootHex,
        body_root: rootHex,
      },
      {case: "snake"}
    );
  });
});
