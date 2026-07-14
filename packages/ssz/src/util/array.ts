/**
 * Append every item of `source` onto `target`, in order.
 *
 * Prefer this over `target.push(...source)`: spreading an array into a call passes each element as a
 * separate argument, and V8 caps call arguments by stack size (~125k on Node's default stack). For large
 * `source` arrays the spread throws `RangeError: Maximum call stack size exceeded`. This matters in the
 * proof/gindices paths, where a single subtree or collection field can produce hundreds of thousands of
 * elements (see chainsafe/ssz#535).
 */
export function pushAll<T>(target: T[], source: ArrayLike<T>): void {
  for (let i = 0; i < source.length; i++) {
    target.push(source[i]);
  }
}
