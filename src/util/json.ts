import {IJsonOptions} from "../types";
import Case from "case";

export function toExpectedCase(value: string, expectedCase: IJsonOptions["case"] = "camel"): string {
  switch (expectedCase) {
    case "camel":
      return Case.camel(value);
    case "snake":
      return Case.snake(value);
    default:
      return value;
  }
}
