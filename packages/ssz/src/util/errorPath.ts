type JsonPathItem = string | number;

/**
 * Tracks the JSON path location of nested errors
 */
export class SszErrorPath extends Error {
  jsonPath: JsonPathItem[];
  rawMessage: string;

  constructor(e: Error | SszErrorPath, keyOrIndex: JsonPathItem) {
    const prevJsonPath = e instanceof SszErrorPath ? e.jsonPath : [];
    const jsonPath = [keyOrIndex, ...prevJsonPath];
    const rawMessage = e instanceof SszErrorPath ? e.rawMessage : e.message;
    super(`${renderJsonPath(jsonPath)}: ${rawMessage}`);
    this.jsonPath = jsonPath;
    this.rawMessage = rawMessage;
  }
}

/**
 * Render an array of JSON path items
 * @param jsonPath ["a", 2, "n", "m"]
 * @returns "a[2].n.m"
 */
export function renderJsonPath(jsonPath: JsonPathItem[]): string {
  let path = "";
  for (const item of jsonPath) {
    switch (typeof item) {
      case "number":
        path += `[${item}]`;
        break;
      case "string":
      default:
        path += path.length > 0 ? `.${item}` : item;
        break;
    }
  }
  return path;
}
