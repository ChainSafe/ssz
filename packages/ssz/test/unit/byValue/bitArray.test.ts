import {describe, expect, it} from "vitest";
import {BitVectorType} from "../../../src/index.js";
import {BitArray, getUint8ByteToBitBooleanArray} from "../../../src/value/bitArray.js";
import {linspace} from "../../utils/misc.js";

const BITS_PER_BYTE = 8;

describe("aggregationBits", function () {
  it("getUint8ByteToBitBooleanArray", () => {
    expect(getUint8ByteToBitBooleanArray(1)).toEqual([true, false, false, false, false, false, false, false]);
    expect(getUint8ByteToBitBooleanArray(5)).toEqual([true, false, true, false, false, false, false, false]);
  });
});

describe("BitArray.intersectValues", () => {
  const testCases: {id: string; bitLen: number; bitList: number[]; yes: number[]}[] = [
    {id: "zero values", bitLen: 16, bitList: [0b00000000, 0b00000000], yes: []},
    {id: "one value", bitLen: 16, bitList: [0b00001000, 0b00000000], yes: [3]},
    {id: "many values", bitLen: 16, bitList: [0b01100001, 0b01000100], yes: [0, 5, 6, 10, 14]},
    {id: "many values odd", bitLen: 15, bitList: [0b01100001, 0b01000100], yes: [0, 5, 6, 10, 14]},
    {id: "all values", bitLen: 16, bitList: [0b11111111, 0b11111111], yes: linspace(16)},
  ];

  for (const {id, bitLen, bitList, yes} of testCases) {
    const bitVectorType = new BitVectorType(bitLen);
    const indexes = linspace(bitLen);
    const bitArrayValue = new BitArray(new Uint8Array(bitList), bitLen);
    const bitArrayView = bitVectorType.toView(bitArrayValue);
    const bitArrayViewDU = bitVectorType.toViewDU(bitArrayValue);

    for (const [bid, bitArray] of Object.entries({bitArrayValue, bitArrayView, bitArrayViewDU})) {
      it(`BitArray ${id} - ${bid}`, () => {
        expect(bitArray.intersectValues(indexes)).to.deep.equal(yes);
      });
    }
  }
});

describe("BitArray.getSingleTrueBit", () => {
  const bitLen = 2 * 8;
  const bitVectorType = new BitVectorType(bitLen);

  const testCases: {id: string; bitList: number[]; res: number | null}[] = [
    {id: "bit 0 true", bitList: [0b00000001, 0b00000000], res: 0},
    {id: "bit 4 true", bitList: [0b00010000, 0b00000000], res: 4},
    {id: "bit 9 true", bitList: [0b00000000, 0b00000010], res: 9},
    {id: "2 bits true", bitList: [0b00010000, 0b00010000], res: null},
    {id: "all true", bitList: [0b11111111, 0b11111111], res: null},
    {id: "all false", bitList: [0b00000000, 0b00000000], res: null},
  ];

  for (const {id, bitList, res} of testCases) {
    const bitArrayValue = new BitArray(new Uint8Array(bitList), 8 * bitList.length);
    const bitArrayView = bitVectorType.toView(bitArrayValue);
    const bitArrayViewDU = bitVectorType.toViewDU(bitArrayValue);

    for (const [bid, bitArray] of Object.entries({bitArrayValue, bitArrayView, bitArrayViewDU})) {
      it(`BitArray ${id} - ${bid}`, () => {
        expect(bitArray.getSingleTrueBit()).to.equal(res);
      });
    }
  }
});

describe("BitArray.set() and BitArray.get()", () => {
  it("Should set and get all bits", () => {
    const len = 16;
    const bitArray = BitArray.fromBitLen(len);

    for (let i = 0; i < len; i++) {
      bitArray.set(i, true);

      for (let j = 0; j < len; j++) {
        // The top for loop sets true to i, so any j value less or equal has already been set to true
        expect(bitArray.get(j)).to.equal(j <= i, `Wrong bit value i ${i} j ${j}`);
      }
    }
  });

  it("Should unset and get all bits", () => {
    const len = 16;
    const bitArray = new BitArray(Buffer.alloc(len / 8, 0xff), len);

    for (let i = 0; i < len; i++) {
      bitArray.set(i, false);

      for (let j = 0; j < len; j++) {
        // The top for loop sets false to i, so any j greater than is still true
        expect(bitArray.get(j)).to.equal(j > i, `Wrong bit value i ${i} j ${j}`);
      }
    }
  });
});

