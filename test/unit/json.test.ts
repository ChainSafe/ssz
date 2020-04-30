import {CamelCaseFieldObject, ComplexCamelCaseFieldObject} from "./objects";
import { expect } from "chai";
import {BasicListType, CompositeListType} from "../../src/types/composite";

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

    it("should deserialize array of containers from snake case", function () {
        const CamelCaseObjectArray = new CompositeListType({
            elementType: CamelCaseFieldObject,
            limit: 2
        });
        const test = {someValue: 4, someOtherValue: true};
        const json = {some_value: 4, some_other_value: true};
        const result = CamelCaseObjectArray.fromJson([json, json], {case: "snake"});
        expect(CamelCaseObjectArray.equals([test, test], result)).to.be.true;
    });

    it("should deserialize complex from snake case", function () {
        const innerTest = {someValue: 4, someOtherValue: true};
        const test = {someValue: 4, someOtherValue: true, container: innerTest};
        const innerJson = {some_value: 4, some_other_value: true};
        const json = {some_value: 4, some_other_value: true, container: innerJson};
        const result = ComplexCamelCaseFieldObject.fromJson(json, {case: "snake"});
        expect(ComplexCamelCaseFieldObject.equals(test, result)).to.be.true;
    });

    it("should serialize to snake case", function () {
        const test = {someValue: 4, someOtherValue: true};
        const json = {some_value: 4, some_other_value: true};
        const result = CamelCaseFieldObject.toJson(test, {case: "snake"});
        expect(result).to.be.deep.equal(json);
    });

    it("should serialize array of containers to snake case", function () {
        const CamelCaseObjectArray = new CompositeListType({
            elementType: CamelCaseFieldObject,
            limit: 2
        });
        const test = {someValue: 4, someOtherValue: true};
        const json = {some_value: 4, some_other_value: true};
        const result = CamelCaseObjectArray.toJson([test, test], {case: "snake"});
        expect(result).to.be.deep.equal([json, json]);
    });

    it("should serialize complex object to snake case", function () {
        const innerTest = {someValue: 4, someOtherValue: true};
        const test = {someValue: 4, someOtherValue: true, container: innerTest};
        const innerJson = {some_value: 4, some_other_value: true};
        const json = {some_value: 4, some_other_value: true, container: innerJson};
        const result = ComplexCamelCaseFieldObject.toJson(test, {case: "snake"});
        expect(result).to.be.deep.equal(json);
    });

});