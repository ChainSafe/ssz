import {bench, describe, setBenchOpts } from "@chainsafe/benchmark";

describe("big if vs obj", () => {
  setBenchOpts({noThreshold: true});

  function fnIf(n: number): number {
    if (n === 0) return 0;
    else if (n === 1) return 1;
    else if (n === 2) return 2;
    else if (n === 3) return 3;
    else if (n === 4) return 4;
    else if (n === 5) return 5;
    else if (n === 6) return 6;
    else if (n === 7) return 7;
    else if (n === 8) return 8;
    else if (n === 9) return 9;
    else throw Error("bad n");
  }

  function fnSwitch(n: number): number {
    switch (n) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      case 5:
        return 5;
      case 6:
        return 6;
      case 7:
        return 7;
      case 8:
        return 8;
      case 9:
        return 9;
      default:
        throw Error("bad n");
    }
  }

  const obj = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
  };

  function fnObj(n: number): number {
    return obj[n as keyof typeof obj];
  }

  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  function fnArr(n: number): number {
    return arr[n];
  }

  const runsFactor = 1e6;

  for (const n of [0, 4, 9]) {
    bench({id: `fnIf(${n})`, runsFactor}, () => {
      for (let i = 0; i < runsFactor; i++) fnIf(n);
    });
    bench({id: `fnSwitch(${n})`, runsFactor}, () => {
      for (let i = 0; i < runsFactor; i++) fnSwitch(n);
    });
    bench({id: `fnObj(${n})`, runsFactor}, () => {
      for (let i = 0; i < runsFactor; i++) fnObj(n);
    });
    bench({id: `fnArr(${n})`, runsFactor}, () => {
      for (let i = 0; i < runsFactor; i++) fnArr(n);
    });
  }
});
