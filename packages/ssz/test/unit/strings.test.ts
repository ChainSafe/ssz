import {describe, expect, it} from "vitest";

import {KeyCase} from "../../src/type/container.js";
import {Case} from "../../src/util/strings.js";
const testCases = ["fooBar", "foo1Bar", "fooBarBaz", "foo1Bar2Baz", "fooBar1"];
const expectedResults: {[key in KeyCase]: string[]} = {
  snake: ["foo_bar", "foo1_bar", "foo_bar_baz", "foo1_bar2_baz", "foo_bar1"],
  eth2: ["foo_bar", "foo1_bar", "foo_bar_baz", "foo1_bar2_baz", "foo_bar_1"],
  pascal: ["FooBar", "Foo1Bar", "FooBarBaz", "Foo1Bar2Baz", "FooBar1"],
  camel: ["fooBar", "foo1Bar", "fooBarBaz", "foo1Bar2Baz", "fooBar1"],
  constant: ["FOO_BAR", "FOO1_BAR", "FOO_BAR_BAZ", "FOO1_BAR2_BAZ", "FOO_BAR1"],
  header: ["Foo-Bar", "Foo1-Bar", "Foo-Bar-Baz", "Foo1-Bar2-Baz", "Foo-Bar1"],
};

const keys = Object.keys(expectedResults) as KeyCase[];
for (const key of keys) {
  describe(`should convert string to ${key} case`, () => {
    for (let x = 0; x < 5; x++) {
      const field: string = Case[key as KeyCase](testCases[x]);
      it(`should convert to ${expectedResults[key as KeyCase][x]}`, () => {
        expect(field).to.equal(expectedResults[key][x]);
      });
    }
  });
}
