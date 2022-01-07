/** Globally cache this information. @see getUint8ByteToBitBooleanArray */
const uint8ByteToBitBooleanArrays: boolean[][] = [];

/**
 * Given a byte (0 -> 255), return a Array of boolean with length = 8, big endian.
 * Ex: 1 => [true false false false false false false false]
 *     5 => [true false true false false fase false false]
 */
export function getUint8ByteToBitBooleanArray(byte: number): boolean[] {
  if (!uint8ByteToBitBooleanArrays[byte]) {
    uint8ByteToBitBooleanArrays[byte] = computeUint8ByteToBitBooleanArray(byte);
  }
  return uint8ByteToBitBooleanArrays[byte];
}

/** @see getUint8ByteToBitBooleanArray */
function computeUint8ByteToBitBooleanArray(byte: number): boolean[] {
  // this returns little endian
  const binaryStr = byte.toString(2);
  const binaryLength = binaryStr.length;
  const bits: boolean[] = [];
  for (let i = 0; i < 8; i++) {
    if (i < binaryLength) {
      bits.push(binaryStr[binaryLength - i - 1] === "1" ? true : false);
    } else {
      bits.push(false);
    }
  }
  return bits;
}

/**
 * BitList may be represented as an array of bits or compressed into an array of bytes.
 *
 * **Array of bits**:
 * Require 8.87 bytes per bit, so for 512 bits = 4500 bytes.
 * Are 'faster' to iterate with native tooling but are as fast as array of bytes with precomputed caches.
 *
 * **Array of bytes**:
 * Require an average cost of Uint8Array in JS = 220 bytes for 32 bytes, so for 512 bits = 220 bytes.
 * With precomputed boolean arrays per bytes value are as fast to iterate as an array of bits above.
 *
 * This BitList implementation will represent data as a Uint8Array since it's very cheap to deserialize and can be as
 * fast to iterate as a native array of booleans, precomputing boolean arrays (total memory cost of 16000 bytes).
 */
export class BitArray {
  constructor(readonly uint8Array: Uint8Array, readonly bitLen: number) {
    if (uint8Array.length !== Math.ceil(bitLen / 8)) {
      throw Error("BitArray uint8Array length does not match bitLen");
    }
  }

  get(bitIndex: number): boolean {
    const byteIdx = Math.floor(bitIndex / 8);
    const bitInBit = bitIndex % 8;
    const mask = 1 << bitInBit;
    return (this.uint8Array[byteIdx] & mask) === 1;
  }

  set(bitIndex: number, bit: boolean): void {
    if (bitIndex > this.bitLen) {
      throw Error("BitArray bitLen is immutable");
    }

    const byteIdx = Math.floor(bitIndex / 8);
    const bitInBit = bitIndex % 8;
    const mask = 1 << bitInBit;
    let byte = this.uint8Array[byteIdx];
    if (bit) {
      // For bit in byte, 1,0 OR 1 = 1
      // byte 100110
      // mask 010000
      // res  110110
      byte |= mask;
      this.uint8Array[byteIdx] = byte;
    } else {
      // For bit in byte, 1,0 OR 1 = 0
      if ((byte & mask) === mask) {
        // byte 110110
        // mask 010000
        // res  100110
        byte ^= mask;
        this.uint8Array[byteIdx] = byte;
      } else {
        // Ok, bit is already 0
      }
    }
  }

  /**
   * Split array of values between participants and no participants
   * @returns [yes, no]
   */
  intersectValues<T>(values: T[]): {yes: T[]; no: T[]} {
    const yes = [];
    const no = [];

    if (values.length > this.bitLen) {
      throw Error(`Must not intersect values of length ${values.length} > bitLen ${this.bitLen}`);
    }

    // Iterate over each byte of bits
    const bytes = this.uint8Array;
    for (let iByte = 0, byteLen = bytes.length; iByte < byteLen; iByte++) {
      // Get the precomputed boolean array for this byte
      const booleansInByte = getUint8ByteToBitBooleanArray(bytes[iByte]);
      // For each bit in the byte check participation and add to indexesSelected array
      for (let iBit = 0; iBit < 8; iBit++) {
        const value = values[iByte * 8 + iBit];
        if (value !== undefined) {
          if (booleansInByte[iBit]) {
            yes.push(value);
          } else {
            no.push(value);
          }
        }
      }
    }

    return {yes, no};
  }

  /**
   * Return the position of a single bit set. If no bit set or more than 1 bit set, throws.
   * @returns Single bit set position
   */
  getSingleTrueBit(): number {
    let index: number | null = null;

    const bytes = this.uint8Array;

    // Iterate over each byte of bits
    for (let iByte = 0, byteLen = bytes.length; iByte < byteLen; iByte++) {
      // If it's exactly zero, there won't be any indexes, continue early
      if (bytes[iByte] === 0) {
        continue;
      }

      // Get the precomputed boolean array for this byte
      const booleansInByte = getUint8ByteToBitBooleanArray(bytes[iByte]);
      // For each bit in the byte check participation and add to indexesSelected array
      for (let iBit = 0; iBit < 8; iBit++) {
        if (booleansInByte[iBit] === true) {
          if (index !== null) throw new BitArrayErrorMoreThanOneBitSet();
          index = iByte * 8 + iBit;
        }
      }
    }

    if (index === null) {
      throw new BitArrayErrorNoBitSet();
    } else {
      return index;
    }
  }
}

export class BitArrayErrorMoreThanOneBitSet extends Error {}
export class BitArrayErrorNoBitSet extends Error {}
