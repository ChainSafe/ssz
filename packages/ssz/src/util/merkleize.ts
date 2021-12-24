import SHA256 from "@chainsafe/as-sha256";
import {hash} from "./hash";
import {zeroNode} from "./zeros";

export function merkleizeSingleBuff(chunksBuff: Uint8Array, padFor?: number): Uint8Array {
  let chunkCount = Math.ceil(chunksBuff.length / 32);

  const layerCount = bitLength(nextPowerOf2(padFor ?? chunkCount) - 1);
  if (chunkCount == 0) {
    return zeroNode(layerCount);
  }

  // Instead of pushing on all padding zero chunks at the leaf level
  // we push on zero hash chunks at the highest possible level to avoid over-hashing
  for (let l = 0; l < layerCount; l++) {
    const padCount = chunkCount % 2;
    const paddedChunkCount = chunkCount + padCount;

    // if the chunks.length is odd
    // we need to push on the zero-hash of that level to merkleize that level
    for (let i = 0; i < padCount; i++) {
      chunksBuff.set(zeroNode(l), 32 * (chunkCount + i));
    }

    for (let i = 0; i < paddedChunkCount; i += 2) {
      const root = SHA256.digest64(chunksBuff.slice(32 * i, 32 * (i + 2)));
      chunksBuff.set(root, (32 * i) / 2);
    }

    chunkCount = paddedChunkCount / 2;
  }

  return chunksBuff.slice(0, 32);
}

export function merkleize(chunks: Uint8Array[], padFor?: number): Uint8Array {
  const layerCount = bitLength(nextPowerOf2(padFor ?? chunks.length) - 1);
  if (chunks.length == 0) {
    return zeroNode(layerCount);
  }

  let chunkCount = chunks.length;

  // Instead of pushing on all padding zero chunks at the leaf level
  // we push on zero hash chunks at the highest possible level to avoid over-hashing
  for (let l = 0; l < layerCount; l++) {
    const padCount = chunkCount % 2;
    const paddedChunkCount = chunkCount + padCount;

    // if the chunks.length is odd
    // we need to push on the zero-hash of that level to merkleize that level
    for (let i = 0; i < padCount; i++) {
      chunks[chunkCount + i] = zeroNode(l);
    }

    for (let i = 0; i < paddedChunkCount; i += 2) {
      chunks[i / 2] = hash(chunks[i], chunks[i + 1]);
    }

    chunkCount = paddedChunkCount / 2;
  }

  return chunks[0];
}

/** @ignore */
export function mixInLength(root: Buffer, length: number): Buffer {
  const lengthBuf = Buffer.alloc(32);
  lengthBuf.writeUIntLE(length, 0, 6);
  const h = hash(root, lengthBuf);
  return Buffer.from(h.buffer, h.byteOffset, h.byteLength);
}

// x2 faster than bitLengthStr()
export function bitLength(i: number): number {
  if (i === 0) {
    return 0;
  }

  return Math.floor(Math.log2(i)) + 1;
}

export function bitLengthStr(n: number): number {
  // Make this more efficient
  const bitstring = n.toString(2);
  if (bitstring === "0") {
    return 0;
  }
  return bitstring.length;
}

/** @ignore */
export function nextPowerOf2(n: number): number {
  return n <= 0 ? 1 : Math.pow(2, bitLength(n - 1));
}

/** @ignore */
export function previousPowerOf2(n: number): number {
  return n === 0 ? 1 : Math.pow(2, bitLength(n) - 1);
}
