/**
 * The same to writeUIntLE(value.bitLen, 32, 6)
 */
export function writeUInt48LE(view: DataView, offset: number, value: number): void {
  view.setUint8(offset, value & 0xff);
  view.setUint8(offset + 1, (value >>> 8) & 0xff);
  view.setUint8(offset + 2, (value >>> 16) & 0xff);
  view.setUint8(offset + 3, (value >>> 24) & 0xff);
  const high32Value = Math.floor(value / 2 ** 32);
  view.setUint8(offset + 4, high32Value & 0xff);
  view.setUint8(offset + 5, (high32Value >>> 8) & 0xff);
  console.log("@@@ value, value >>> 40", value, value >>> 40);
}