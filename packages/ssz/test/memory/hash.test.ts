import {HashObject} from "../../../hash-object";
import {testRunnerMemory} from "./testRunnerMemory";
import {byteArrayToHashObject} from "@chainsafe/as-sha256";

/* eslint-disable no-console */

testRunnerMemoryBpi([
  {
    id: "hash-object - rust - 1",
    getInstance: () => HashObject.fromUint8Array(Buffer.alloc(32, 0xff)),
  },
  {
    id: "hash-object - js - literal 0prop",
    getInstance: () => ({}),
  },
  {
    id: "hash-object - js - literal 1prop",
    getInstance: () => ({h0: 0}),
  },
  {
    id: "hash-object - js - literal",
    getInstance: () => ({h0: 0, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0}),
  },
  {
    id: "hash-object - js - 1",
    getInstance: () => byteArrayToHashObject(Buffer.alloc(32, 0xff)),
  },
]);

/**
 * Test bytes per instance in different representations of raw binary data
 */
function testRunnerMemoryBpi(testCases: {getInstance: (bytes: number) => unknown; id: string}[]): void {
  const longestId = Math.max(...testCases.map(({id}) => id.length));

  for (const {id, getInstance} of testCases) {
    const bpi = testRunnerMemory({
      getInstance,
      convergeFactor: 0.2 / 100,
      // TODO - figure out if this is necessary
      // computeUsedMemory: (memoryUsage) => memoryUsage.rss,
    });

    // eslint-disable-next-line no-console
    console.log(`${id.padEnd(longestId)} - ${bpi.toFixed(1)} bytes / instance`);
  }
}
