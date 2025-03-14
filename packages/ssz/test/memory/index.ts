import {StringDecoder} from "string_decoder";

const refs: any[] = [];
const xs: number[] = [];
const arrayBuffersArr: number[] = [];
const externalArr: number[] = [];
const heapTotal: number[] = [];
const heapUsed: number[] = [];
const rss: number[] = [];

enum TestType {
  EmptyObject,
  ArrayOfNumbers,
  BufferAlloc,
  BufferFromString,
  Uint8Array,
  ArrayBuffer,
  Number,
  // From Proto
  FixedObject8,
  FixedObject4,
  FixedArray,
  FixedObject4BigInt,
  String32BytesHex,
  NativeBinding32Bytes,
  BlstPublicKey,
  StringDecoder,
  BigInt,
  FinalizationRegistry,
  // Bitlist alternatives
  BitListArrayOfBools,
  BitListUint8Array,
  BitListArrayOfBytes,
}

const testType = TestType.BitListUint8Array;
const size = 32;
const bitlistLen = 512;

const utf16decoder = new StringDecoder("utf8");

// 32 - 223
// 64 - 256
// 96 - 355
// 128 - 390
// 160 - 421
// 192 - 447

for (let i = 0; i < 1e8; i++) {
  switch (testType as TestType) {
    case TestType.EmptyObject: {
      const obj = {a: 1};
      refs.push(obj);
      break;
    }

    case TestType.ArrayOfNumbers:
      refs.push([1, 2, 3, 4]);
      break;

    case TestType.BufferAlloc:
      refs.push(Buffer.alloc(size, i));
      break;

    case TestType.BufferFromString:
      refs.push(Buffer.from(String(i).padStart(64, "0"), "hex"));
      break;

    case TestType.Uint8Array: {
      const u = new Uint8Array(size);

      u.fill(4);
      // @ts-expect-error __proto__ is hidden and needs to be overridden
      u.__proto__ = null;
      refs.push(u);
      break;
    }

    case TestType.ArrayBuffer: {
      const a = new ArrayBuffer(size);
      const u = new Uint8Array(a);
      u.fill(4);
      refs.push(a);
      break;
    }

    case TestType.Number:
      refs.push(i);
      break;

    case TestType.FixedObject8: {
      const t = 1 << 31;
      const obj = {
        a: t,
        b: t + 1,
        c: t + 2,
        d: t + 3,
        e: t + 4,
        f: t + 5,
        g: t + 6,
        h: t + 7,
      };
      refs.push(obj);
      break;
    }

    case TestType.FixedObject4: {
      const t = 1 << 50;
      const obj = {
        a: t,
        b: t + 1,
        c: t + 2,
        d: t + 3,
      };
      refs.push(obj);
      break;
    }

    //
    case TestType.FixedArray: {
      const t = 1 << 31;
      const obj = [t + i, t + i + 1, t + i + 2, t + i + 3, t + i + 4, t + i + 5, t + i + 6, t + i + 7];
      // with .freeze() -> rssM: 669
      // Object.freeze(obj);
      refs.push(obj);
      break;
    }

    case TestType.FixedObject4BigInt: {
      const t = BigInt(1) << BigInt(31);
      const obj = {
        a: t,
        b: t + BigInt(1),
        c: t + BigInt(2),
        d: t + BigInt(3),
      };
      refs.push(obj);
      break;
    }

    case TestType.String32BytesHex: {
      const hex = String(i).padStart(16, "0");
      refs.push(hex);
      break;
    }

    case TestType.StringDecoder: {
      const u8s = new Uint8Array(32);
      u8s.fill(4, 0, 32);
      const strValue = utf16decoder.write(u8s as Buffer);
      refs.push(strValue);
      break;
    }

    case TestType.BigInt: {
      const vBig = BigInt("0xaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccdd") + BigInt(i);
      refs.push(vBig);
      break;
    }

    case TestType.BitListArrayOfBools: {
      const bits: boolean[] = [];
      for (let i = 0; i < bitlistLen; i++) {
        bits.push(true);
      }
      refs.push(bits);
      break;
    }

    case TestType.BitListUint8Array: {
      const bytes = Math.ceil(bitlistLen / 8);
      const bits = new Uint8Array(bytes);
      for (let i = 0; i < bytes; i++) {
        bits[i] = 255;
      }
      refs.push(bits);
      break;
    }

    case TestType.BitListArrayOfBytes: {
      const bytes = Math.ceil(bitlistLen / 8);
      const bits: number[] = [];
      for (let i = 0; i < bytes; i++) {
        bits[i] = 255;
      }
      refs.push(bits);
      break;
    }

    default: {
      throw Error(`Unknown TestType: ${testType}`);
    }
  }

  // Stores 5 floating point numbers every 5000 pushes to refs.
  // The added memory should be negligible against refs, and linearRegression
  // local vars will get garbage collected and won't show up in the .m result

  if (i % 5000 === 0) {
    xs.push(i);
    const memoryUsage = process.memoryUsage();
    arrayBuffersArr.push(memoryUsage.arrayBuffers);
    externalArr.push(memoryUsage.external);
    heapTotal.push(memoryUsage.heapTotal);
    heapUsed.push(memoryUsage.heapUsed);
    rss.push(memoryUsage.rss);

    const arrayBuffersM = linearRegression(xs, arrayBuffersArr).m;
    const externalM = linearRegression(xs, externalArr).m;
    const heapTotalM = linearRegression(xs, heapTotal).m;
    const heapUsedM = linearRegression(xs, heapUsed).m;
    const rssM = linearRegression(xs, rss).m;

    
    console.log(i, {arrayBuffersM, externalM, heapTotalM, heapUsedM, rssM});
  }
}

