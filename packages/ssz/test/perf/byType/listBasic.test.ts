import {itBench} from "@dapplion/benchmark";
import {ListBasicType, UintNumberType} from "../../../src";

const byteType = new UintNumberType(1);

describe("ListBasicType types", () => {
  for (const len of [300_000]) {
    for (const type of [new ListBasicType(byteType, 2 ** 36)]) {
      const viewDU = type.toViewDU(newFilledArray(len, 7));

      itBench(`${type.typeName} len ${len} ViewDU.getAll() + iterate`, () => {
        const values = viewDU.getAll();
        for (let i = 0; i < len; i++) {
          values[i];
        }
      });

      itBench(`${type.typeName} len ${len} ViewDU.get(i)`, () => {
        for (let i = 0; i < len; i++) {
          viewDU.get(i);
        }
      });
    }

    itBench(`Array.push len ${len} empty Array - number`, () => {
      const array: number[] = [];
      for (let i = 0; i < len; i++) array.push(7);
    });

    itBench(`Array.set len ${len} from new Array - number`, () => {
      const array = new Array<number>(len);
      for (let i = 0; i < len; i++) array[i] = 7;
    });

    itBench(`Array.set len ${len} - number`, () => {
      const array: number[] = [];
      for (let i = 0; i < len; i++) array[i] = 7;
    });

    itBench(`Uint8Array.set len ${len}`, () => {
      const uint8Array = new Uint8Array(len);
      for (let i = 0; i < len; i++) uint8Array[i] = 7;
    });

    itBench(`Uint32Array.set len ${len}`, () => {
      const uint32Array = new Uint32Array(len);
      for (let i = 0; i < len; i++) uint32Array[i] = 7;
    });
  }
});

function newFilledArray<T>(len: number, value: T): T[] {
  const values: T[] = [];
  for (let i = 0; i < len; i++) {
    values.push(value);
  }
  return values;
}
