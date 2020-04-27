import {CamelCaseFieldObject} from "./objects";
import { expect } from "chai";

describe("json serialization", function () {

    it("should do round trip - container", function () {
        const test = {someValue: 4, someOtherValue: true};
        const json = CamelCaseFieldObject.toJson(test)
        const result = CamelCaseFieldObject.fromJson(json);
        expect(CamelCaseFieldObject.equals(result, test)).to.be.true;
    });

    it("should deserialize from snake case", function () {
        const test = {someValue: 4, someOtherValue: true};
        const json = {some_value: 4, some_other_value: true};
        const result = CamelCaseFieldObject.fromJson(json, {case: "snake"});
        expect(CamelCaseFieldObject.equals(test, result)).to.be.true;
    });

    it("should serialize to snake case", function () {
        const test = {someValue: 4, someOtherValue: true};
        const json = {some_value: 4, some_other_value: true};
        const result = CamelCaseFieldObject.toJson(test, {case: "snake"});
        expect(result).to.be.deep.equal(json);
    });

});