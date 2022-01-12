import jsyaml from "js-yaml";

/* eslint-disable quotes */

describe("JSON loader", () => {
  it("Load JSON", () => {
    const res = jsyaml.load('num: "1234"');
    console.log(res);
  });
});
