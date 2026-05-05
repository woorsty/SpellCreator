type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

export type DeepKeys<T> = {
  [K in keyof T & string]: T[K] extends object
    ? K | Join<K, DeepKeys<T[K]>>
    : K;
}[keyof T & string];
