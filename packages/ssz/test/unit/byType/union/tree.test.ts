import {expect} from "chai";
import type {ValueOf} from "../../../../src";
import {UnionType, UintNumberType, NoneType, toHexString} from "../../../../src";

const byteType = new UintNumberType(1);
const noneType = new NoneType();

describe("Union view tests", () => {
  // Not using runViewTestMutation because the View of Union is a value
  it("Convert to view and back", () => {
    const type = new UnionType([noneType, byteType]);
    const value: ValueOf<typeof type> = {selector: 1, value: 5};
    const root = type.hashTreeRoot(value);

    const view = type.toView(value);
    const viewDU = type.toViewDU(value);

    expect(toHexString(type.commitView(view).root)).equals(toHexString(root));
    expect(toHexString(type.commitViewDU(viewDU).root)).equals(toHexString(root));
  });
});
