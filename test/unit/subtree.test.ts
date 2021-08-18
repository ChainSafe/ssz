import {expect} from "chai";

import {subtreeFillToContents, LeafNode} from "../../src";

describe("subtreeFillToContents", () => {
  it("should not error on contents length 1", () => {
    try {
      subtreeFillToContents([new LeafNode(new Uint8Array(32))], 1);
    } catch (e) {
      expect.fail(e);
    }
  });

  it("should not error on empty contents", () => {
    try {
      subtreeFillToContents([], 0);
      subtreeFillToContents([], 1);
    } catch (e) {
      expect.fail(e);
    }
  });

  it("should not error on depth 31", () => {
    try {
      subtreeFillToContents([], 31);
    } catch (e) {
      expect.fail(e);
    }
  });
});
