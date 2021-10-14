import {expect} from "chai";

describe("Uint8Array", () => {
  it("Copy Uint8Array and not mutate", () => {
    const len = 64;
    const index = 54;
    const newValue = 1;

    const u1 = new Uint8Array(len);
    const u2 = u1.slice(0);
    u2[index] = newValue;

    expect(u1[index]).to.equal(0, "u1 should have original value");
    expect(u2[index]).to.equal(newValue, "u2 should have new value");
  });
});
