import {describe, expect, it} from "vitest";
import {ContainerType, OptionalType, UintNumberType, ValueOf, toHexString} from "../../../../src/index.ts";

const byteType = new UintNumberType(1);
const SimpleObject = new ContainerType({
  b: byteType,
  a: byteType,
});

describe("Optional view tests", () => {
  // TODO: implement

  it.skip("optional simple type", () => {
    const type = new OptionalType(byteType);
    const value: ValueOf<typeof type> = 9;
    const root = type.hashTreeRoot(value);

    const view = type.toView(value);
    const viewDU = type.toViewDU(value);

    expect(toHexString(type.commitView(view).root)).equals(toHexString(root));
    expect(toHexString(type.commitViewDU(viewDU).root)).equals(toHexString(root));
  });

  // TODO: implement

  it.skip("optional composite type", () => {
    const type = new OptionalType(SimpleObject);
    const value: ValueOf<typeof type> = {a: 9, b: 11};
    const root = type.hashTreeRoot(value);

    const view = type.toView(value);
    const viewDU = type.toViewDU(value);

    expect(toHexString(type.commitView(view).root)).equals(toHexString(root));
    expect(toHexString(type.commitViewDU(viewDU).root)).equals(toHexString(root));
  });
});