describe("BitArray errors", () => {
  it("Invalid uint8Array.length", () => {
    expect(() => new BitArray(new Uint8Array(1), 2 * 8)).toThrow("BitArray uint8Array length does not match bitLen");
  });

  it(".set() over bitLen", () => {
    const bitArray = BitArray.fromBitLen(8);
    // Max OK index is bitLen - 1
    expect(() => bitArray.set(bitArray.bitLen, true)).toThrow();
    expect(() => bitArray.set(bitArray.bitLen + 1, true)).toThrow();
  });

  it(".mergeOrWith() wrong lengths", () => {
    const bitArray1 = BitArray.fromBitLen(8);
    const bitArray2 = BitArray.fromBitLen(bitArray1.bitLen + 1);
    expect(() => bitArray1.mergeOrWith(bitArray2)).toThrow();
  });

  it(".intersectValues() wrong lengths", () => {
    const bitArray1 = BitArray.fromBitLen(8);
    const values = Array(bitArray1.bitLen + 1) as unknown[];
    expect(() => bitArray1.intersectValues(values)).toThrow();
  });
});

// BitArrayTreeView and BitArrayTreeViewDU can cause recursive loops:
// They are light wrappers over BitArray, calling the underlying BitArray in almost all methods
// ```
// get bitLen(): number {
//   return this.bitArray.bitLen;
// }
// ```
// The danger is that if instead of calling `this.bitArray.bitLen` it calls `this.bitLen` it will call
// an infinite recursive loop that not caught by Typescript. This test ensures that all current and future
// methods of BitArray are called which guarantees no recursive loops
describe("BitArray TreeView - ensure no recursive loops", () => {
  const bitLen = 8;
  const bitVector = new BitVectorType(bitLen);
  const bitArrayValue = bitVector.defaultValue();
  const bitArrayView = bitVector.defaultView();
  const bitArrayViewDU = bitVector.defaultViewDU();
  const indexes = Array.from({length: bitLen}, () => 0);

  type KeysOfFns<T extends BitArray> = {
    [K in keyof T]: T[K] extends (...args: any) => any ? K : never;
  }[keyof T];
  type BitArrayFns = Pick<BitArray, KeysOfFns<BitArray>>;

  const fns: {[K in keyof BitArrayFns]: Parameters<BitArray[K]>} = {
    clone: [],
    get: [0],
    set: [0, true],
    mergeOrWith: [bitArrayValue],
    intersectValues: [indexes],
    getTrueBitIndexes: [],
    getSingleTrueBit: [],
    toBoolArray: [],
  };
  const getters = Object.keys(bitArrayValue) as (keyof BitArray)[];

  const bitArrays = {bitArrayValue, bitArrayView, bitArrayViewDU};

  for (const bitArrayKey of Object.keys(bitArrays) as (keyof typeof bitArrays)[]) {
    const bitArray = bitArrays[bitArrayKey];

    // Methods
    for (const fnKey of Object.keys(fns) as (keyof BitArrayFns)[]) {
      it(`${bitArrayKey} ${fnKey}`, () => {
        (bitArray[fnKey] as (...args: any[]) => void)(...fns[fnKey]);
      });
    }

    // Getters
    for (const propKey of getters) {
      it(`${bitArrayKey} ${propKey}`, () => {
        bitArray[propKey];
      });
    }
  }
});

describe("BitArray helper get unparticipants", () => {
  function getNoNaive(values: number[], yes: number[]): number[] {
    const no: number[] = [];
    const yesSet = new Set(yes);
    for (const index of values) {
      if (!yesSet.has(index)) {
        no.push(index);
      }
    }
    return no;
  }

  function getNo(values: number[], yes: number[]): number[] {
    const no: number[] = [];

    let j = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i] === yes[j]) {
        // Included
        j++;
      } else {
        no.push(values[i]);
      }
    }

    return no;
  }

  const values = Array.from({length: 16}, (_, i) => i);
  const testCases: {id: string; yes: number[]}[] = [
    {id: "zero values", yes: []},
    {id: "one value", yes: [3]},
    {id: "many values", yes: [0, 5, 6, 10, 14]},
    {id: "all values", yes: values},
  ];

  for (const {id, yes} of testCases) {
    it(`getUnparticipants - ${id}`, () => {
      expect(getNoNaive(values, yes)).to.deep.equal(getNo(values, yes));
    });
  }
});
