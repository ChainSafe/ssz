export type ArrayElement<T> = T extends ArrayLike<infer U> ? U : T;
