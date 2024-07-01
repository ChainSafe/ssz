import {expect} from "chai";

type BufferLike = string | Uint8Array | Buffer;

export function toHexString(bytes: BufferLike): string {
  if (typeof bytes === "string") return bytes;
  if (bytes instanceof Buffer) return bytes.toString("hex");
  if (bytes instanceof Uint8Array) return Buffer.from(bytes).toString("hex");
  throw Error("toHexString only accepts BufferLike types");
}

export function toHex(bytes: BufferLike): string {
  const hex = toHexString(bytes);
  if (hex.startsWith("0x")) return hex;
  return "0x" + hex;
}

export function expectEqualHex(value: BufferLike, expected: BufferLike): void {
  expect(toHex(value)).to.be.equal(toHex(expected));
}
