// Bans `arr.push(...arr)` (and any `x.push(...y)`) spreads in ssz source.
//
// Spreading an array into a call passes each element as a separate argument, and V8 caps call arguments by
// stack size (~125k on Node's default stack). For large arrays the spread throws
// `RangeError: Maximum call stack size exceeded` — this stalled Lodestar beacon nodes at the Gloas fork when
// walking a ~500k-validator registry (chainsafe/ssz#535). Use `pushAll` from packages/ssz/src/util/array.ts.
//
// biome 1.9.4 has no custom-rule / GritQL-plugin support (that lands in biome 2.x), so this uses biome's
// experimental GritQL `search` command as the matcher. Replace with a native plugin once biome is upgraded.
import {execFileSync} from "node:child_process";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const biome = join(root, "node_modules", ".bin", "biome");
const pattern = "`$o.push(...$a)`";
const searchPaths = ["packages/ssz/src"];

let output;
try {
  output = execFileSync(biome, ["search", pattern, ...searchPaths, "--colors=off"], {cwd: root, encoding: "utf8"});
} catch (err) {
  console.error(`biome search failed:\n${err.stderr || err.message}`);
  process.exit(2);
}

const matches = output.split("\n").filter((line) => /\.ts:\d+:\d+/.test(line));
if (matches.length > 0) {
  console.error("Disallowed `x.push(...y)` spread(s) found — use `pushAll` from util/array.ts instead:\n");
  console.error(matches.join("\n"));
  process.exit(1);
}

console.log(`OK: no disallowed push(...) spreads in ${searchPaths.join(", ")}`);
