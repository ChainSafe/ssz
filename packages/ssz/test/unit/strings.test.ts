import {expect} from "chai";

import {Case} from "../../src/util/strings";

const testCases = ["fooBar", "foo1Bar"];
describe("should convert strings to snake case", () => {
  it("should convert to foo_bar", () => {
    const field = Case.snake(testCases[0]);
    expect(field).to.equal("foo_bar");
  });
  it("should convert to foo1_bar", () => {
    const field = Case.snake(testCases[1]);
    expect(field).to.equal("foo1_bar");
  });
});

describe("should convert strings to pascal case", () => {
  it("should convert to FooBar", () => {
    const field = Case.pascal(testCases[0]);
    expect(field).to.equal("FooBar");
  });
  it("should convert to Foo1Bar", () => {
    const field = Case.pascal(testCases[1]);
    expect(field).to.equal("Foo1Bar");
  });
});

describe("should convert strings to camel case", () => {
  it("should convert to fooBar", () => {
    const field = Case.camel(testCases[0]);
    expect(field).to.equal("fooBar");
  });
  it("should convert to foo1Bar", () => {
    const field = Case.camel(testCases[1]);
    expect(field).to.equal("foo1Bar");
  });
});

describe("should convert strings to constant case", () => {
  it("should convert to FOO_BAR", () => {
    const field = Case.constant(testCases[0]);
    expect(field).to.equal("FOO_BAR");
  });
  it("should convert to FOO1_BAR", () => {
    const field = Case.constant(testCases[1]);
    expect(field).to.equal("FOO1_BAR");
  });
});

describe("should convert strings to header case", () => {
  it("should convert to Foo-Bar", () => {
    const field = Case.header(testCases[0]);
    expect(field).to.equal("Foo-Bar");
  });
  it("should convert to Foo1-Bar", () => {
    const field = Case.header(testCases[1]);
    expect(field).to.equal("Foo1-Bar");
  });
});
