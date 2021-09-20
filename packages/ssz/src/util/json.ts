import {IJsonOptions} from "../types";
import Case from "case";

export function toExpectedCase(
  value: string,
  expectedCase: IJsonOptions["case"] = "camel",
  customCasingMap?: Record<string, string>
): string {
  if (customCasingMap && customCasingMap[value]) return customCasingMap[value];
  switch (expectedCase) {
    case "notransform":
      return value;
    case "param":
      return Case.kebab(value);
    case "dot":
      return Case.lower(value, ".", true);
    default:
      return Case[expectedCase](value);
  }
}
