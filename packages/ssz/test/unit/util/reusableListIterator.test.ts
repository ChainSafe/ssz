import {expect} from "chai";
import {ReusableListIterator} from "../../../src/util/reusableListIterator";

describe("ReusableListIterator", () => {
  let list: ReusableListIterator<number>;

  beforeEach(() => {
    list = new ReusableListIterator<number>();
    list.push(0);
  });

  it("should reset", () => {
    list.reset();
    expect(list.length).to.be.equal(0);
    expect(list.totalLength).to.be.equal(1);
    expect(list.toArray()).to.be.deep.equal([]);
  });

  it("should push", () => {
    list.push(1);
    expect(list.length).to.be.equal(2);
    expect(list.totalLength).to.be.equal(2);
    const arr = list.toArray();
    expect(arr.length).to.be.equal(2);
    expect(arr).to.be.deep.equal([0, 1]);
  });

  it("reset then push full", () => {
    list.push(1);
    list.reset();
    list.push(1);
    list.push(2);
    list.clean();
    expect(list.length).to.be.equal(2);
    expect(list.totalLength).to.be.equal(2);
    const arr = list.toArray();
    expect(arr).to.be.deep.equal([1, 2]);
  });

  it("reset then push partial", () => {
    list.push(1);
    // totalLength = 2 now
    list.reset();
    list.push(1);
    list.clean();
    expect(list.length).to.be.equal(1);
    expect(list.totalLength).to.be.equal(2);
    const arr = list.toArray();
    expect(arr).to.be.deep.equal([1]);
  });

  it("clean", () => {
    list.push(1);
    list.reset();
    list.push(1);
    list.clean();
    expect(list.length).to.be.equal(1);
    expect(list.totalLength).to.be.equal(2);
    const arr = list.toArray();
    expect(arr).to.be.deep.equal([1]);
    const all = list.dump();
    expect(all).to.be.deep.equal([1, null]);
  });
});
