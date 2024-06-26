import { Ordering } from "./shared";
import { type Equal } from "./type-helpers";

/**
 * `Some(v)` is a value that represents a non-empty option,
 */
export type Some<T> = NonNullable<T>;

/**
 * `None` is a value that represents an empty option, i.e. either `null` or
 * `undefined`.
 */
export type None = null | undefined;

/**
 * The type for option values. Either `None` or a value of type `Some(v)`.
 */
export type Option<T extends {}> = Some<T> | None;

export function Some<T extends {}>(v: T): Some<T> {
    return v;
}

export function None<T extends {}>(): Option<T> {
    return null;
}

type Nullish<T> = T extends null | undefined ? T : never;
type Maybe<T> = NonNullable<T> | Nullish<T>;

export module Option {
    /**
     * Create an option from a value, returning `None` if the value is `null` or
     * `undefined` and `Some(v)` otherwise.
     */
    export function from<T>(
        v: T,
    ): Equal<Nullish<T>, T> extends true
        ? None
        : Equal<NonNullable<T>, T> extends true
        ? Some<NonNullable<T>>
        : Equal<Maybe<T>, T> extends true
        ? Option<NonNullable<T>>
        : never {
        return (v === null || v === undefined ? None() : Some(v)) as any;
    }

    /**
     * `none()` is `None`.
     */
    export function none<T extends {}>(): Option<T> {
        return None();
    }

    /**
     * `some(v)` is `Some(v)`.
     */
    export function some<T extends {}>(v: T): Some<T> {
        return Some(v);
    }

    /**
     * `value(o, defaultValue)` is `v` if `o` is `Some(v)` and `defaultValue`
     * otherwise.
     */
    export function value<T extends {}>(o: Option<T>, defaultValue: T): T {
        if (is_none(o)) {
            return defaultValue;
        }
        return get(o);
    }

    /**
     * `get(o)` is `v` if `o` is `Some(v)` and throws otherwise.
     * @throws an {@link Error} if `o` is `None`.
     */
    export function get<T extends {}>(o: Option<T>): T {
        if (is_none(o)) {
            throw new Error("tried to get value of none");
        }
        return o;
    }

    /**
     * `bind(o, f)` is `f(v)` if `o` is `Some(v)` and `None` if `o` is `None`.
     */
    export function bind<T extends {}, U extends {}>(
        o: Option<T>,
        f: (v: T) => Option<U>,
    ): Option<U> {
        if (is_none(o)) {
            return None();
        }
        const v: T = o;
        return f(v);
    }

    /**
     * `map(f, o)` is `None` if `o` is `None` and `Some(f(v))` if `o` is
     * `Some(v)`. If `f(v)` is `null` or `undefined`, `None` is returned.
     */
    export function map<T extends {}, U extends {}>(
        f: (v: T) => U,
        o: Option<T>,
    ): Option<U> {
        if (is_none(o)) {
            return None();
        }
        const v: T = o;
        return Some(f(v));
    }

    /**
     * `fold({none, some}, o)` is `none` if `o` is `None` and `some(v)` if `o`
     * is `Some(v)`.
     */
    export function fold<T extends {}, U extends {}>(
        { none, some }: { none: () => U; some: (v: T) => U },
        o: Option<T>,
    ): U {
        if (is_none(o)) {
            return none();
        }
        const v: T = o;
        return some(v);
    }

    /**
     * `iter(f, o)` is `f(v)` if `o` is `Some(v)` and `void` otherwise.
     */
    export function iter<T extends {}>(f: (v: T) => void, o: Option<T>): void {
        if (is_some(o)) {
            const v: T = o;
            f(v);
        }
    }

    /**
     * `is_none(o)` is `true` if and only if `o` is `None`.
     */
    export function is_none<T extends {}>(value: Option<T>): value is None {
        return value === undefined || value === null;
    }

    /**
     * `is_some(o)` is `true` if and only if `o` is `Some(v)`.
     */
    export function is_some<T extends {}>(value: Option<T>): value is Some<T> {
        return value !== undefined && value !== null;
    }

    /**
     * `equal(eq, o0, o1)` is `true` if and only if `o0` and `o1` are both `None`
     * or if they are `Some(v0)` and `Some(v1)` and `eq(v0, v1)` is `true`.
     */
    export function equal<T extends {}>(
        eq: (a: T, b: T) => boolean,
        o0: Option<T>,
        o1: Option<T>,
    ): boolean {
        const o0_is_none = is_none(o0);
        const o1_is_none = is_none(o1);
        if (o0_is_none && o1_is_none) {
            return true;
        }
        if (o0_is_none || o1_is_none) {
            return false;
        }
        return eq(o0, o1);
    }

    /**
     * `compare(cmp, o0, o1)` is a total order on options using `cmp` to compare
     * values wrapped by `Some(_)`. `None` is smaller than `Some(_)` values.
     */
    export function compare<T extends {}>(
        cmp: (a: T, b: T) => Ordering,
        o0: Option<T>,
        o1: Option<T>,
    ): Ordering {
        const o0_is_none = is_none(o0);
        const o1_is_none = is_none(o1);
        if (o0_is_none && o1_is_none) {
            return Ordering.Equal;
        }
        if (o0_is_none) {
            return Ordering.Less;
        }
        if (o1_is_none) {
            return Ordering.Greater;
        }
        return cmp(o0, o1);
    }

    /**
     * `to_array(o)` is `[]` if `o` is `None` and `[v]` if `o` is `Some(v)`.
     */
    export function to_array<T extends {}>(o: Option<T>): Array<T> {
        return is_none(o) ? [] : [o];
    }

    /**
     * `to_iter(o)` is an iterator that yields `v` if `o` is `Some(v)` and does
     * not yield otherwise.
     */
    export function* to_iter<T extends {}>(o: Option<T>): Iterator<T> {
        if (is_some(o)) {
            yield o;
        }
    }
}
