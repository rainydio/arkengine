// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export default function <T extends object, R extends object>(target: T, ...rest: R[]): T & UnionToIntersection<R>;
