/**
 * Creates a union of all possible paths to properties in an object.
 *
 * @example
 * type MyType = { a: { b: { c: string } }, d: string };
 * type MyTypePaths = ObjectPath<MyType>;
 * // "a" | "d" | "a.b" | "a.b.c"
 */
export type FlattenKeys<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? `${K}` | `${K}.${FlattenKeys<T[K]>}` 
        : `${K}`;
    }[keyof T & (string | number)]
  : never;
