export function getBuildOptions(
  packageJSON: Record<string, unknown>
): Record<string, unknown> {
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
  } = packageJSON;

  return {
    outDir: "./npm",
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
  };
}
