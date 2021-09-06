import {IJsonOptions} from "../types";
import Case from "case";

export function toExpectedCase(value: string, expectedCase: IJsonOptions["case"] = "camel"): string {
  return expectedCase === "notransform" ? value : Case[expectedCase](value);
}
