import {hash} from "./hash";
import {zeroNode} from "./zeros";

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

export function merkleizeSingleBuff(chunksBuff: Uint8Array, padFor?: number): Uint8Array {
  // TODO: Optimize
  const chunkCount = Math.ceil(chunksBuff.length / 32);
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < chunkCount; i++) {
    const chunk = new Uint8Array(32);
    chunk.set(chunksBuff.slice(i * 32, (i + 1) * 32));
    chunks.push(chunk);
  }

  return merkleize(chunks, padFor);

  // TODO:
  // let chunkCount = Math.ceil(chunksBuff.length / 32);
  // console.log({chunkCount, padFor, len: chunksBuff.length});

  // const layerCount = bitLength(nextPowerOf2(padFor ?? chunkCount) - 1);
  // if (chunkCount == 0) {
  //   return zeroNode(layerCount);
  // }

  // const roots: Uint8Array[] = [];

  // // Instead of pushing on all padding zero chunks at the leaf level
  // // we push on zero hash chunks at the highest possible level to avoid over-hashing
  // for (let l = 0; l < layerCount; l++) {
  //   const padCount = chunkCount % 2;

  //   for (let i = 0; i < chunkCount; i += 2) {
  //     roots.push(SHA256.digest(chunksBuff.slice(32 * i, 32 * (i + 2))));
  //   }

  //   // if the chunks.length is odd
  //   // we need to push on the zero-hash of that level to merkleize that level
  //   if (padCount > 0) {
  //     roots.push(SHA256.digest(Buffer.concat([chunksBuff.slice(32 * chunkCount, 32 * (chunkCount + 1)), zeroNode(l)])));
  //   }
  //   console.log({l, padCount, chunkCount}, roots);

  //   chunkCount = (chunkCount + padCount) / 2;
  // }

  // // If output is too small, pad to 32. hash .concat() assumes all inputs are exactly 32 bytes
  // // TODO: Make hash() accept output of <= 32 and autopad on copy.
  // if (chunksBuff.length < 32) {
  //   const out = new Uint8Array(32);
  //   out.set(chunksBuff);
  //   return out;
  // } else {
  //   return chunksBuff.slice(0, 32);
  // }
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
export function mixInLength(root: Uint8Array, length: number): Uint8Array {
  const lengthBuf = Buffer.alloc(32);
  lengthBuf.writeUIntLE(length, 0, 6);
  return hash(root, lengthBuf);
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
