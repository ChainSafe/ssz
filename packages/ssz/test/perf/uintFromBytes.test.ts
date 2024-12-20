import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {itBench} from "@dapplion/benchmark";
import {UintNumberType, UintBigintType, uintNumberByteLens, uintBigintByteLens} from "../../src/type/uint.js";

const POW_32 = 2 ** 32;

describe("Uint64 deserialize", () => {
  describe("UintNumberType DataView Tree", () => {
    const leafNode = getLeafNode();

    for (const byteLength of uintNumberByteLens) {
      const bitLength = byteLength * 8;

      const uintNumberType = new UintNumberType(byteLength);

      const numElements = 100_000;
      let arrayBuffer: ArrayBuffer;
      let uint8Array: Uint8Array;
      let dataView: DataView;

      // Single leafNode

      before("Create random bytes", () => {
        const firstValue = byteLength >= 8 ? 30e9 : 2 ** (bitLength - 1);
        const maxValue = byteLength >= 8 ? Number.MAX_SAFE_INTEGER : 2 ** bitLength;

        arrayBuffer = new ArrayBuffer(numElements * byteLength);
        uint8Array = new Uint8Array(arrayBuffer);
        dataView = new DataView(arrayBuffer);

        for (let i = 0; i < numElements; i++) {
          const value = (firstValue + i) % maxValue;
          switch (byteLength) {
            case 1:
              dataView.setUint8(i * byteLength, value);
              break;
            case 2:
              dataView.setUint16(i * byteLength, value, true);
              break;
            case 4:
              dataView.setUint32(i * byteLength, value, true);
              break;
            case 8:
              dataView.setBigUint64(i * byteLength, BigInt(value), true);
              break;
          }
        }
      });

      itBench(`UintBigint${bitLength} x ${numElements} tree_deserialize`, () => {
        for (let i = 0; i < numElements; i++) {
          uintNumberType.tree_deserializeFromBytes({uint8Array, dataView}, i * byteLength, (i + 1) * byteLength);
        }
      });

      itBench(`UintBigint${bitLength} x ${numElements} tree_serialize`, () => {
        const arrayBuf = new ArrayBuffer(arrayBuffer.byteLength);
        const dataView = new DataView(arrayBuf);
        const uint8Array = new Uint8Array(arrayBuf);
        for (let i = 0; i < numElements; i++) {
          uintNumberType.tree_serializeToBytes({uint8Array, dataView}, i * byteLength, leafNode);
        }
      });
    }
  });

  describe("UintNumberType DataView", () => {
    for (const byteLength of uintNumberByteLens) {
      const bitLength = byteLength * 8;

      const uintNumberType = new UintNumberType(byteLength);

      const numElements = 100_000;
      let arrayBuffer: ArrayBuffer;
      let uint8Array: Uint8Array;
      let dataView: DataView;
      const values: number[] = [];

      // Single leafNode

      before("Create random bytes", () => {
        const firstValue = byteLength >= 8 ? 30e9 : 2 ** (bitLength - 1);
        const maxValue = byteLength >= 8 ? Number.MAX_SAFE_INTEGER : 2 ** bitLength;

        arrayBuffer = new ArrayBuffer(numElements * byteLength);
        uint8Array = new Uint8Array(arrayBuffer);
        dataView = new DataView(arrayBuffer);

        for (let i = 0; i < numElements; i++) {
          const value = (firstValue + i) % maxValue;
          values.push(value);
          switch (byteLength) {
            case 1:
              dataView.setUint8(i * byteLength, value);
              break;
            case 2:
              dataView.setUint16(i * byteLength, value, true);
              break;
            case 4:
              dataView.setUint32(i * byteLength, value, true);
              break;
            case 8:
              dataView.setBigUint64(i * byteLength, BigInt(value), true);
              break;
          }
        }
      });

      itBench(`UintBigint${bitLength} x ${numElements} value_deserialize`, () => {
        for (let i = 0; i < numElements; i++) {
          uintNumberType.value_deserializeFromBytes({uint8Array, dataView}, i * byteLength, (i + 1) * byteLength);
        }
      });

      itBench(`UintBigint${bitLength} x ${numElements} value_serialize`, () => {
        const arrayBuf = new ArrayBuffer(arrayBuffer.byteLength);
        const dataView = new DataView(arrayBuf);
        for (let i = 0; i < numElements; i++) {
          uintNumberType.value_serializeToBytes({uint8Array, dataView}, i * byteLength, values[i]);
        }
      });
    }
  });

  describe("UintBigintType DataView", () => {
    for (const byteLength of uintBigintByteLens) {
      const bitLength = byteLength * 8;

      const uintBigintType = new UintBigintType(byteLength);

      const numElements = 100_000;
      let arrayBuffer: ArrayBuffer;
      let uint8Array: Uint8Array;
      let dataView: DataView;
      const values: bigint[] = [];

      before("Create random bytes", () => {
        const firstValue = BigInt(2) ** BigInt(bitLength - 1);
        const maxValue = BigInt(2) ** BigInt(bitLength);

        arrayBuffer = new ArrayBuffer(numElements * byteLength);
        uint8Array = new Uint8Array(arrayBuffer);
        dataView = new DataView(arrayBuffer);

        for (let i = 0; i < numElements; i++) {
          const value = (firstValue + BigInt(i)) % maxValue;
          values.push(value);
          switch (byteLength) {
            case 1:
              dataView.setUint8(i * byteLength, Number(value));
              break;
            case 2:
              dataView.setUint16(i * byteLength, Number(value), true);
              break;
            case 4:
              dataView.setUint32(i * byteLength, Number(value), true);
              break;
            case 8:
              dataView.setBigUint64(i * byteLength, value, true);
              break;
          }
        }
      });

      itBench(`UintBigint${bitLength} x ${numElements} deserialize`, () => {
        const output: bigint[] = [];
        for (let i = 0; i < numElements; i++) {
          const value = uintBigintType.value_deserializeFromBytes(
            {uint8Array, dataView},
            i * byteLength,
            (i + 1) * byteLength
          );
          output.push(value);
        }
      });

      itBench(`UintBigint${bitLength} x ${numElements} serialize`, () => {
        const arrayBuf = new ArrayBuffer(arrayBuffer.byteLength);
        const dataView = new DataView(arrayBuf);
        for (let i = 0; i < numElements; i++) {
          uintBigintType.value_serializeToBytes({uint8Array, dataView}, i * byteLength, values[i]);
        }
      });
    }
  });

  describe("General TypedArray tests", () => {
    const numElements = 100_000;
    const bytesPerElement = 8;
    const bytesTotal = numElements * bytesPerElement;
    const bytes32Elements = bytesTotal / 32;

    let arrayBuffer: ArrayBuffer;
    let uint8Array: Uint8Array;
    let uint32Array: Uint32Array;
    let dataView: DataView;
    let buffer: Buffer;

    before("Create random bytes", () => {
      arrayBuffer = new ArrayBuffer(bytesTotal);
      uint8Array = new Uint8Array(arrayBuffer);
      uint32Array = new Uint32Array(arrayBuffer);
      dataView = new DataView(arrayBuffer);
      buffer = Buffer.from(arrayBuffer);
      for (let i = 0; i < numElements; i++) {
        dataView.setBigUint64(i * 8, BigInt(30e9 + i), true);
      }
    });

    itBench(`Slice from Uint8Array x${bytes32Elements}`, () => {
      for (let i = 0; i < bytesTotal; i += 32) {
        uint8Array.slice(i, i + 32);
      }
    });

    itBench(`Slice from ArrayBuffer x${bytes32Elements}`, () => {
      for (let i = 0; i < bytesTotal; i += 32) {
        arrayBuffer.slice(i, i + 32);
      }
    });

    itBench(`Slice from ArrayBuffer x${bytes32Elements} + new Uint8Array`, () => {
      for (let i = 0; i < bytesTotal; i += 32) {
        new Uint8Array(dataView.buffer.slice(i, i + 32));
      }
    });

    itBench(`Copy Uint8Array ${numElements} iterate`, () => {
      const byteLen = uint8Array.length;
      const uint8ArrayB = new Uint8Array(byteLen);
      for (let i = 0; i < uint8Array.length; i++) {
        uint8ArrayB[i] = uint8Array[i];
      }
    });

    itBench(`Copy Uint8Array ${numElements} slice`, () => {
      uint8Array.slice(0, uint8Array.length);
    });

    itBench(`Copy Uint8Array ${numElements} Uint8Array.prototype.slice.call`, () => {
      Uint8Array.prototype.slice.call(uint8Array, 0, uint8Array.length);
    });

    itBench(`Copy Buffer ${numElements} Uint8Array.prototype.slice.call`, () => {
      Uint8Array.prototype.slice.call(buffer, 0, uint8Array.length);
    });

    itBench(`Copy Uint8Array ${numElements} slice + set`, () => {
      const byteLen = uint8Array.length;
      const uint8ArrayNew = new Uint8Array(byteLen);
      uint8ArrayNew.set(uint8Array.slice(0, byteLen));
    });

    itBench(`Copy Uint8Array ${numElements} subarray + set`, () => {
      const byteLen = uint8Array.length;
      const uint8ArrayNew = new Uint8Array(byteLen);
      uint8ArrayNew.set(uint8Array.subarray(0, byteLen));
    });

    itBench(`Copy Uint8Array ${numElements} slice arrayBuffer`, () => {
      const byteLen = uint8Array.length;
      new Uint8Array(arrayBuffer.slice(0, byteLen));
    });

    itBench(`Uint64 deserialize ${numElements} - iterate Uint8Array`, () => {
      const values: number[] = [];
      for (let i = 0; i < numElements; i++) {
        values.push(uint8Array[i]);
      }
    });

    itBench(`Uint64 deserialize ${numElements} - by Uint32A`, () => {
      const values: number[] = [];
      for (let i = 0; i < numElements; i++) {
        values.push(uint32Array[i * 2]);
      }
    });

    itBench(`Uint64 deserialize ${numElements} - by DataView.getUint32 x2`, () => {
      const values: number[] = [];
      for (let i = 0; i < numElements; i++) {
        const lo = dataView.getUint32(i * 8, true);
        const hi = dataView.getUint32(i * 8 + 4, true);
        values.push(lo + hi * POW_32);
      }
    });

    itBench(`Uint64 deserialize ${numElements} - by DataView.getBigUint64`, () => {
      const values: number[] = [];
      for (let i = 0; i < numElements; i++) {
        const bn = dataView.getBigUint64(i * 8, true);
        values.push(Number(bn));
      }
    });

    itBench(`Uint64 deserialize ${numElements} - by byte`, () => {
      const byteLength = 8;
      const values: number[] = [];

      for (let i = 0; i < numElements; i++) {
        const start = i * 8;
        let output = 0;
        for (let i = 0; i < byteLength; i++) {
          output += uint8Array[start + i] * 2 ** (8 * i);
        }
        values.push(output);
      }
    });
  });
});

function getLeafNode(): LeafNode {
  const arrayBuffer = new ArrayBuffer(32);
  const dataView = new DataView(arrayBuffer);
  dataView.setBigUint64(0, BigInt(30e9 + 1));
  dataView.setBigUint64(8, BigInt(30e9 + 2));
  dataView.setBigUint64(16, BigInt(30e9 + 3));
  dataView.setBigUint64(24, BigInt(30e9 + 4));
  return LeafNode.fromRoot(new Uint8Array(arrayBuffer));
}
