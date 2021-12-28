import {NumberUintType} from "../../src/types/basic/uint";
import {ContainerType} from "../../src/types/composite/container";

describe("Container generator", () => {
  it("Use define properties", () => {
    const uint32Type = new NumberUintType({byteLength: 4});
    const uint64Type = new NumberUintType({byteLength: 8});

    const fields = {
      a: uint32Type,
      b: uint64Type,
      c: uint32Type,
    };

    type ContainerValue = {
      a: number;
      b: number;
      c: number;
    };

    const containerType = new ContainerType<{a: number}>({fields});

    const propertyDescriptors: PropertyDescriptorMap = {};
    for (const [key, type] of Object.entries(fields)) {
      propertyDescriptors[key] = {
        configurable: false,
        enumerable: true,
        get: function () {
          return type;
        },
        set: function () {
          console.log("Setting", key);
        },
      };
    }

    const obj = Object.create(Object.prototype, propertyDescriptors) as ContainerValue;

    containerType;
    obj;
  });
});
