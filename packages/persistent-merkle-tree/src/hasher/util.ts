import {byteArrayToHashObject, HashObject, hashObjectToByteArray} from "@chainsafe/as-sha256/lib/hashObject";
import {zeroHash} from "../zeroHash";

export function hashObjectToUint8Array(obj: HashObject): Uint8Array {
  const byteArr = new Uint8Array(32);
  hashObjectToByteArray(obj, byteArr, 0);
  return byteArr;
}

export function uint8ArrayToHashObject(byteArr: Uint8Array): HashObject {
  return byteArrayToHashObject(byteArr);
}

type HashIntoFn = (input: Uint8Array, output: Uint8Array) => void;

/**
 * Input data is unsafe because it's modified
 * If its chunk count is not even, need to be appended with zero hash at layer 0 so that we don't need
 * a new memory allocation here (even through we don't need it if padFor = 1)
 * The Uint8Array(32) will be written to output at offset
 */
export function doMerkleizeInto(
  data: Uint8Array,
  padFor: number,
  output: Uint8Array,
  offset: number,
  hashInto: HashIntoFn
): void {
  if (padFor < 1) {
    throw new Error(`Invalid padFor, expect to be greater than 0, got ${padFor}`);
  }

  const layerCount = Math.ceil(Math.log2(padFor));
  if (data.length === 0) {
    output.set(zeroHash(layerCount), offset);
    return;
  }

  if (data.length % 32 !== 0) {
    throw new Error(`Invalid input length, expect to be multiple of 32 bytes, got ${data.length}`);
  }

  // if padFor = 1, only need 32 bytes
  if (padFor > 1 && data.length % 64 !== 0) {
    throw new Error(`Invalid input length, expect to be multiple of 64 bytes, got ${data.length}, padFor=${padFor}`);
  }

  let inputLength = data.length;
  let outputLength = Math.floor(inputLength / 2);
  let bufferIn = data;
  // hash into the same buffer
  for (let i = 0; i < layerCount; i++) {
    const bufferOut = data.subarray(0, outputLength);
    hashInto(bufferIn, bufferOut);
    const chunkCount = Math.floor(outputLength / 32);
    if (chunkCount % 2 === 1 && i < layerCount - 1) {
      // extend to 1 more chunk
      inputLength = outputLength + 32;
      bufferIn = data.subarray(0, inputLength);
      bufferIn.set(zeroHash(i + 1), outputLength);
    } else {
      bufferIn = bufferOut;
      inputLength = outputLength;
    }
    outputLength = Math.floor(inputLength / 2);
  }

  output.set(bufferIn.subarray(0, 32), offset);
}

/**
 * Input data is unsafe because it's modified
 * given nLevel = 3
 * digest multiple of 8 chunks = 256 bytes
 * the result is multiple of 1 chunk = 32 bytes
 * this is the same to hashTreeRoot() of multiple validators
 */
export function doDigestNLevel(data: Uint8Array, nLevel: number, hashInto: HashIntoFn): Uint8Array {
  let inputLength = data.length;
  const bytesInBatch = Math.pow(2, nLevel) * 32;
  if (nLevel < 1) {
    throw new Error(`Invalid nLevel, expect to be greater than 0, got ${nLevel}`);
  }
  if (inputLength % bytesInBatch !== 0) {
    throw new Error(
      `Invalid input length, expect to be multiple of ${bytesInBatch} for nLevel ${nLevel}, got ${inputLength}`
    );
  }

  let outputLength = Math.floor(inputLength / 2);

  // hash into same buffer
  let bufferIn = data;
  for (let i = nLevel; i > 0; i--) {
    const bufferOut = bufferIn.subarray(0, outputLength);
    hashInto(bufferIn, bufferOut);
    bufferIn = bufferOut;
    inputLength = outputLength;
    outputLength = Math.floor(inputLength / 2);
  }

  return bufferIn;
}
