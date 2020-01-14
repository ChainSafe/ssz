import {assert} from "chai";
import {describe, it} from "mocha";
import {countToDepth, gindexDepth} from "../src";

describe("countToDepth", () => {
    const testCases = [
        [0, 0], [1, 0], [2, 1], [3, 2], [4, 2], [5, 3], [6, 3], [7, 3], [8, 3], [9, 4],
    ];
    for (const [count, depth] of testCases) {
        it(`should correctly get depth for ${count} elements`, () => {
            const actual = countToDepth(BigInt(count));
            assert.equal(actual, depth);
        });
    }
});

describe("gindexDepth", () => {
    const testCases = [
        [0, 0], [1, 0], [2, 1], [3, 1], [4, 2], [5, 2], [6, 2], [7, 2], [8, 3], [9, 3],
    ];
    for (const [gindex, depth] of testCases) {
        it(`should correctly get depth for gindex ${gindex}`, () => {
            const actual = gindexDepth(BigInt(gindex));
            assert.equal(actual, depth);
        });
    }
});
