import {byteArrayToHashObject, HashObject, hashObjectToByteArray} from "@chainsafe/as-sha256/hashObject";
import {zeroHash} from "../zeroHash.js";

export function hashObjectToUint8Array(obj: HashObject): Uint8Array {
  const byteArr = new Uint8Array(32);
  hashObjectToByteArray(obj, byteArr, 0);
  return byteArr;
}

export function uint8ArrayToHashObject(byteArr: Uint8Array): HashObject {
  return byteArrayToHashObject(byteArr, 0);
}

type HashIntoFn = (input: Uint8Array, output: Uint8Array) => void;

/** a SHA256 block is 64 bytes */
export const BLOCK_SIZE = 64;

/**
 * Merkleize multiple SHA256 blocks in a single Uint8Array into ${output} at ${offset}
 *   - if padFor > 1 blocksBytes need to be multiple of 64 bytes.
 *   - if padFor = 1, blocksBytes need to be at least 32 bytes
 *   - if padFor = 0, throw error
 * blocksBytes is unsafe because it's modified
 */
export function doMerkleizeBlocksBytes(
  blocksBytes: Uint8Array,
  padFor: number,
  output: Uint8Array,
  offset: number,
  hashInto: HashIntoFn
): void {
  if (padFor < 1) {
    throw new Error(`Invalid padFor, expect to be greater than 0, got ${padFor}`);
  }

  const layerCount = Math.ceil(Math.log2(padFor));
  if (blocksBytes.length === 0) {
    output.set(zeroHash(layerCount), offset);
    return;
  }

  if (blocksBytes.length % 32 !== 0) {
    throw new Error(`Invalid input length, expect to be multiple of 32 bytes, got ${blocksBytes.length}`);
  }

  // if padFor = 1, only need 32 bytes
  if (padFor > 1 && blocksBytes.length % BLOCK_SIZE !== 0) {
    throw new Error(
      `Invalid input length, expect to be multiple of 64 bytes, got ${blocksBytes.length}, padFor=${padFor}`
    );
  }

  let inputLength = blocksBytes.length;
  let outputLength = Math.floor(inputLength / 2);
  let bufferIn = blocksBytes;
  // hash into the same buffer to save memory allocation
  for (let layer = 0; layer < layerCount; layer++) {
    const bufferOut = blocksBytes.subarray(0, outputLength);
    hashInto(bufferIn, bufferOut);
    const chunkCount = Math.floor(outputLength / 32);
    if (chunkCount % 2 === 1 && layer < layerCount - 1) {
      // extend to 1 more chunk
      inputLength = outputLength + 32;
      bufferIn = blocksBytes.subarray(0, inputLength);
      bufferIn.set(zeroHash(layer + 1), outputLength);
    } else {
      bufferIn = bufferOut;
      inputLength = outputLength;
    }
    outputLength = Math.floor(inputLength / 2);
  }

  output.set(bufferIn.subarray(0, 32), offset);
}

/**
 * Merkleize multiple SHA256 blocks into ${output} at ${offset}
 * @param blockLimit number of blocks, should be <= blocks.length so that consumer can reuse memory
 * @param padFor is maxChunkCount, should be >= 2
 * @param blocks is unsafe because it's modified
 * @param output the result is stored here
 * @param offset the offset to store the result
 * @param hashInto the hash function of each hasher
 * @param buffer is a temporary buffer of each hasher to work with the hashInto() function
 */
