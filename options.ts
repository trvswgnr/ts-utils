import { Nominal, Ordering } from "./shared";

export type Some<T> = Nominal<T, "Some">;
export type None = null | undefined;
export type Option<T> = Some<T> | None;

export function Some<T>(v: T): Option<T> {
    return Nominal(v);
}

export function None<T>(): Option<T> {
    return null;
}

export module Option {
    /**
     * `none()` is `None`.
     */
    export function none<T>(): Option<T> {
        return null;
    }

    /**
     * `some(v)` is `Some(v)`.
     */
    export function some<T>(v: T): Option<T> {
        return Nominal(v);
    }

    /**
     * `value(o, defaultValue)` is `v` if `o` is `Some(v)` and `defaultValue`
     * otherwise.
     */
    export function value<T>(o: Option<T>, defaultValue: T): T {
        if (is_none(o)) {
            return defaultValue;
        }
        return o;
    }

    /**
     * `get(o)` is `v` if `o` is `Some(v)` and throws otherwise.
     * @throws an {@link Error} if `o` is `None`.
     */
    export function get<T>(o: Option<T>): T {
        if (is_none(o)) {
            throw new Error("tried to get value of none");
        }
        return o as T;
    }

    /**
     * `bind(o, f)` is `f(v)` if `o` is `Some(v)` and `None` if `o` is `None`.
     */
    export function bind<T, U>(
        o: Option<T>,
        f: (v: T) => Option<U>,
    ): Option<U> {
        if (is_none(o)) {
            return None();
        }
        return f(get(o));
    }

    /**
     * `join(oo)` is `Some(v)` if `oo` is `Some(Some(v))` and `None` otherwise.
     */
    export function join<T>(oo: Option<Option<T>>): Option<T> {
        if (is_none(oo)) {
            return None();
        }
        const o = get(oo) as Option<T>;
        if (is_none(o)) {
            return None();
        }
        return o;
    }

    /**
     * `map(f, o)` is `None` if `o` is `None` and `Some(f(v))` if `o` is
     * `Some(v)`.
     */
    export function map<T, U>(f: (v: T) => U, o: Option<T>): Option<U> {
        if (is_none(o)) {
            return None();
        }
        return Some(f(get(o)));
    }

    /**
     * `fold({none, some}, o)` is `none` if `o` is `None` and `some(v)` if `o`
     * is `Some(v)`.
     */
    export function fold<T, U>(
        { none, some }: { none: () => U; some: (v: T) => U },
        o: Option<T>,
    ): U {
        return is_none(o) ? none() : some(get(o));
    }

    /**
     * `iter(f, o)` is `f(v)` if `o` is `Some(v)` and `void` otherwise.
     */
    export function iter<T>(f: (v: T) => void, o: Option<T>): void {
        if (is_some(o)) {
            f(get(o));
        }
    }

    /**
     * `is_none(o)` is `true` if and only if `o` is `None`.
     */
    export function is_none<T>(value: Option<T>): value is None {
        return value === null || value === undefined;
    }

    /**
     * `is_some(o)` is `true` if and only if `o` is `Some(v)`.
     */
    export function is_some<T>(value: Option<T>): value is Some<T> {
        return value !== null && value !== undefined;
    }

    /**
     * `equal(eq, o0, o1)` is `true` if and only if `o0` and `o1` are both `None`
     * or if they are `Some(v0)` and `Some(v1)` and `eq(v0, v1)` is `true`.
     */
    export function equal<T>(
        eq: (a: T, b: T) => boolean,
        o0: Option<T>,
        o1: Option<T>,
    ): boolean {
        return is_none(o0) ? is_none(o1) : is_some(o1) && eq(get(o0), get(o1));
    }

    /**
     * `compare(cmp, o0, o1)` is a total order on options using `cmp` to compare
     * values wrapped by `Some(_)`. `None` is smaller than `Some(_)` values.
     */
    export function compare<T>(
        cmp: (a: T, b: T) => Ordering,
        o0: Option<T>,
        o1: Option<T>,
    ): Ordering {
        switch (true) {
            case is_none(o0) && is_none(o1):
                return Ordering.Equal;
            case is_none(o0) && is_some(o1):
                return Ordering.Less;
            case is_some(o0) && is_none(o1):
                return Ordering.Greater;
            default:
                return cmp(get(o0), get(o1));
        }
    }

    /**
     * `to_array(o)` is `[]` if `o` is `None` and `[v]` if `o` is `Some(v)`.
     */
    export function to_array<T>(o: Option<T>): Array<T> {
        return is_none(o) ? [] : [get(o)];
    }
}
