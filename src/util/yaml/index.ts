import yaml from 'js-yaml';

import * as ETH_SCHEMA from './schema';

export function dumpYaml(input: any): string {
  return yaml.dump(input);
}

export function parseYaml(input: string): any {
  return yaml.load(input, {schema: ETH_SCHEMA});
}
