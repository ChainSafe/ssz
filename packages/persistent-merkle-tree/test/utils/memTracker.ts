export class MemoryTracker {
  prev = process.memoryUsage();

  logDiff(id: string): void {
    const curr = process.memoryUsage();
    const parts: string[] = [];
    for (const key of Object.keys(this.prev) as (keyof NodeJS.MemoryUsage)[]) {
      const prevVal = this.prev[key];
      const currVal = curr[key];
      const bytesDiff = currVal - prevVal;
      const sign = bytesDiff < 0 ? "-" : bytesDiff > 0 ? "+" : " ";
      parts.push(`${key} ${sign}${formatBytes(Math.abs(bytesDiff)).padEnd(15)}`);
    }
    this.prev = curr;
    console.log(id.padEnd(20), parts.join(" "));
  }
  }

  function formatBytes(numBytes: number): string {
    return numBytes/1000000 + "MB";
  }