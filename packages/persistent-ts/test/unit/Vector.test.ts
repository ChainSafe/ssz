import fc from "fast-check";
import {describe, expect, it} from "vitest";
import {PersistentVector, TransientVector} from "../../src/Vector.ts";

describe("Vector", () => {
  it("PersistentVector.empty has a length of 0", () => {
    const empty = PersistentVector.empty;
    expect(empty.length).toEqual(0);
    expect(empty.get(0)).toBeUndefined();
  });

  it("PersistentVector push increments the length", () => {
    let v = PersistentVector.empty;
    for (let i = 1; i < 1025; i++) {
      v = v.push(i);
      expect(v.length).toEqual(i);
    }
  });

  it("PersistentVector push works with many elements", () => {
    let acc = PersistentVector.empty;
    const times = 1025;
    for (let i = 0; i < times; ++i) {
      acc = acc.push(i);
    }
    expect(acc.length).toEqual(times);
    for (let i = 0; i < times; ++i) {
      expect(acc.get(i)).toEqual(i);
    }
    let i = 0;
    for (const item of acc) {
      expect(item).toEqual(i);
      i++;
    }
    expect(i).toEqual(times);
  });

  it("PersistentVector iterator should work", () => {
    const times = 1025;
    const originalArr = Array.from({length: times}, (_, i) => 2 * i);
    const acc = PersistentVector.from(originalArr);
    expect(acc.length).toEqual(times);
    let i = 0;
    for (const item of acc) {
      expect(item).toEqual(2 * i);
      i++;
    }
    expect(i).toEqual(times);
    const newArr = [...acc];
    expect(newArr).toEqual(originalArr);
  });

  it("PersistentVector forEach should work", () => {
    let acc = PersistentVector.empty;
    const times = 1025;
    for (let i = 0; i < times; ++i) {
      acc = acc.push(2 * i);
    }
    expect(acc.length).toEqual(times);
    let count = 0;
    acc.forEach((v, i) => {
      expect(v).toEqual(2 * i);
      count++;
    });
    expect(count).toEqual(times);
  });

  it("PersistentVector map should work", () => {
    const times = 1025;
    const originalArr = Array.from({length: times}, (_, i) => i);
    const newArr = originalArr.map((v) => v * 2);
    const acc = PersistentVector.from(originalArr);
    expect(acc.length).toEqual(times);
    const newArr2 = acc.map<number>((v) => v * 2);
    expect(newArr2).toEqual(newArr);
  });

  it("PersistentVector toArray should convert to regular javascript array", () => {
    const times = 1025;
    const originalArr = Array.from({length: times}, (_, i) => i);
    const acc = PersistentVector.from(originalArr);
    expect(acc.toArray()).toEqual(originalArr);
  });

  it("PersistentVector.get works", () => {
    const element = 1;
    const empty = PersistentVector.empty;
    const single = empty.push(element);
    expect(single.get(-1)).to.be.undefined;
    expect(single.get(1)).to.be.undefined;
    expect(empty.get(0)).to.be.undefined;
    expect(single.get(0)).toEqual(element);
  });

  it("PersistentVector.set works", () => {
    const a = 0;
    const b = 1;
    const empty = PersistentVector.empty;
    const single = empty.push(a);
    expect(single.set(0, b).get(0)).toEqual(b);
  });

  it("PersistentVector.set should not effect original vector", () => {
    const times = 1025;
    const originalArr = Array.from({length: times}, (_, i) => 2 * i);
    const originalVector = PersistentVector.from(originalArr);
    let newVector: PersistentVector<number> = originalVector;
    for (let i = 0; i < times; i++) {
      newVector = newVector.set(i, i * 4);
    }
    for (let i = 0; i < times; i++) {
      const val = originalVector.get(i);
      expect(val).toBeDefined();
      expect(newVector?.get(i)).toEqual((val as number) * 2);
    }
    expect([...newVector]).toEqual(originalArr.map((item) => item * 2));
    expect([...newVector].length).toEqual(1025);
    expect(newVector.length).toEqual(1025);
  });

  it("PersistentVector.pop works with many elements", () => {
    let acc = PersistentVector.empty;
    expect(acc.pop()).toEqual(acc);
    const times = 1025;
    for (let i = 0; i < 2 * times; ++i) {
      acc = acc.push(i);
    }
    for (let i = 0; i < times; ++i) {
      acc = acc.pop();
    }
    expect(acc.length).toEqual(times);
    for (let i = 0; i < times; ++i) {
      const g = acc.get(i);
      expect(g).toEqual(i);
    }
  });

  it("PersistentVector returns undefined beyond its bounds", () => {
    const vector = PersistentVector.from(Array.from({length: 1025}, (_, i) => i));

    expect(vector.get(-1)).to.be.undefined;
    expect(vector.get(1025)).to.be.undefined;
  });

  it("PersistentVector created from an array will spread to the same array", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (data) => {
        let acc = PersistentVector.empty;
        for (const d of data) acc = acc.push(d);
        const arr = [...acc];
        expect(arr).toEqual(data);
      })
    );
  });

  describe("TransientVector", () => {
    it("should push/pop elements successfully", () => {
      let v: TransientVector<number> = TransientVector.empty();
      const a: number[] = [];
      for (let i = 0; i < 1025; i++) {
        v = v.push(i);
        a.push(i);
        expect(v.length).to.equal(a.length);
        expect(v.toArray()).to.deep.equal(a);
      }
      for (let i = 0; i < 1025; i++) {
        v = v.pop();
        a.pop();
        expect(v.length).to.equal(a.length);
        expect(v.toArray()).to.deep.equal(a);
      }
    });

    it("should get/set elements successfully", () => {
      let v: TransientVector<number> = TransientVector.empty();
      const a: number[] = [];
      for (let i = 0; i < 1025; i++) {
        v = v.push(i);
        a.push(i);
      }
      for (let i = 0; i < 1025; i++) {
        expect(v.get(i)).to.equal(a[i]);
      }
      for (let i = 0; i < 1025; i++) {
        v = v.set(i, 2 * i);
        a[i] = 2 * i;
        expect(v.get(i)).to.equal(a[i]);
      }
    });
  });

  describe("PersistentVector<->TransientVector", () => {
    it("should convert vectors without mutating PersistentVectors", () => {
      let pv: PersistentVector<number> = PersistentVector.empty;
      for (let i = 0; i < 1025; i++) {
        pv = pv.push(i);
      }
      let tv = pv.asTransient();
      const arr = pv.toArray();
      expect([...tv]).to.deep.equal(arr);
      expect([...pv]).to.deep.equal(arr);

      tv.pop();
      expect(pv.length).to.equal(arr.length);

      for (let i = 0; i < 1025; i++) {
        tv = tv.set(i, i * 2);
      }
      expect([...pv]).to.deep.equal(arr);

      tv.persistent();
      expect(() => tv.set(0, 0)).toThrow();
      expect(() => tv.persistent()).toThrow();
      expect(() => tv.push(0)).toThrow();
      expect(() => tv.pop()).toThrow();
    });
  });
});
