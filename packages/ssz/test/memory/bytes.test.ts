import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {testRunnerMemory} from "./testRunnerMemory";

/* eslint-disable no-console */

// How to efficiently represent roots or bigger chunks of raw bytes
//
// Results in Linux Dec 2021
//
// Uint8Array              32  bytes - 233.6 bytes / instance
// Uint8Array              64  bytes - 265.9 bytes / instance
// Uint8Array              128 bytes - 313.4 bytes / instance
// Uint8Array              256 bytes - 441.3 bytes / instance
// Uint8Array              512 bytes - 697.3 bytes / instance
// Uint8Array              1024 bytes - 1212.1 bytes / instance
// Uint8Array              2048 bytes - 2236.1 bytes / instance
// Uint8Array              4096 bytes - 4284.1 bytes / instance
// Uint8Array              8192 bytes - 8380.1 bytes / instance
// Uint8Array(ArrayBuffer) 32  bytes - 218.7 bytes / instance
// Uint8Array(ArrayBuffer) 64  bytes - 249.4 bytes / instance
// Uint8Array(ArrayBuffer) 128 bytes - 313.4 bytes / instance
// Uint8Array(ArrayBuffer) 256 bytes - 441.3 bytes / instance
// Uint8Array(ArrayBuffer) 512 bytes - 697.3 bytes / instance
// Buffer.from(Uint8Array) 32  bytes - 138.8 bytes / instance
// Buffer.from(Uint8Array) 64  bytes - 170.4 bytes / instance
// Buffer.from(Uint8Array) 128 bytes - 235.3 bytes / instance
// Buffer.from(Uint8Array) 256 bytes - 365.8 bytes / instance
// Buffer.from(Uint8Array) 512 bytes - 624.8 bytes / instance
// Buffer.alloc            32  bytes - 224.7 bytes / instance
// Buffer.alloc            64  bytes - 265.4 bytes / instance
// Buffer.alloc            128 bytes - 313.4 bytes / instance
// Buffer.alloc            256 bytes - 441.3 bytes / instance
// Buffer.alloc            512 bytes - 697.3 bytes / instance

const bpiLeafNode = testRunnerMemory({getInstance: () => LeafNode.fromRoot(randomBytes(32))});
console.log(`LeafNode() 32 bytes - ${bpiLeafNode} bytes / instance`);

testRunnerMemoryBpi([
  {id: "Uint8Array", getInstance: randomBytes},
  {id: "Uint8Array(ArrayBuffer)", getInstance: (bytes) => new Uint8Array(new ArrayBuffer(bytes))},
  {id: "Buffer.from(Uint8Array)", getInstance: (bytes) => Buffer.from(randomBytes(bytes))},
  {id: "Buffer.alloc", getInstance: (bytes) => Buffer.alloc(bytes, 0xdd)},
]);

// // Sharing an ArrayBuffer is innefficient, for large n tends to 4.3 bytes / byte
// for (let n = 1; n < 128; n *= 2) {
//   const bytesPerInstance = testRunnerMemory({getInstance: () => commonArrayBufferManyRoots(n)});
//   console.log(`commonArrayBufferManyRoots(${n}) byte ${bytesPerInstance / (32 * n)}`);
// }

// function commonArrayBufferManyRoots(n: number): Uint8Array[] {
//   const buffer = new ArrayBuffer(32 * n);
//   const roots: Uint8Array[] = [];
//   for (let i = 0; i < n; i++) {
//     roots.push(new Uint8Array(buffer, 32 * i, 32));
//   }
//   return roots;
// }

/**
 * Test bytes per instance in different representations of raw binary data
 */
function testRunnerMemoryBpi(testCases: {getInstance: (bytes: number) => unknown; id: string}[]): void {
  const longestId = Math.max(...testCases.map(({id}) => id.length));

  for (const {id, getInstance} of testCases) {
    for (let bytes = 32; bytes <= 8192; bytes *= 2) {
      const bpi = testRunnerMemory({
        getInstance: () => getInstance(bytes),
        convergeFactor: 0.2 / 100,
      });

      console.log(`${id.padEnd(longestId)} ${String(bytes).padEnd(3)} bytes - ${bpi.toFixed(1)} bytes / instance`);
    }
  }
}

function randomBytes(bytes: number): Uint8Array {
  const uint8Arr = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    uint8Arr[i] = i;
  }

  // // Wrapping with Buffer, reduced memory WTF
  // return Buffer.from(uint8Arr);

  return uint8Arr;
}