/**
 * From https://github.com/simple-statistics/simple-statistics/blob/d0d177baf74976a2421638bce98ab028c5afb537/src/linear_regression.js
 *
 * [Simple linear regression](http://en.wikipedia.org/wiki/Simple_linear_regression)
 * is a simple way to find a fitted line between a set of coordinates.
 * This algorithm finds the slope and y-intercept of a regression line
 * using the least sum of squares.
 *
 * @param data an array of two-element of arrays,
 * like `[[0, 1], [2, 3]]`
 * @returns object containing slope and intersect of regression line
 * @example
 * linearRegression([[0, 0], [1, 1]]); // => { m: 1, b: 0 }
 */
export function linearRegression(xs: number[], ys: number[]): {m: number; b: number} {
  let m: number, b: number;

  // Store data length in a local variable to reduce
  // repeated object property lookups
  const dataLength = xs.length;

  //if there's only one point, arbitrarily choose a slope of 0
  //and a y-intercept of whatever the y of the initial point is
  if (dataLength === 1) {
    m = 0;
    b = ys[0];
  } else {
    // Initialize our sums and scope the `m` and `b`
    // variables that define the line.
    let sumX = 0,
      sumY = 0,
      sumXX = 0,
      sumXY = 0;

    // Use local variables to grab point values
    // with minimal object property lookups
    let x: number, y: number;

    // Gather the sum of all x values, the sum of all
    // y values, and the sum of x^2 and (x*y) for each
    // value.
    //
    // In math notation, these would be SS_x, SS_y, SS_xx, and SS_xy
    for (let i = 0; i < dataLength; i++) {
      x = xs[i];
      y = ys[i];

      sumX += x;
      sumY += y;

      sumXX += x * x;
      sumXY += x * y;
    }

    // `m` is the slope of the regression line
    m = (dataLength * sumXY - sumX * sumY) / (dataLength * sumXX - sumX * sumX);

    // `b` is the y-intercept of the line.
    b = sumY / dataLength - (m * sumX) / dataLength;
  }

  // Return both values as an object.
  return {
    m: m,
    b: b,
  };
}
