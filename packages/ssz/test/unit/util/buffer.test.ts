import { expect } from "chai";
import { writeUInt48LE } from "../../../src/util/buffer";
import {toHexString} from "../../../src/util/byteArray";


describe("writeUIntLE", () => {
  it("writeUIntLE using DataView should be the same to using Buffer", () => {
    const value = 2024;
    const buffer = new Uint8Array(32);
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const buf = Buffer.alloc(32, 0);
    writeUInt48LE(view, 0, value);
    buf.writeUIntLE(value, 0, 6);
    expect(toHexString(buffer)).to.be.deep.equal(`0x${buf.toString("hex")}`);
  });
});