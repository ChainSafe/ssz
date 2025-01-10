// Need to write this test with right pattern

// import {expect} from "chai";
// import {PersistentVector, TransientVector} from "../../src/Vector.js";

// // TODO: @tuyennhv re-write with common benchmark runner
// it.skip("PersistentVector - should be able to handle 10M elements", function () {
//   this.timeout(0);
//   let start = Date.now();
//   let acc: PersistentVector<number> = PersistentVector.empty;
//   const times = 10000000;
//   for (let i = 0; i < times; ++i) {
//     acc = acc.push(i);
//   }
//   expect(acc.length).to.be.equal(times);
//   console.log(`Finish push ${times} items in`, Date.now() - start);
//   start = Date.now();
//   for (let i = 0; i < times; ++i) {
//     acc = acc.set(i, i);
//   }
//   console.log(`Finish set ${times} items in`, Date.now() - start);
//   start = Date.now();
//   let index = 0;
//   for (const _ of acc) {
//     // expect(item).to.be.equal(index);
//     index++;
//   }
//   expect(index).to.be.equal(times);
//   console.log(`Finish regular iterator ${times} in`, Date.now() - start);
//   // start = Date.now();
//   // for (let i = 0; i < times; ++i) {
//   //   expect(acc.get(i)).to.be.equal(i);
//   // }
//   // console.log(`Finish regular for of ${times} items in`, Date.now() - start);
//   start = Date.now();
//   let count = 0;
//   acc.forEach(() => {
//     count++;
//   });
//   expect(count).to.be.equal(times);
//   console.log(`Finish forEach of ${times} items in`, Date.now() - start);
//   start = Date.now();
//   const tsArray = acc.toArray();
//   expect(tsArray.length).to.be.equal(times);
//   console.log(`Finish toArray of ${times} items in`, Date.now() - start);
//   start = Date.now();
//   const newArr = acc.map<number>((v) => v * 2);
//   console.log(`Finish map of ${times} items in`, Date.now() - start);
//   expect(newArr[1]).to.be.equal(2);
//   expect(newArr.length).to.be.equal(times);
//   start = Date.now();
//   const newArr2 = tsArray.map((v) => v * 2);
//   console.log(`Finish regular map of regular array of ${times} items in`, Date.now() - start);
//   expect(newArr).to.be.deep.equal(newArr2);
// });

// // TODO: @tuyennhv re-write with common benchmark runner
// it.skip("TransientVector - should be able to handle 10M elements", function () {
//   this.timeout(0);
//   let start = Date.now();
//   let acc: TransientVector<number> = TransientVector.empty();
//   const times = 10000000;
//   for (let i = 0; i < times; ++i) {
//     acc = acc.push(i);
//   }
//   expect(acc.length).to.be.equal(times);
//   console.log(`Finish push ${times} items in`, Date.now() - start);
//   start = Date.now();
//   for (let i = 0; i < times; ++i) {
//     acc = acc.set(i, i);
//   }
//   console.log(`Finish set ${times} items in`, Date.now() - start);
//   start = Date.now();
//   let index = 0;
//   for (const _ of acc) {
//     // expect(item).to.be.equal(index);
//     index++;
//   }
//   expect(index).to.be.equal(times);
//   console.log(`Finish regular iterator ${times} in`, Date.now() - start);
//   // start = Date.now();
//   // for (let i = 0; i < times; ++i) {
//   //   expect(acc.get(i)).to.be.equal(i);
//   // }
//   // console.log(`Finish regular for of ${times} items in`, Date.now() - start);
//   start = Date.now();
//   let count = 0;
//   acc.forEach(() => {
//     count++;
//   });
//   expect(count).to.be.equal(times);
//   console.log(`Finish forEach of ${times} items in`, Date.now() - start);
//   start = Date.now();
//   const tsArray = acc.toArray();
//   expect(tsArray.length).to.be.equal(times);
//   console.log(`Finish toArray of ${times} items in`, Date.now() - start);
//   start = Date.now();
//   const newArr = acc.map<number>((v) => v * 2);
//   console.log(`Finish map of ${times} items in`, Date.now() - start);
//   expect(newArr[1]).to.be.equal(2);
//   expect(newArr.length).to.be.equal(times);
//   start = Date.now();
//   const newArr2 = tsArray.map((v) => v * 2);
//   console.log(`Finish regular map of regular array of ${times} items in`, Date.now() - start);
//   expect(newArr).to.be.deep.equal(newArr2);
// });
