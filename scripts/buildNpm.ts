export function npmExportsToDntEntrypoints(
  exportNames: Record<string, string | Record<"import" | "default", "string">>
): { name: string; path: string }[] {
  const entryPoints: { name: string; path: string }[] = [];

  for (const name of Object.keys(exportNames)) {
    let path = "";

    if (typeof exportNames[name] === "string") {
      path = exportNames[name];
    } else if (exportNames[name]["import"]) {
      path = exportNames[name]["import"] as string;
    } else if (exportNames[name]["default"]) {
      path = exportNames[name]["default"] as string;
    } else {
      throw new Error(`No export found as import or default for key ${name}`);
    }

    entryPoints.push({
      name,
      path,
    });
  }

  return entryPoints;
}

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
    exports,
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
  };
}
