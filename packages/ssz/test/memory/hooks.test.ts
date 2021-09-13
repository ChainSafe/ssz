import {testRunnerMemory} from "./testRunnerMemory";

// Results in Linux Dec 2021
//
// Attestation struct             - 2311.9 bytes / instance
// Attestation tree               - 3048.2 bytes / instance
// SignedAggregateAndProof struct - 2950.4 bytes / instance
// SignedAggregateAndProof tree   - 4691.3 bytes / instance
// AggregationBits struct         - 1180.1 bytes / instance
// AggregationBits tree           - 701.5 bytes / instance
// SignedBeaconBlockPhase0 struct - 210580.6 bytes / instance
// SignedBeaconBlockPhase0 tree   - 278512.7 bytes / instance

/* eslint-disable @typescript-eslint/explicit-function-return-type */

const map = new Map<number, unknown>();

function getClosureWithMap(i: number) {
  return {
    closure: () => {
      map.set(i, true);
    },
  };
}

function getObjWithMap(i: number) {
  return {
    map: map,
    i: i,
  };
}

testRunnerMemoryBpi([
  //
  {id: "Closure with map an number", getInstance: getClosureWithMap},
  {id: "Closure with map an number", getInstance: getClosureWithMap},
  {id: "Closure with map an number", getInstance: getClosureWithMap},
  {id: "Ref to map and number", getInstance: getObjWithMap},
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
    });

    // eslint-disable-next-line no-console
    console.log(`${id.padEnd(longestId)} - ${bpi.toFixed(1)} bytes / instance`);
  }
}
