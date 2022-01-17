import {testRunnerMemory} from "./testRunnerMemory";

const generalUint8Array = new Uint8Array(100);

class ValidatorTest {
  effectiveBalance: number;
  slashed: number;
  activationEligibilityEpoch: number;
  activationEpoch: number;
  exitEpoch: number;
  withdrawableEpoch: number;

  private _index: number;

  constructor(
    _index: number,
    effectiveBalance: number,
    slashed: number,
    activationEligibilityEpoch: number,
    activationEpoch: number,
    exitEpoch: number,
    withdrawableEpoch: number
  ) {
    this._index = _index;
    this.effectiveBalance = effectiveBalance;
    this.slashed = slashed;
    this.activationEligibilityEpoch = activationEligibilityEpoch;
    this.activationEpoch = activationEpoch;
    this.exitEpoch = exitEpoch;
    this.withdrawableEpoch = withdrawableEpoch;
  }

  get pubkey(): Uint8Array {
    return generalUint8Array.slice(this._index * 48, (this._index + 1) * 48);
  }

  set pubkey(_pubkey: Uint8Array) {
    throw Error("Must not set immutable pubkey");
  }

  get withdrawalCredentials(): Uint8Array {
    return generalUint8Array.slice(this._index * 32, (this._index + 1) * 32);
  }

  set withdrawalCredentials(_withdrawalCredentials: Uint8Array) {
    throw Error("Must not set immutable withdrawalCredentials");
  }
}

// Results in Linux Dec 2021
//
// Validator struct                - 588.0 bytes / instance
// Validator tree                  - 1625.8 bytes / instance
// ValidatorNodeStruct struct      - 593.3 bytes / instance
// ValidatorNodeStruct tree        - 743.5 bytes / instance
// ValidatorNodeStruct valueToNode - 59.2 bytes / instance

const uint8Array = new Uint8Array(32);

testRunnerMemoryBpi([
  // aggregationBits: 1196
  // data: 796
  // signature: 287
  //
  // sum: 2279, all: 2251
  {id: "Object with two references", getInstance: (i) => ({i: 123423 + i, uint8Array})},
  {id: "Object with two references", getInstance: (i) => ({i: 123423 + i, uint8Array})},
  {id: "Object with one num reference", getInstance: (i) => ({i: 123423 + i})},
  {id: "Object with one obj reference", getInstance: () => ({uint8Array})},
  {
    id: "Validator from class",
    getInstance: () => new ValidatorTest(0, 0, 0, 0, 0, 0, 0),
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
    });

    // eslint-disable-next-line no-console
    console.log(`${id.padEnd(longestId)} - ${bpi.toFixed(1)} bytes / instance`);
  }
}
