// @ts-ignore
import yaml from "js-yaml";

export function dumpYaml(input: unknown): string {
  return yaml.dump(input);
}

export function parseYaml(input: string): unknown {
  return yaml.load(input);
}
