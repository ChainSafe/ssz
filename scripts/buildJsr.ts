import { getPackageJson, npmExportsToDenoExports } from "./utils.ts";

const { name, version, exports } = await getPackageJson();

await Deno.writeTextFile(
  `${Deno.cwd()}/deno.json`,
  JSON.stringify({ name, version, exports: npmExportsToDenoExports(exports) })
);
