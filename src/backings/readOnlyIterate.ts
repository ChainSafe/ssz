import {ArrayLike} from "../interface";

export function readOnlyForEach<T>(value: ArrayLike<T>, fn: (value: T, index: number) => void): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((value as any).readOnlyForEach) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value as any).readOnlyForEach(fn);
  } else {
    value.forEach(fn);
  }
}

export function readOnlyMap<T, U>(value: ArrayLike<T>, fn: (value: T, index: number) => U): U[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((value as any).readOnlyMap) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (value as any).readOnlyMap(fn);
  } else {
    const result: U[] = [];
    value.forEach((v: T, index: number): void => {
      result.push(fn(v, index));
    });
    return result;
  }
}
