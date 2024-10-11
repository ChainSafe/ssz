import {hasher, zeroHash} from "@chainsafe/persistent-merkle-tree";

/** Dedicated property to cache hashTreeRoot of immutable CompositeType values */
export const symbolCachedPermanentRoot = Symbol("ssz_cached_permanent_root");

/** Helper type to cast CompositeType values that may have @see symbolCachedPermanentRoot */
export type ValueWithCachedPermanentRoot = {
  [symbolCachedPermanentRoot]?: Uint8Array;
};

export function hash64(bytes32A: Uint8Array, bytes32B: Uint8Array): Uint8Array {
  return hasher.digest64(bytes32A, bytes32B);
}

export function merkleize(chunks: Uint8Array[], padFor: number): Uint8Array {
  const layerCount = bitLength(nextPowerOf2(padFor) - 1);
  if (chunks.length == 0) {
    return zeroHash(layerCount);
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
      chunks[chunkCount + i] = zeroHash(l);
    }

    for (let i = 0; i < paddedChunkCount; i += 2) {
      chunks[i / 2] = hash64(chunks[i], chunks[i + 1]);
    }

    chunkCount = paddedChunkCount / 2;
  }

  return chunks[0];
}

/** @ignore */
export function mixInLength(root: Uint8Array, length: number): Uint8Array {
  const lengthBuf = Buffer.alloc(32);
  lengthBuf.writeUIntLE(length, 0, 6);
  return hash64(root, lengthBuf);
}

// x2 faster than bitLengthStr() which uses Number.toString(2)
export function bitLength(i: number): number {
  if (i === 0) {
    return 0;
  }

  return Math.floor(Math.log2(i)) + 1;
}

/**
 * Given maxChunkCount return the chunkDepth
 * ```
 * n: [0,1,2,3,4,5,6,7,8,9]
 * d: [0,0,1,2,2,3,3,3,3,4]
 * ```
 */
export function maxChunksToDepth(n: number): number {
  if (n === 0) return 0;
  return Math.ceil(Math.log2(n));
}

/** @ignore */
export function nextPowerOf2(n: number): number {
  return n <= 0 ? 1 : Math.pow(2, bitLength(n - 1));
}
