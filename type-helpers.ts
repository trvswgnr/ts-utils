import type { TYPE } from "./shared";

export type Expect<T extends true> = T;
export type ExpectTrue<T extends true> = T;
export type ExpectFalse<T extends false> = T;
export type IsTrue<T extends true> = T;
export type IsFalse<T extends false> = T;

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
    T,
>() => T extends Y ? 1 : 2
    ? true
    : false;
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

// https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type NotAny<T> = true extends IsAny<T> ? false : true;

export type Debug<T> = { [K in keyof T]: T[K] };
export type MergeInsertions<T> = T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T;

export type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>;

export type ExpectExtends<VALUE, EXPECTED> = EXPECTED extends VALUE
    ? true
    : false;
export type ExpectValidArgs<
    FUNC extends (...args: any[]) => any,
    ARGS extends any[],
> = ARGS extends Parameters<FUNC> ? true : false;

export type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never;

export type Truthy<T> = T extends false | 0 | "" | null | undefined | 0n
    ? never
    : T;

// prettier-ignore
// export type BuiltinClass<T> =
//     | T extends Array<infer U> ? Array<U>
//     : T extends ArrayBuffer ? ArrayBuffer
//     : T extends BigInt64Array ? BigInt64Array
//     : T extends BigUint64Array ? BigUint64Array
//     : T extends Boolean ? Boolean
//     : T extends DataView ? DataView
//     : T extends Date ? Date
//     : T extends Error ? Error
//     : T extends EvalError ? EvalError
//     : T extends Float32Array ? Float32Array
//     : T extends Float64Array ? Float64Array
//     : T extends Int8Array ? Int8Array
//     : T extends Int16Array ? Int16Array
//     : T extends Int32Array ? Int32Array
//     : T extends Map<infer K, infer V> ? Map<K, V>
//     : T extends Number ? Number
//     : T extends Promise<infer V> ? Promise<V>
//     : T extends RangeError ? RangeError
//     : T extends ReferenceError ? ReferenceError
//     : T extends RegExp ? RegExp
//     : T extends Set<infer V> ? Set<V>
//     : T extends SharedArrayBuffer ? SharedArrayBuffer
//     : T extends String ? String
//     : T extends SyntaxError ? SyntaxError
//     : T extends TypeError ? TypeError
//     : T extends Uint8Array ? Uint8Array
//     : T extends Uint8ClampedArray ? Uint8ClampedArray
//     : T extends Uint16Array ? Uint16Array
//     : T extends Uint32Array ? Uint32Array
//     : T extends URIError ? URIError
//     : T extends WeakMap<infer K, infer V> ? WeakMap<K, V>
//     : T extends WeakSet<infer K> ? WeakSet<K>
//     : never;

// prettier-ignore
export type Widen<T> = 
    | T extends string ? string
    : T extends number ? number
    : T extends boolean ? boolean
    : T extends bigint ? bigint
    : T extends symbol ? symbol
    : T extends (...args: infer A) => infer R ? (...args: A) => R
    : T extends Array<infer U> ? Array<U>
    : T extends ReadonlyArray<infer U> ? ReadonlyArray<U>
    // : T extends BuiltinClass<T> ? BuiltinClass<T>
    : T extends { [K in keyof T]: T[K] } ? Omit<{ [K in keyof T]: Widen<T[K]> }, typeof TYPE>
    : T;
