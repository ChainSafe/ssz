import {itBench} from "@dapplion/benchmark";
import {ContainerNodeStructType, ContainerType, ListCompositeType, UintNumberType} from "../../../src";

const byteType = new UintNumberType(1);

describe("ListCompositeType types", () => {
  const containerType = new ContainerType({a: byteType, b: byteType});
  const containerNodeStructType = new ContainerNodeStructType({a: byteType, b: byteType});

  for (const len of [300_000]) {
    for (const type of [containerType, containerNodeStructType]) {
      const viewDU = type.defaultViewDU();
      const node = type.commitViewDU(viewDU).node;
      const cache = type.cacheOfViewDU(viewDU);

      itBench(`${type.typeName} getViewDU x${len}`, () => {
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

      itBench(`${type.typeName} len ${len} ViewDU.getAllReadonly() + iterate`, () => {
        const values = viewDU.getAllReadonly();
        for (let i = 0; i < len; i++) {
          values[i];
        }
      });

      itBench(`${type.typeName} len ${len} ViewDU.getAllReadonlyValues() + iterate`, () => {
        const values = viewDU.getAllReadonlyValues();
        for (let i = 0; i < len; i++) {
          values[i];
        }
      });

      itBench(`${type.typeName} len ${len} ViewDU.get(i)`, () => {
        for (let i = 0; i < len; i++) {
          viewDU.get(i);
        }
      });

      itBench(`${type.typeName} len ${len} ViewDU.getReadonly(i)`, () => {
        for (let i = 0; i < len; i++) {
          viewDU.getReadonly(i);
        }
      });
    }

    const sampleObj = {a: 1, b: []};

    itBench(`Array.push len ${len} empty Array - object`, () => {
      const array: unknown[] = [];
      for (let i = 0; i < len; i++) array.push(sampleObj);
    });

    itBench(`Array.set len ${len} from new Array - object`, () => {
      const array = new Array<unknown>(len);
      for (let i = 0; i < len; i++) array[i] = sampleObj;
    });

    itBench(`Array.set len ${len} - object`, () => {
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
