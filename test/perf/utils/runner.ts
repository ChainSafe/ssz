/* eslint-disable no-console */

export type BenchmarkOpts = {
  runs?: number;
  maxMs?: number;
  minMs?: number;
};

export class BenchmarkRunner {
  opts: BenchmarkOpts;
  constructor(title: string, opts?: BenchmarkOpts) {
    this.opts = opts || {};
    console.log(formatTitle(title));
  }

  run<T1, T2 = T1, R = void>(opts: RunOpts<T1, T2, R>): number {
    const {averageNs, runsDone} = doRun(opts, this.opts);
    console.log(formatRow({id: opts.id, averageNs, runsDone})); // ±1.74%

    return averageNs;
  }

  group(): BenchmarkGroupRunner {
    return new BenchmarkGroupRunner(this.opts);
  }
}

class BenchmarkGroupRunner {
  averageNs: number | null = null;
  opts: BenchmarkOpts;
  constructor(opts?: BenchmarkOpts) {
    this.opts = opts || {};
    console.log("---");
  }

  run<T1, T2 = T1, R = void>(opts: RunOpts<T1, T2, R>): number {
    const {averageNs, runsDone} = doRun(opts, this.opts);

    if (this.averageNs === null) this.averageNs = averageNs;
    const factor = averageNs / this.averageNs;

    console.log(formatRow({id: opts.id, averageNs, runsDone, factor})); // ±1.74%

    return averageNs;
  }
}

function doRun<T1, T2 = T1, R = void>(
  {before, beforeEach, run, check, id, ...opts}: RunOpts<T1, T2, R>,
  extraOpts: BenchmarkOpts
): {averageNs: number; runsDone: number} {
  const runs = opts.runs || extraOpts.runs || 512;
  const maxMs = opts.maxMs || extraOpts.maxMs || 2000;
  const minMs = opts.minMs || extraOpts.minMs || 100;

  const diffsNanoSec: bigint[] = [];

  const inputAll = before ? before() : (undefined as T1);

  let start = Date.now();
  let i = 0;
  while ((i++ < runs || Date.now() - start < minMs) && Date.now() - start < maxMs) {
    const input = beforeEach ? beforeEach(inputAll, i) : ((inputAll as unknown) as T2);

    const start = process.hrtime.bigint();
    const result = run(input);
    const end = process.hrtime.bigint();

    if (check && check(result)) throw Error("Result fails check test");

    diffsNanoSec.push(end - start);
  }

  const average = averageBigint(diffsNanoSec);
  const averageNs = Number(average);

  return {averageNs, runsDone: i - 1};
}

type RunOpts<T1, T2 = T1, R = void> = {
  before?: () => T1;
  beforeEach?: (arg: T1, i: number) => T2;
  run: (input: T2) => R;
  check?: (result: R) => boolean;
  id: string;
} & BenchmarkOpts;

function averageBigint(arr: bigint[]): bigint {
  const total = arr.reduce((total, value) => total + value);
  return total / BigInt(arr.length);
}

function formatRow({
  id,
  averageNs,
  runsDone,
  factor,
}: {
  id: string;
  averageNs: number;
  runsDone: number;
  factor?: number;
}): string {
  const precision = 7;
  const idLen = 64;

  const opsPerSec = 1e9 / averageNs;

  // ================================================================================================================
  // Scalar multiplication G1 (255-bit, constant-time)                              7219.330 ops/s       138517 ns/op
  // Scalar multiplication G2 (255-bit, constant-time)                              3133.117 ops/s       319171 ns/op

  let row = [
    factor === undefined ? "" : `x${factor.toFixed(2)}`.padStart(6),
    `${opsPerSec.toPrecision(precision).padStart(13)} ops/s`,
    `${averageNs.toPrecision(precision).padStart(13)} ns/op`,
    `${String(runsDone).padStart(6)} runs`,
  ].join(" ");

  return id.slice(0, idLen).padEnd(idLen) + " " + row;
}

export function formatTitle(title: string): string {
  return `
${title}
${"=".repeat(64)}`;
}
