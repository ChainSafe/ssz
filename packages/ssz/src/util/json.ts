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
  expectedCase?: KeyCase,
  customCasingMap?: Partial<Record<string, string>>
): string {
  if (customCasingMap) {
    const customCase = customCasingMap[value];
    if (customCase !== undefined) {
      return customCase;
    }
  }

  if (!expectedCase || expectedCase === "notransform") {
    return value;
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
