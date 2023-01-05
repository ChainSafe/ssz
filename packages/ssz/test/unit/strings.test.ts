import {expect} from "chai";

import {Case} from "../../src/util/strings";
import {KeyCase} from "../../src/type/container";
const testCases = ["fooBar", "foo1Bar", "fooBarBaz", "foo1Bar2Baz"];
const expectedResults: {[key in KeyCase]: string[]} = {
  snake: ["foo_bar", "foo1_bar", "foo_bar_baz", "foo1_bar2_baz"],
  eth2: ["foo_bar", "foo1_bar", "foo_bar_baz", "foo1_bar2_baz"],
  pascal: ["FooBar", "Foo1Bar", "FooBarBaz", "Foo1Bar2Baz"],
  camel: ["fooBar", "foo1Bar", "fooBarBaz", "foo1Bar2Baz"],
  constant: ["FOO_BAR", "FOO1_BAR", "FOO_BAR_BAZ", "FOO1_BAR2_BAZ"],
  header: ["Foo-Bar", "Foo1-Bar", "Foo-Bar-Baz", "Foo1-Bar2-Baz"],
};

const keys = Object.keys(expectedResults) as KeyCase[];
for (const key of keys) {
  describe(`should convert string to ${key} case`, () => {
    for (let x = 0; x < 4; x++) {
      const field: string = Case[key as KeyCase](testCases[x]);
      it(`should convert to ${expectedResults[key as KeyCase][x]}`, () => {
        expect(field).to.equal(expectedResults[key][x]);
      });
    }
  });
};