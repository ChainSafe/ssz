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
  customCasingMap?: Partial<Record<string, string>>
): string {
  if (expectedCase === "notransform") {
    return value;
  }
  if (customCasingMap) {
    const customCase = customCasingMap[value];
    if (customCase !== undefined) {
      return customCase;
    }
  }
  switch (expectedCase) {
    case "param":
      return Case.kebab(value);
    case "dot":
      return Case.lower(value, ".", true);
    default:
      return Case[expectedCase](value);
  }
}
