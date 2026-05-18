/**
 * Creates a union of all possible paths to properties in an object.
 *
 * @example
 * type MyType = { a: { b: { c: string } }, d: string };
 * type MyTypePaths = FlattenKeys<MyType>;
 * // "a" | "d" | "a.b" | "a.b.c"
 */
export type FlattenKeys<T> = T extends object
  ? {
      [K in keyof T & (string | number)]-?: PathOf<K, NonNullable<T[K]>>;
    }[keyof T & (string | number)]
  : never;

type PathOf<K extends string | number, V> = V extends readonly unknown[]
  ? `${K}`
  : V extends object
  ? `${K}` | `${K}.${FlattenKeys<V>}`
  : `${K}`;
