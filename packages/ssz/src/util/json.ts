import {IJsonOptions} from "../types_old";
import Case from "case";

export function toExpectedCase(
  value: string,
  expectedCase: IJsonOptions["case"] = "camel",
  customCasingMap?: Record<string, string>
): string {
  if (expectedCase === "notransform") return value;
  if (customCasingMap && customCasingMap[value]) return customCasingMap[value];
  switch (expectedCase) {
    case "param":
      return Case.kebab(value);
    case "dot":
      return Case.lower(value, ".", true);
    default:
      return Case[expectedCase](value);
  }
}
