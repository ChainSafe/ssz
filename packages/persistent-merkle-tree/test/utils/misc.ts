export function linspace(len: number): number[] {
  const values = new Array<number>(len);
  for (let i = 0; i < len; i++) {
    values[i] = i;
  }
  return values;
}

export function fillArray<T>(len: number, fill: T): T[] {
  const values = new Array<T>(len);
  for (let i = 0; i < len; i++) {
    values[i] = fill;
  }
  return values;
}
