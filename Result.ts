/**
 * Result values.
 *
 * Result values handle computation results and errors in an explicit and
 * declarative manner without resorting to exceptions.
 *
 * @module
 */

import { Nominal } from "./Nominal";
import { Ordering } from "./shared";

const OK = Symbol("Ok");
const ERR = Symbol("Err");

type ResultTSError<Msg extends string> = Msg & {
    [ERR]: never;
};

type CheckGeneric<A, B> = [B] extends [never]
    ? ResultTSError<"Type parameter cannot be inferred and must be explicitly provided">
    : A;

export type Ok<T> = Nominal<T, typeof OK>;
export type Err<E> = Nominal<E, typeof ERR>;

/**
 * The type for result values. Either a value `Ok(v)` or an error `Err(e)`.
 */
export type Result<T, E> = Ok<T> | Err<E>;

export function Ok<T, E>(value: T): Result<T, E> {
    return Nominal(value, OK);
}

export function Err<E, T = never>(error: E): Result<T, E> {
    return Nominal(error, ERR);
}

export module Result {
    export function is_result(x: unknown): x is Result<unknown, unknown> {
        return (
            typeof x === "object" &&
            x !== null &&
            Nominal.is_nominal(x) &&
            (Nominal.type(x) === OK || Nominal.type(x) === ERR)
        );
    }

    /**
     * `ok(v)` is `Ok(v)`.
     */
    export function ok<T, E>(v: T): Result<T, E> {
        return Ok(v);
    }

    /**
     * `err(e)` is `Err(e)`.
     */
    export function err<T, E>(e: E): Result<T, E> {
        return Err(e);
    }

    /**
     * `value(r, fallback)` is `v` if `r` is `Ok(v)` and `fallback` otherwise.
     */
    export function value<T, E>(r: Result<T, E>, fallback: T): T {
        return is_ok(r) ? get_ok(r) : fallback;
    }

    /**
     * `get_ok(r)` is `v` if `r` is `Ok(v)` and throws otherwise.
     * @throws if `r` is `Err(_)`
     */
    export function get_ok<T, E>(r: Result<T, E>): T {
        if (is_ok(r)) {
            return Nominal.value(r);
        }
        throw new Error("Tried to get Ok value from Err");
    }

    /**
     * `get_err(r)` is `e` if `r` is `Err(e)` and throws otherwise.
     * @throws if `r` is `Ok(_)`
     */
    export function get_err<T, E>(r: Result<T, E>): E {
        if (is_err(r)) {
            return Nominal.value(r);
        }
        throw new Error("Tried to get Err value from Ok");
    }

    /**
     * `bind(r, f)` is `f(v)` if `r` is `Ok(v)` and `r` if `r` is `Err(_)`.
     */
    export function bind<T, E, F>(
        r: Result<T, E>,
        f: (v: T) => Result<F, E>,
    ): Result<F, E> {
        return is_ok(r) ? f(get_ok(r)) : r;
    }

    /**
     * `join(rr)` is `r` if `rr` is `Ok(r)` and `rr` if `rr` is `Err(_)`.
     */
    export function join<T, E>(rr: Result<Result<T, E>, E>): Result<T, E> {
        return is_ok(rr) ? get_ok(rr) : rr;
    }

    /**
     * `map(f, r)` is `Ok(f(v))` if `r` is `Ok(v)` and `r` if `r` is `Err(_)`.
     */
    export function map<T, E, F>(
        f: (v: T) => F,
        r: Result<T, E>,
    ): Result<F, E> {
        return is_ok(r) ? Ok(f(get_ok(r))) : r;
    }

    /**
     * `map_err(f, r)` is `Err(f(e))` if `r` is `Err(e)` and `r` if `r` is `Ok(_)`.
     */
    export function map_err<T, E, F>(
        f: (e: E) => F,
        r: Result<T, E>,
    ): Result<T, F> {
        return is_err(r) ? Err(f(get_err(r))) : r;
    }

    /**
     * `fold({ ok, err }, r)` is `ok(v)` if `r` is `Ok(v)` and `err(e)` if `r` is `Err(e)`.
     */
    export function fold<T, E, C>(
        fns: { ok: (v: T) => C; err: (e: E) => C },
        r: Result<T, E>,
    ): C {
        return is_ok(r) ? fns.ok(get_ok(r)) : fns.err(get_err(r));
    }

    /**
     * `iter(f, r)` is `f(v)` if `r` is `Ok(v)` and `void` otherwise.
     */
    export function iter<T, E>(f: (v: T) => void, r: Result<T, E>): void {
        if (is_ok(r)) {
            f(get_ok(r));
        }
    }

    /**
     * `iter_err(f, r)` is `f(e)` if `r` is `Err(e)` and `void` otherwise.
     */
    export function iter_err<E>(
        f: (e: E) => void,
        r: Result<unknown, E>,
    ): void {
        if (is_err(r)) {
            f(get_err(r));
        }
    }

    /**
     * `is_ok(r)` is `true` if `r` is `Ok(_)` and `false` otherwise.
     */
    export function is_ok<T, E>(result: Result<T, E>): result is Ok<T> {
        return Nominal.type(result) === OK;
    }

    /**
     * `is_err(r)` is `true` if `r` is `Err(_)` and `false` otherwise.
     */
    export function is_err<T, E>(result: Result<T, E>): result is Err<E> {
        return Nominal.type(result) === ERR;
    }

    /**
     * `equal({ok, err}, r0, r1)` tests equality of `r0` and `r1` using `ok` and
     * `err` to respectively compare values wrapped by `Ok` and `Err`.
     */
    export function equal<T, E>(
        fns: {
            ok: (v0: T, v1: T) => boolean;
            err: (e0: E, e1: E) => boolean;
        },
        r0: Result<T, E>,
        r1: Result<T, E>,
    ): boolean {
        if (is_ok(r0) !== is_ok(r1)) {
            return false;
        }
        return is_ok(r0)
            ? fns.ok(get_ok(r0), get_ok(r1))
            : fns.err(get_err(r0), get_err(r1));
    }

    /**
     * `compare({ok, err}, r0, r1)` totally orders `r0` and `r1` using `ok` and
     * `err` to respectively compare values wrapped by `Ok` and `Err`. `Ok`
     * values are smaller than `Err` values.
     */
    export function compare<T, E>(
        fns: {
            ok: (v0: T, v1: T) => Ordering;
            err: (e0: E, e1: E) => Ordering;
        },
        r0: Result<T, E>,
        r1: Result<T, E>,
    ): Ordering {
        if (is_ok(r0) && is_ok(r1)) {
            return fns.ok(get_ok(r0), get_ok(r1));
        }
        if (is_err(r0) && is_err(r1)) {
            return fns.err(get_err(r0), get_err(r1));
        }
        return is_ok(r0) ? Ordering.Less : Ordering.Greater;
    }
}
