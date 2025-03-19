import {describe, expect, it} from "vitest";

describe("Mutability Buffer, Uint8Array", () => {
  it("Ensure Uint8Array.slice copies memory", () => {
    const len = 64;
    const index = 54;
    const newValue = 1;

    const u1 = new Uint8Array(len);
    const u2 = u1.slice(0);
    u2[index] = newValue;

    expect(u1[index]).to.equal(0, "u1 should have original value");
    expect(u2[index]).to.equal(newValue, "u2 should have new value");
  });

  // Buffer.prototype.slice does not copy memory, Enforce Uint8Array usage https://github.com/nodejs/node/issues/28087
  it("Ensure Buffer does not copy memory", () => {
    const len = 64;
    const index = 54;
    const newValue = 1;

    const u1 = Buffer.alloc(len, 0);
    const u2 = u1.slice(0);
    u2[index] = newValue;

    expect(u1[index]).to.equal(newValue, "u1 should have new value");
    expect(u2[index]).to.equal(newValue, "u2 should have new value");
  });
});
