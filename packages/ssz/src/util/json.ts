import {IJsonOptions} from "../types";
import Case from "case";

export function toExpectedCase(value: string, expectedCase?: IJsonOptions["case"]): string {
  return expectedCase && expectedCase != "notransform" && Case[expectedCase] ? Case[expectedCase](value) : value;
}
