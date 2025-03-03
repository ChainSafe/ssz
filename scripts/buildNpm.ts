import {build, emptyDir} from "@deno/dnt";
import { getPackageJson, npmExportsToDntEntrypoints } from "./utils.ts";

const packageJSON = await getPackageJson();
const currentDir = Deno.cwd();

const {
  name,
  version,
  description,
  author,
  license,
  bugs,
  homepage,
  repository,
  dependencies,
  exports,
} = packageJSON;

await emptyDir(`${currentDir}/npm`);

await build({
  outDir: `${currentDir}/npm`,
  shims: {
    // see JS docs for overview and more options
    deno: false,
  },
  test: false,
  skipSourceOutput: true,
  esModule: true,
  scriptModule: false,
  typeCheck: "both",
  package: {
    name,
    version,
    description,
    author,
    license,
    bugs,
    homepage,
    repository,
    dependencies,
  },
  entryPoints: npmExportsToDntEntrypoints(exports),
  filterDiagnostic(diagnostic) {
    if (diagnostic.messageText?.endsWith("Cannot find name 'WebAssembly'.")) {
      return false;
    }
    return true;
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
