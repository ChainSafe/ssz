import {IJsonOptions} from "../types";
import {
  snakeCase,
  constantCase,
  camelCase,
  paramCase,
  headerCase,
  pascalCase,
  dotCase,
  camelCaseTransformMerge,
  pascalCaseTransformMerge,
} from "change-case";

const splitRegexp = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g, /([a-z,A-Z])([0-9])/g];

export function toExpectedCase(value: string, expectedCase: IJsonOptions["case"] = "camel"): string {
  switch (expectedCase) {
    case "snake":
      return snakeCase(value, {splitRegexp});
    case "constant":
      return constantCase(value, {splitRegexp});
    case "camel":
      return camelCase(value, {splitRegexp, transform: camelCaseTransformMerge});
    case "param":
      return paramCase(value, {splitRegexp});
    case "header":
      return headerCase(value, {splitRegexp});
    case "pascal":
      return pascalCase(value, {splitRegexp, transform: pascalCaseTransformMerge});
    case "dot":
      return dotCase(value, {splitRegexp});
    default:
      return value;
  }
}
