import {describe, bench} from "@chainsafe/benchmark";
import {hasher} from "@chainsafe/persistent-merkle-tree";
import {ContainerNodeStructType, ContainerType, ListCompositeType, UintNumberType} from "../../../src/index.js";

console.log("%%%%%%%%%%%%%% INSIDE TEST FILE %%%%%%%%%%%%%%");
console.log(hasher);

const byteType = new UintNumberType(1);

describe("ListCompositeType types", () => {
  const containerType = new ContainerType({a: byteType, b: byteType});
  const containerNodeStructType = new ContainerNodeStructType({a: byteType, b: byteType});

  for (const len of [300_000]) {
    for (const type of [containerType, containerNodeStructType]) {
      const viewDU = type.defaultViewDU();
      const node = type.commitViewDU(viewDU);
      const cache = type.cacheOfViewDU(viewDU);

      bench(`${type.typeName} getViewDU x${len}`, () => {
        for (let i = 0; i < len; i++) {
          type.getViewDU(node, cache);
        }
      });
    }

    for (const type of [
      new ListCompositeType(containerType, 2 ** 40, {typeName: "List(Container)"}),
      new ListCompositeType(containerNodeStructType, 2 ** 40, {typeName: "List(ContainerNodeStruct)"}),
    ]) {
      const viewDU = type.toViewDU(newFilledArray(len, {a: 1, b: 2}));

      bench(`${type.typeName} len ${len} ViewDU.getAllReadonly() + iterate`, () => {
        const values = viewDU.getAllReadonly();
        for (let i = 0; i < len; i++) {
          values[i];
        }
      });

      bench(`${type.typeName} len ${len} ViewDU.getAllReadonlyValues() + iterate`, () => {
        const values = viewDU.getAllReadonlyValues();
        for (let i = 0; i < len; i++) {
          values[i];
        }
      });

      bench(`${type.typeName} len ${len} ViewDU.get(i)`, () => {
        for (let i = 0; i < len; i++) {
          viewDU.get(i);
        }
      });

      bench(`${type.typeName} len ${len} ViewDU.getReadonly(i)`, () => {
        for (let i = 0; i < len; i++) {
          viewDU.getReadonly(i);
        }
      });
    }

    const sampleObj = {a: 1, b: []};

    bench(`Array.push len ${len} empty Array - object`, () => {
      const array: unknown[] = [];
      for (let i = 0; i < len; i++) array.push(sampleObj);
    });

    bench(`Array.set len ${len} from new Array - object`, () => {
      const array = new Array<unknown>(len);
      for (let i = 0; i < len; i++) array[i] = sampleObj;
    });

    bench(`Array.set len ${len} - object`, () => {
      const array: unknown[] = [];
      for (let i = 0; i < len; i++) array[i] = sampleObj;
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
