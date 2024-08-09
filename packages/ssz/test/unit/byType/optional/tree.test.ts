import {expect} from "chai";
import {OptionalType, ContainerType, UintNumberType, ValueOf, toHexString} from "../../../../src";

const byteType = new UintNumberType(1);
const SimpleObject = new ContainerType({
  b: byteType,
  a: byteType,
});

describe("Optional view tests", () => {
  // TODO: implement
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
