export function wrapErr<T>(fn: () => T, prefix: string): T {
  try {
    return fn();
  } catch (e) {
    (e as Error).message = `${prefix}: ${(e as Error).message}`;
    throw e;
  }
}
