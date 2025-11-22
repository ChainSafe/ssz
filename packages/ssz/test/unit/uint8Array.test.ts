import {describe, expect, it} from "vitest";
import { slice } from "../../src/util/byteArray.ts";

describe("slice", () => {
  it("Ensure slice copies memory with reuseBytes == false", () => {
    const len = 64;
    const index = 54;
    const newValue = 1;

    const u1 = new Uint8Array(len);
    const u2 = slice(u1, 0, u1.length, false);
    u2[index] = newValue;

    expect(u1[index]).to.equal(0, "u1 should have original value");
    expect(u2[index]).to.equal(newValue, "u2 should have new value");
  });
  it("Ensure slice does not copy memory with reuseBytes == true", () => {
    const len = 64;
    const index = 54;
    const newValue = 1;

    const u1 = new Uint8Array(len);
    const u2 = slice(u1, 0, u1.length, true);
    u2[index] = newValue;

    expect(u1[index]).to.equal(newValue, "u1 should have new value");
    expect(u2[index]).to.equal(newValue, "u2 should have new value");
  });
});
