import {build, emptyDir} from "@deno/dnt";
import packageJSON from "./package.json" with {type: "json"};
import {getBuildOptions} from "../../scripts/build_npm.ts";

await emptyDir("./npm");

await build({
  ...getBuildOptions(packageJSON),  
  entryPoints: ["src/index.ts"],
});
