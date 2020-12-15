import {expect} from "chai";
import fs from "fs";
import {join} from "path";
import * as testTypes from "./types";

describe("generalized static indices", function () {
  const testCases = fs.readFileSync(join(__dirname, "testCases.txt")).toString().split("\n");

  testCases.forEach((testCase) => {
    it(testCase, function () {
      const [type, path, expected] = testCase.split(" ");
      let pathParts: string[] = [];
      if (path !== "") {
        pathParts = path.split("/");
      }
      const result = testTypes[type as keyof typeof testTypes].getGeneralizedIndex(1, ...pathParts);
      expect(result).to.be.equal(parseInt(expected));
    });
  });
});