export function doMerkleizeBlockArray(
  blocks: Uint8Array[],
  blockLimit: number,
  padFor: number,
  output: Uint8Array,
  offset: number,
  hashInto: HashIntoFn,
  buffer: Uint8Array
): void {
  if (padFor < 1) {
    throw new Error(`Invalid padFor, expect to be at least 1, got ${padFor}`);
  }

  if (blockLimit > blocks.length) {
    throw new Error(
      `Invalid blockLimit, expect to be less than or equal blocks.length ${blocks.length}, got ${blockLimit}`
    );
  }

  const layerCount = Math.ceil(Math.log2(padFor));
  if (blockLimit === 0) {
    output.set(zeroHash(layerCount), offset);
    return;
  }

  for (const block of blocks) {
    if (block.length !== BLOCK_SIZE) {
      throw new Error(`Invalid block length, expect to be 64 bytes, got ${block.length}`);
    }
  }

  // as-sha256 has a buffer of 4 * 64 bytes
  // hashtree has a buffer of 16 * 64 bytes
  if (buffer.length === 0 || buffer.length % (4 * BLOCK_SIZE) !== 0) {
    throw new Error(`Invalid buffer length, expect to be multiple of 64 bytes, got ${buffer.length}`);
  }

  // batchSize is 4 for as-sha256, 16 for hashtree
  const batchSize = Math.floor(buffer.length / BLOCK_SIZE);
  const halfBatchSize = Math.floor(batchSize / 2);
  let bufferIn = buffer;
  // hash into the same buffer
  let bufferOut = buffer.subarray(0, halfBatchSize * BLOCK_SIZE);
  // ignore remaining blocks
  let blockCount = blockLimit;
  // hash into the same blocks to save memory allocation
  for (let layer = 0; layer < layerCount; layer++) {
    let outBlockIndex = 0;
    const sameLayerLoop = Math.floor(blockCount / batchSize);
    for (let i = 0; i < sameLayerLoop; i++) {
      // populate bufferIn
      for (let j = 0; j < batchSize; j++) {
        const blockIndex = i * batchSize + j;
        bufferIn.set(blocks[blockIndex], j * BLOCK_SIZE);
      }

      // hash into bufferOut
      hashInto(bufferIn, bufferOut);

      // copy bufferOut to blocks, bufferOut.len = halfBatchSize * BLOCK_SIZE
      for (let j = 0; j < halfBatchSize; j++) {
        blocks[outBlockIndex].set(bufferOut.subarray(j * BLOCK_SIZE, (j + 1) * BLOCK_SIZE));
        outBlockIndex++;
      }
    }

    // remaining blocks
    const remainingBlocks = blockCount % batchSize;
    bufferIn = buffer.subarray(0, remainingBlocks * BLOCK_SIZE);
    bufferOut = buffer.subarray(0, Math.floor(bufferIn.length / 2));

    // populate bufferIn
    for (let blockIndex = Math.floor(blockCount / batchSize) * batchSize; blockIndex < blockCount; blockIndex++) {
      bufferIn.set(blocks[blockIndex], (blockIndex % batchSize) * BLOCK_SIZE);
    }

    // hash into bufferOut
    hashInto(bufferIn, bufferOut);

    // copy bufferOut to blocks, note that bufferOut.len may not be divisible by BLOCK_SIZE
    for (let j = 0; j < Math.floor(bufferOut.length / BLOCK_SIZE); j++) {
      blocks[outBlockIndex].set(bufferOut.subarray(j * BLOCK_SIZE, (j + 1) * BLOCK_SIZE));
      outBlockIndex++;
    }

    if (bufferOut.length % BLOCK_SIZE !== 0) {
      // set the last 32 bytes of bufferOut
      blocks[outBlockIndex].set(bufferOut.subarray(bufferOut.length - 32, bufferOut.length), 0);
      // add zeroHash
      blocks[outBlockIndex].set(zeroHash(layer + 1), 32);
      outBlockIndex++;
    }

    // end of layer, update blockCount, bufferIn, bufferOut
    blockCount = outBlockIndex;
    bufferIn = buffer.subarray(0, blockCount * BLOCK_SIZE);
    bufferOut = buffer.subarray(0, Math.floor(bufferIn.length / 2));
  }

  // the end result stays in blocks[0]
  output.set(blocks[0].subarray(0, 32), offset);
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
