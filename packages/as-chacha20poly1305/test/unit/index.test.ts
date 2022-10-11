import {expect} from "chai";
import {stream} from "../../src/index";

describe("chacha", function () {
  it("512 bytes", function () {
    const input = new Uint8Array(Array.from({length: 512}, () => 1));
    const output = stream(input);
    for (let i = 0; i < 512; i++) {
      expect(output[i]).to.be.equal(2);
    }
  });
});
