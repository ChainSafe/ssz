import {itBench} from "@dapplion/benchmark";

describe("Access object properties in generated objects", () => {
  const rawObject = {
    a: 1,
    b: 2,
  };

  const proxy = new Proxy(rawObject, {
    get(target, property) {
      if (property in target) {
        return target[property as keyof typeof rawObject] as unknown;
      }
    },
  });

  class CustomObj {}
  for (const key in rawObject) {
    Object.defineProperty(CustomObj.prototype, key, {
      value: rawObject[key as keyof typeof rawObject] as unknown,
      writable: true,
    });
  }
  const customObj = new CustomObj() as typeof rawObject;

  const times = 1e6;

  itBench(`get 2 props x${times} - rawObject`, () => {
    for (let i = 0; i < times; i++) {
      rawObject.a;
      rawObject.b;
    }
  });

  itBench(`get 2 props x${times} - proxy`, () => {
    for (let i = 0; i < times; i++) {
      proxy.a;
      proxy.b;
    }
  });

  itBench(`get 2 props x${times} - customObj`, () => {
    for (let i = 0; i < times; i++) {
      customObj.a;
      customObj.b;
    }
  });
});
