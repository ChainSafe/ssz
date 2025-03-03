import { exists } from "jsr:@std/fs/exists";

interface PackageJSON {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage: string;
  repository: {
    type: string;
    url: string;
  };
  bugs: string;
  dependencies: Record<string, string>;
  exports: Record<string, string | Record<"import" | "default", "string">>;
}

export async function getPackageJson(dir?: string): Promise<PackageJSON> {
  const pkgFilePath = dir
    ? `${dir}/package.json`
    : `${Deno.cwd()}/package.json`;

  await exists(pkgFilePath);

  return JSON.parse(await Deno.readTextFile(pkgFilePath)) as PackageJSON;
}

export function npmExportsToDenoExports(
  exportNames: PackageJSON["exports"]
): Record<string, string> {
  const updatedExports: Record<string, string> = {};
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

    updatedExports[name] = path;
  }

  return updatedExports;
}

export function npmExportsToDntEntrypoints(
  exportNames: PackageJSON["exports"]
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
