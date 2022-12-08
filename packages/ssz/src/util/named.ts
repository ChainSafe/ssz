export function namedClass<T>(superClass: T, className: string): T {
  return new Function("superClass", `return class ${className} extends superClass {}`)(superClass) as typeof superClass;
}
