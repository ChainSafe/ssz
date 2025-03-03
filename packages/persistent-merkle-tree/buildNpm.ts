import {build, emptyDir} from "@deno/dnt";
import packageJSON from "./package.json" with {type: "json"};
import {getBuildOptions} from "../../scripts/build_npm.ts";

await emptyDir("./npm");

await build({
  ...getBuildOptions(packageJSON),  
  entryPoints: [
    {
      name: ".",
      path: "src/index.ts"
    },
    {
      name: "./hasher/hashtree",
      path: "./src/hasher/hashtree.ts"
    },
    {
      name: "./hasher/noble",
      path: "./src/hasher/noble.ts"
    },
    {
      name: "./hasher/as-sha256",
      path: "./src/hasher/as-sha256.ts"
    }
  ],
});
