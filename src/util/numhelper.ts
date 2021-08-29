export function copyFromBuf32LE(source: Buffer, target: Uint8Array, offset: number): void {
  //unrolled fast copy
  target[3 + offset] = source[3];
  target[2 + offset] = source[2];
  target[1 + offset] = source[1];
  target[0 + offset] = source[0];
}

export function copyToBuf32LE(source: Uint8Array, target: Buffer, offset: number): void {
  //unrolled fast copy
  target[3] = source[3 + offset];
  target[2] = source[2 + offset];
  target[1] = source[1 + offset];
  target[0] = source[0 + offset];
}

export function copyFromBuf64LE(source: Buffer, target: Uint8Array, length: number, offset: number): void {
  //unrolled fast copy
  switch (length) {
    case 8:
      target[7 + offset] = source[7];
    /* falls through */
    case 7:
      target[6 + offset] = source[6];
    /* falls through */
    case 6:
      target[5 + offset] = source[5];
    /* falls through */
    case 5:
      target[4 + offset] = source[4];
    /* falls through */
    case 4:
      target[3 + offset] = source[3];
    /* falls through */
    case 3:
      target[2 + offset] = source[2];
    /* falls through */
    case 2:
      target[1 + offset] = source[1];
    /* falls through */
    case 1:
      target[0 + offset] = source[0];
    /* falls through */
    default:
  }
}

export function copyToBuf64LE(source: Uint8Array, target: Buffer, length: number, offset: number): void {
  switch (
    length //we need to unroll it for fast computation, buffer copy/looping takes too much time
  ) {
    case 8:
      target[7] = source[7 + offset];
    /* falls through */
    case 7:
      target[6] = source[6 + offset];
    /* falls through */
    case 6:
      target[5] = source[5 + offset];
    /* falls through */
    case 5:
      target[4] = source[4 + offset];
    /* falls through */
    case 4:
      target[3] = source[3 + offset];
    /* falls through */
    case 3:
      target[2] = source[2 + offset];
    /* falls through */
    case 2:
      target[1] = source[1 + offset];
    /* falls through */
    case 1:
      target[0] = source[0 + offset];
    /* falls through */
    default:
  }
  switch (
    length //zero the rest
  ) {
    case 1:
      target[1] = 0;
    /* falls through */
    case 2:
      target[2] = 0;
    /* falls through */
    case 3:
      target[3] = 0;
    /* falls through */
    case 4:
      target[4] = 0;
    /* falls through */
    case 5:
      target[5] = 0;
    /* falls through */
    case 6:
      target[6] = 0;
    /* falls through */
    case 7:
      target[7] = 0;
    /* falls through */
    default:
  }
}

const workingABuf = new ArrayBuffer(8);
const wbuffer = Buffer.from(workingABuf);
const wView = new DataView(workingABuf);

const TWO_POWER_32 = 2 ** 32;

export function getBytesFromNumberLE(value: number, result: Uint8Array, length: number, offset: number): void {
  // let mvalue;
  length = Math.min(length, 8);
  wView.setUint32(0, value, true);
  if (length > 4) {
    let mvalue = 0;
    if (value >= TWO_POWER_32) mvalue = Math.floor(value / TWO_POWER_32);
    wView.setUint32(4, mvalue, true);
  }
  copyFromBuf64LE(wbuffer, result, length, offset);
}

export function getBytesFromNumberLE32(value: number, result: Uint8Array, offset: number): void {
  // let mvalue;
  wView.setUint32(0, value, true);
  copyFromBuf32LE(wbuffer, result, offset);
}

export function getNumberFromBytesLE(data: Uint8Array, length: number, offset = 0, ignoreUnsafe = true): number {
  let isbigint = false,
    combined,
    left;

  length = Math.min(length, 8);
  if (!ignoreUnsafe) {
    if (length > 6)
      isbigint = data[6] > 31 || data.slice(7, length).reduce((acc, vrow) => acc || vrow > 0, false as boolean);

    if (isbigint) throw new Error("UnSafeInteger");
  }

  copyToBuf64LE(data, wbuffer, length, offset);

  combined = wView.getUint32(0, true);
  if (length > 4) {
    left = wView.getUint32(4, true);
    if (left > 0) combined = TWO_POWER_32 * left + combined;
  }
  return combined;
}

export function getNumberFromBytesLE32(data: Uint8Array, offset = 0): number {
  copyToBuf32LE(data, wbuffer, offset);
  return wView.getUint32(0, true);
}
