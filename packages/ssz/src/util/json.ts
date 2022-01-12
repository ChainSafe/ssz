import Case from "case";

type KeyCase =
  | "snake"
  | "constant"
  | "camel"
  | "param"
  | "header"
  | "pascal" //Same as squish
  | "dot"
  | "notransform";

export function toExpectedCase(
  value: string,
  expectedCase: KeyCase = "camel",
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
