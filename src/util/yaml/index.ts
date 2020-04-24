// @ts-ignore
import yaml from 'js-yaml';

export function dumpYaml(input: any): string {
  return yaml.dump(input);
}

export function parseYaml(input: string): any {
  return yaml.load(input);
}
